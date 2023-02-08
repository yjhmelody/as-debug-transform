# as-debug-transform

![CI](https://github.com/yjhmelody/as-debug-transform/workflows/CI/badge.svg)
![as-debug-transform](https://img.shields.io/npm/v/as-debug-transform?color=light-green&label=as-debug-transform)

> A simple conditional compilation library for testing or debugging.

## Usage

### install

```sh
npm install --save-dev as-debug-transform
```

Update your asconfig to include the transform:

```json
{
  "options": {
    ... // other options here
    "transform": ["as-debug-transform"]
  }
}
```

### Syntax

`@debugMode` decorator is used to decorate functions/methods/static methods. Its usage is as simple as `@inline/@global`.
When a function is decorated, its body will be erased if you want to compile production code.

You can use it in the following ways:

- Not set the env variable `DEBUG_MODE`. Transform will always erase function bodies.
- Set the env variable `DEBUG_MODE` to `false` or `0`. Transform will always keep function bodies.
- Set the env variable `DEBUG_MODE` to `debug`. Transform will keep function bodies when `optimizeLevel` < 2.

### Note

Now, `debugMode` only support `MethodDeclaration` and `FunctionDeclaration`. Maybe support for classes/namespaces/fields and more features may be added in the future, but it is practical enough for now.
