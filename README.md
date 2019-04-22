# argumentsof

Npm module which parses arguments of any callables.

## Installation

`npm install argumentsof`

## Usage

```js
import argumnetsOf from 'argumentsof'

const sum = (one, ...numbers) => numbers.reduce((s, n) => s + n, one);

console.log(argumnetsOf(sum));
/*
[{
    name: 'one'
    rest: false,
}, {
    name: 'numbers'
    rest: true,
}]
*/
```

See `argumentsOf.test.js` for more examples.

## Limitations

1. It parses only arguments which have a name without default value.
2. Resulting from 1. - it can't parse destructuring or any arguments assignment.
3. Due to DX of code minification on client side, parsed names at runtime can differ from the source code. So it's preferable to be used on backend, where minification doesn't matter so much.

## Motivation

This package is mostly useful for implementing such things as, for example, an automatic dependency injection pattern by parsing. You can easily parse
class' arguments and then inject dependencies into constructor relying on the parsing result.

That's why it doesn't support parsing of destructuring and assignments. In the first case we can't extract the name of argument, and in the second - it's better to inject default value rather then to set it explicitly.

## API

### `default` export

`
` can parse named and anonymous function, arrow function and class constructor.

By default it exports a function which recognizes itself a type of callable and tries to parse it.

So the basic usage is just to import and use:

`import argumentsOf from 'argumentsof'` 

### `create`

It also exports a function which builds an `argumentsOf` function. `create` accepts a configuration object, which specifies what types of callables to parse.

```js
import { create } from 'argumentsof';

// Default configuration object
const argumentsOf = create({ 
  arrow: true, 
  class: true, 
  regular: true,
});
```

