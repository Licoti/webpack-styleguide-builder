## About

This is a Kss-node Style-Guide builder bundeled with webpack 4.
Note: This is currently a WIP.

## Requirements

* node `^8.9.4`

## Get started
Clone the project directory and `npm install`.


Now, you can generate the Style guide :

```
npm run kss
```

This will read the scss comments at the assets files and generate statics html files in styleguide folder. For more informations visit the [KSS documentation](https://github.com/kss-node/kss-node) 
The base theme used is : [Michelangelo Styleguide](https://github.com/stamkracht/michelangelo) 

**Then you can update your css & js in the assets folder.**


## Console Commands

|`npm run <script>`|Description|
|-------------------|-----------|
|`dev`|Compile files with a simple watch|
|`dev:start`|Serves your app at `localhost:8080`. HMR will be enabled in development.|
|`prod`|Compiles the styleguide to `~/public/dist` by default).|

## Application Structure


```
├── public                   # Static public assets, the folder for the compiled output (ignored by git)
├── styleguide               # Html generated with the kss run command
├── templates                # Custom templates
├── assets                   # Application source code
│   ├── css                  
│   ├── js                   
│   ├── img                  
│── webpack.config.js        # Webpack configuration
└── package.json             # The list of 3rd party libraries and utilities
```

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


## Read more about :
- https://css-tricks.com/build-style-guide-straight-sass
- https://github.com/davidhund/styleguide-generators


## Change log

### 1.0.0

> 2018-11-06

- initial release
