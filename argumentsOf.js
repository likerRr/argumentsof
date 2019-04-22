const ARROW_FN_MATCHER = /^\(?(.*?)\)?\s*?=>/;

const CONSTRUCTOR_MATCHER = /^class\s.*constructor\s*?\(([^)]*?)\)/;

const INLINE_COMMENT_MATCHER = /\/\*.*\*\//g;

const REGULAR_FN_MATCHER = /^function\s?.*?\(([^)]*?)\)/;

/**
 * @param {string} funcBody
 * @param matcher
 * @return {string|null}
 */
const matchInspector = (funcBody, matcher) => {
  const match = funcBody.match(matcher);

  return match ? match[1].trim() : null;
};

const restStrategy = (context, value) => {
  const rest = value[0] === '.';

  if (rest) {
    context.rest = true;
    context.name = value.substr(3);

    return true;
  }

  return false;
};

const assignmentStrategy = (context, value) => {
  const isAssignment = value.includes('=');

  if (isAssignment) {
    context.name = value.split('=')[0].trim();

    return true;
  }

  return false;
};

/**
 * @private
 * @param {string} argsStr
 * @return {{rest: boolean, name: *, value: *}[]|null}
 */
const buildTokens = argsStr => {
  if (!argsStr) {
    return [];
  }

  return argsStr
    .replace(INLINE_COMMENT_MATCHER, '')
    .split(',')
    .map(arg => {
      // Ensure no inline comments are parsed and trim the whitespace.
      const value = arg.trim();
      const result = {
        name: value,
        rest: false,
      };

      restStrategy(result, value) || assignmentStrategy(result, value);

      return result;
    })
    .filter(Boolean);
};

const defaultOptions = { arrow: true, class: true, regular: true };

export const create = ({ arrow = false, class: clazz = false, regular = false } = defaultOptions) => {
  /**
   * @param {function} func
   * @return {{rest: boolean, name: *, value: *}[]}
   */
  return func => {
    let argsStr;
    const fnBody = func.toString().replace(/\n/g, '');

    /* istanbul ignore else  */
    if (clazz) {
      argsStr = matchInspector(fnBody, CONSTRUCTOR_MATCHER);
    }

    /* istanbul ignore else  */
    if (!argsStr && arrow) {
      argsStr = matchInspector(fnBody, ARROW_FN_MATCHER);
    }

    /* istanbul ignore else  */
    if (!argsStr && regular) {
      argsStr = matchInspector(fnBody, REGULAR_FN_MATCHER);
    }

    return buildTokens(argsStr);
  };
};

export default create();
