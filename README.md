# Expose Members loader for webpack

## Inspiration

I was using the [Expose loader for webpack](https://github.com/webpack/expose-loader), because I simply needed to expose some of the variables of legacy code (now served with Webpack and adapted to an ES6 approach) to the `window` scope.

Rapidly I realized that needed to use the [Exports loader](https://github.com/webpack/exports-loader) together with the [Expose loader for webpack](https://github.com/webpack/expose-loader), until I reached the point where by exporting several members of a module, I needed to declared all of them individually to the global scope.

Like:

```javascript
import 'expose-members?mySpace.functionA,mySpace.functionB,objectA!exports?functionA,functionB,objectA!imports?Something=>window.something!legacy/javascript/app';
```

Of course I could have done twice or more the same import using only one default `exports` together with an `expose`, like:

```javascript
import 'expose-members?mySpace.functionA!exports?functionA!legacy/javascript/app';
import 'expose-members?mySpace.functionB!exports?functionB!legacy/javascript/app';
import 'expose-members?objectA!exports?objectA!legacy/javascript/app';
```

But that's not exactly the proper way to solve it. So decided to extend the original [Expose loader for webpack](https://github.com/webpack/expose-loader).

Feel free to give feedback.

## Usage

```javascript
require("expose-members?memberA,memberB!./file.js");
// Exposes the export members for file.js to the global context on properties "memberA" and "memberB".
// In web browsers, window.memberA and window.memberB is then available.
```
This line works to expose React.PropTypes to the web browser:

```javascript
require("expose-members?PropTypes!react");
```

Thus, `window.PropTypes` is then available to any extension that wants to use it.

Alternately, you can set this in your config file:

```javascript
module: {
  loaders: [
    { test: require.resolve("react"), loader: "expose-members?PropTypes" }
  ]
}
```
Also for multiple expose you can use `!` in loader string:
```javascript
module: {
  loaders: [
    { test: require.resolve("myModule"), loader: "expose-members?memberA2,memberB2!expose-members?memberA1,memberB1" },
  ]
}
```

You could also namespace the exposers you want like follows:
```javascript
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
