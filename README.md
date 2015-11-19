# expose loader for webpack

## Usage

``` javascript
require("expose-members?memberA,memberB!./file.js");
// Exposes the export members for file.js to the global context on properties "memberA" and "memberB".
// In web browsers, window.memberA and window.memberB is then available.
```
This line works to expose React.PropTypes to the web browser:

```
require("expose-members?PropTypes!react");
```

Thus, `window.PropTypes` is then available to any extension that wants to use it.

Alternately, you can set this in your config file:

```
module: {
  loaders: [
    { test: require.resolve("react"), loader: "expose-members?PropTypes" }
  ]
}
```
Also for multiple expose you can use `!` in loader string:
```
module: {
  loaders: [
    { test: require.resolve("myModule"), loader: "expose-members?memberA2,memberB2!expose?memberA1,memberB1" },
  ]
}
```

You could also namespace the exposers you want like follows:
```
module: {
  loaders: [
    { test: require.resolve("react"), loader: "expose-members?myNamespace.memberA,myNamespace.memberB" }
  ]
}
```

The `require.resolve` is a node.js call (unrelated to `require.resolve` in webpack
processing -- check the node.js docs instead). `require.resolve` gives you the
absolute path to the module ("/.../app/node_modules/react/react.js"). So the
expose only applies to the react module. And it's only exposed when used in the
bundle.

[Documentation: Imports in ES6](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import)
[Documentation: Using loaders](http://webpack.github.io/docs/using-loaders.html)

## License

MIT (http://www.opensource.org/licenses/mit-license.php)
