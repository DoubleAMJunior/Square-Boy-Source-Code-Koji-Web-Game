const webpack = require("webpack");
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
//const SRC = path.resolve(__dirname, 'node_modules');

module.exports = {
  mode: "development",
  devtool: "eval-source-map",
  devServer:{
    compress: true,
    port: 8080,
    host: '0.0.0.0',
    disableHostCheck: true,
    historyApiFallback: true,
    overlay: true,
    public: process.env.KOJI_SERVICE_URL_frontend,
    hot:true
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader"
        }
      },
      {
        test: [/\.vert$/, /\.frag$/],
        use: "raw-loader"
      },
      {
        test: /\.(gif|png|jpe?g|svg|xml)$/i,
        use: "file-loader"
      },
      {
        test: /\.ogg$/,
        //include: SRC,
        loader: 'file-loader'
      },
      {
        test: /\.mp3$/,
      //  include: SRC,
        loader: 'file-loader'
    }
    ]
  },
  plugins: [
    new CleanWebpackPlugin({
      root: path.resolve(__dirname, "../")
      }),
      new webpack.HotModuleReplacementPlugin()
      ,
    new webpack.DefinePlugin({
      CANVAS_RENDERER: JSON.stringify(true),
      WEBGL_RENDERER: JSON.stringify(true)
    }),
    new HtmlWebpackPlugin({
      template: "./index.html"
    })
  ]
};
