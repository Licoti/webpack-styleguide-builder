const path= require('path')
const webpack = require('webpack')
const fs = require('fs')

const MiniCssExtractPlugin = require("mini-css-extract-plugin")
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const ManifestPlugin = require('webpack-manifest-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const PostCssPipelineWebpackPlugin = require('postcss-pipeline-webpack-plugin')
const criticalSplit = require('postcss-critical-split')
const CssoWebpackPlugin = require('csso-webpack-plugin').default
const KssWebpackPlugin = require('kss-webpack-plugin')

let KssConfig = {
  source: './assets/css',
  title: "Style Guidee",
  destination: "styleguide",
  builder: "styleguide/custom-template/",
  styleguide_version: "1.0.0",
  homepage: "styleguide-homepage.md"
};

const pipelinePlugin = new PostCssPipelineWebpackPlugin({
  prefix: 'critical',
  suffix: '',
  pipeline: [
    criticalSplit({
      output: criticalSplit.output_types.CRITICAL_CSS,
      startTag: "!critical:start",
      endTag: "!critical:end"
    })
  ],
});

const dev = process.env.NODE_ENV === "dev"
const kss = process.env.NODE_ENV === "kss"

let cssLoaders = [
  { loader: 'css-loader', options: { importLoaders: 1 } }
]

if (!dev) {
  cssLoaders.push({
    loader: 'postcss-loader', options: {
      plugins: (loader) => [
        require('autoprefixer')({
          browsers: ['last 4 versions', 'ie > 9'] //A mettre à jour avec browserslist
        }),
      ]
    }
  })
}

let config = {
  mode: 'none',
  entry: {
    app: ['./assets/css/app.scss', './assets/js/app.js']
  },
  watch: dev,
  watchOptions: {
    aggregateTimeout: 300,
    poll: 1000,
    ignored: ['node_modules']
  },
  output: {
    path: path.resolve(__dirname, './public/build'),
    filename: dev ? '[name].js' : '[name].[hash:4].js',
  },
  devtool: dev ? "cheap-module-eval-source-map" : "source-map",
  devServer: {
    overlay: true,
    contentBase: path.resolve(__dirname, './public/build'),
    publicPath: '/',
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
      "Access-Control-Allow-Headers": "X-Requested-With, content-type, Authorization"
    }
  },
  module: {
    rules: [
      {
        enforce: 'pre',
        test: /\.m?js$/,
        exclude: /(node_modules)/,
        use: ['eslint-loader']
      },
      {
        test: /\.m?js$/,
        exclude: /(node_modules)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      },
      {
        test: /\.css$/,
        use: cssLoaders
      },
      {
        test: /\.scss$/,
        use: [
          MiniCssExtractPlugin.loader,
          ...cssLoaders,
          { loader: 'sass-loader', options: { sourceMap: true } }
        ]
      },
      {
        test: /\.(png|jpg|gif)$/i,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 8192,
              name: '[path][name][hash:4].[ext]'
            }
          }
        ]
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf|svg)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[path][name][hash:4].[ext]',
            }
          }
        ]
      },
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: dev ? '[name].css' : "[name].[hash:4].css",
      chunkFilename: dev ? '[id].css' : "[hash:4].css",
      disabled: dev
    }),

    pipelinePlugin,

    new CleanWebpackPlugin(['public/build'], {
      root: path.resolve('./'),
      verbose: true,
      dry: false
    }),

    new CopyWebpackPlugin([
      {
        from: 'styleguide/custom-template/kss-assets',
        to: 'kss-assets'
      }
    ]),
  ]
}

let dirStyleguide = './styleguide';
let filesStyleguide = fs.readdirSync(dirStyleguide);
filesStyleguide.forEach(filesStyleguide => {
  if (filesStyleguide.match(/\.html$/)) {
    let filename = filesStyleguide.substring(0, filesStyleguide.length - 4);
    config.plugins.push(
      new HtmlWebpackPlugin({
        template: dirStyleguide + '/' + filename + 'html',
        filename: filename + 'html',
        cache: true,
        //hash: true
      })
    );
  }
})

let dirTemplates = './templates';
let filesTemplates = fs.readdirSync(dirTemplates);
filesTemplates.forEach(filesTemplates => {
  if (filesTemplates.match(/\.html$/)) {
    let filename = filesTemplates.substring(0, filesTemplates.length - 4);
    config.plugins.push(
      new HtmlWebpackPlugin({
        template: dirTemplates + '/' + filename + 'html',
        filename: filename + 'html',
        cache: true,
        //hash: true
      })
    );
  }
})

if (kss) {
  config.plugins.push((
    new CleanWebpackPlugin(['styleguide/*.html'], {
      root: path.resolve('./'),
      verbose: true,
      dry: false,
      beforeEmit: true
    })
  ))
  config.plugins.push(new KssWebpackPlugin(KssConfig))
}

if (!dev) {
  config.plugins.push(
    new CssoWebpackPlugin({
      restructure: false,
      comments: true
    })
  )
  config.plugins.push(new UglifyJsPlugin({
    test: /\.js(\?.*)?$/i,
    sourceMap: false
  }))
  config.plugins.push(new ManifestPlugin())
}

module.exports = config