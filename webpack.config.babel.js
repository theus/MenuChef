const webpack = require('webpack');
const path = require('path');
const pkg = require('./package.json');

module.exports = {
  devtool: 'source-map',
  entry: {
    MenuChef: './src/MenuChef.js'
  },
  output: {
    path: path.join(__dirname, './dist'),
    filename: '[name].js'
  },
  module: {
    rules: [
      {
        enforce: 'pre',
        test: /\.js$/,
        loader: 'standard-loader',
        exclude: /(node_modules)/,
      },
      {
        test: /\.html$/,
        exclude: /node_modules/,
        loader: 'html-loader',
        query: {
          minimize: true,
        }
      },
      {
        test: /\.css$/,
        exclude: /node_modules/,
        use: [
          'style-loader',
          'css-loader'
        ]
      },
      {
        test: /\.scss$/,
        use: [{
            loader: "style-loader"
          }, {
              loader: "css-loader"
          }, {
              loader: "sass-loader"
        }]
      },
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: [
          'babel-loader'
        ],
      },
    ],
  },
  resolve: {
    extensions: ['.webpack-loader.js', '.web-loader.js', '.loader.js', '.js', '.jsx'],
    modules: [
      path.resolve(__dirname, 'node_modules'),
      path.join(__dirname, './src')
    ]
  },
  devServer: {
    contentBase: path.join(__dirname, 'dist'),
    compress: true,
    port: 9000
  },
  plugins: [
    new webpack.BannerPlugin(`MenuChef v${pkg.version}
http://github.com/theus/MenuChef
Released under the MIT License.`),
    new webpack.optimize.UglifyJsPlugin({
      sourceMap: true,
      mangle: {
        except: ['MenuChef']
      }
    })
  ]
}