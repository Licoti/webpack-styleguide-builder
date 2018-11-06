## About

This is a Kss-node Style-Guide builder bundeled with webpack 4.

## Get started
Clone the project directory and `npm install`.


Now, you can generate the Style guide :

```
npm run kss
```

This will generate statics html files in styleguide folder. For more informations visit the [KSS documentation](https://github.com/kss-node/kss-node) 


**Then you can update your css & js in the assets folder.**

## Useful stuff

For simple watch :
```
npm run dev
```

For watch with Webpack HMR :
```
npm run dev:start
```
  
For build the project :
```
npm run prod
```

All files are now at Public/build folder

## Critical CSS

If you want critical css that extract code in a new generated css file, use the comment below between your declaration

```
/*!critical:start */
div {
  ...
}
/*!critical:end */
```

This use [postcss-critical-split](https://github.com/mrnocreativity/postcss-critical-split) and [postcss-pipeline-webpack-plugin](https://github.com/mistakster/postcss-pipeline-webpack-plugin)

## Change log

### 1.0.0

> 2018-11-06

- initial release
