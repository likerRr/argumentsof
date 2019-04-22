import argumentsOf, { create } from './argumentsOf';

describe('Inspector', () => {
  describe('Should parse arguments of', () => {
    const expected = [{
      rest: false,
      name: 'a',
    }, {
      rest: false,
      name: 'b',
    }];

    it('regular function', () => {
      const inspect = create();

      function sum(a = 1, b) {
        return a + b;
      }

      expect(inspect(sum)).toMatchObject(expected);
    });

    it('arrow function', () => {
      const inspect = create();

      const sum = (a, b) => {
        return a + b;
      };

      expect(inspect(sum)).toMatchObject(expected);
    });

    it('class constructor', () => {
      const inspect = create();

      class Sum {
        constructor(a, b) {
          return a + b;
        }
      }

      expect(inspect(Sum)).toMatchObject(expected);
    });
  });

  describe('Should parse rest argument of', () => {
    const expected = [{
      rest: false,
      name: 'a',
    }, {
      rest: true,
      name: 'rest',
    }];

    it('regular function', () => {
      const inspect = create();

      function sum(a, ...rest) {
        return rest;
      }

      expect(inspect(sum)).toMatchObject(expected);
    });

    it('arrow function', () => {
      const inspect = create();

      const sum = (a, ...rest) => {
        return rest;
      };

      expect(inspect(sum)).toMatchObject(expected);
    });

    it('class constructor', () => {
      const inspect = create();

      class Sum {
        constructor(a, ...rest) {
          return rest;
        }
      }

      expect(inspect(Sum)).toMatchObject(expected);
    });
  });

  describe('Should parse empty arguments of', () => {
    const expected = [];

    it('regular function', () => {
      const inspect = create();

      function sum() {
        return 1 + 2;
      }

      expect(inspect(sum)).toEqual(expected);
    });

    it('arrow function', () => {
      const inspect = create();

      const sum = () => {
        return 1 + 2;
      };

      expect(inspect(sum)).toEqual(expected);
    });

    it('class constructor', () => {
      const inspect = create();

      class Sum {
        constructor() {

        }
      }

      expect(inspect(Sum)).toEqual(expected);
    });
  });

  describe('Config', () => {
    const sumArrow = (a, b) => a + b;
    class Sum {constructor(a, b) {return a + b;}}
    function sumRegular(a, b) {return a + b;}

    describe('Arrow only', () => {
      const inspectArrow = create({ arrow: true });

      it('Should inspect arrow function', () => {
        expect(inspectArrow(sumArrow).length).toBe(2);
      });

      it('Should ignore regular function', () => {
        expect(inspectArrow(sumRegular).length).toBe(0);
      });

      it('Should ignore class constructor', () => {
        expect(inspectArrow(Sum).length).toBe(0);
      });
    });

    describe('Regular only', () => {
      const inspectArrow = create({ regular: true });

      it('Should inspect regular function', () => {
        expect(inspectArrow(sumRegular).length).toBe(2);
      });

      it('Should ignore arrow function', () => {
        expect(inspectArrow(sumArrow).length).toBe(0);
      });

      it('Should ignore class constructor', () => {
        expect(inspectArrow(Sum).length).toBe(0);
      });
    });

    describe('Constructor only', () => {
      const inspectArrow = create({ class: true });

      it('Should inspect class constructor', () => {
        expect(inspectArrow(Sum).length).toBe(2);
      });

      it('Should ignore arrow function', () => {
        expect(inspectArrow(sumArrow).length).toBe(0);
      });

      it('Should ignore regular function', () => {
        expect(inspectArrow(sumRegular).length).toBe(0);
      });
    });
  });

  it('Should parse arrow function with a single argument without braces', () => {
    const inspect = create();

    const plusOne = a => {
      return 1 + a;
    };

    expect(inspect(plusOne)).toMatchObject([{
      rest: false,
      name: 'a',
    }]);
  });

  it('Exports instance of `argumentsOf` which parses all kind of callables', () => {
    const sumArrow = (a, b) => a + b;
    class Sum {constructor(a, b) {return a + b;}}
    function sumRegular(a, b) {return a + b;}

    expect(argumentsOf(sumArrow).length).toBe(2);
    expect(argumentsOf(sumRegular).length).toBe(2);
    expect(argumentsOf(Sum).length).toBe(2);
  });
});
