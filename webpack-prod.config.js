var webpack = require('webpack')


module.exports = {
  devtool: 'source-map',

  entry: './js/index.jsx',


  // add this handful of plugins that optimize the build
  // when we're in production
  // plugins: [
  //   new webpack.optimize.DedupePlugin(),
  //   new webpack.optimize.OccurrenceOrderPlugin(),
  //   new webpack.optimize.UglifyJsPlugin()
  // ],


  plugins: [
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.UglifyJsPlugin({
      minimize: true,
      compress: {
        warnings: false
      }
    }),
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('production')
      }
    })
  ],


  output: {
    path: 'public/javascripts',
    filename: 'bundle.js',
    publicPath: ''
  },

  resolve: {
    extensions: ['', '.js', '.jsx']
  },

 // module: {
 //    loaders: [
 //      { test: /\.js?$/,
 //        loader: 'babel',
 //        exclude: /node_modules/ },
 //      // { test: /\.scss?$/,
 //        // loader: 'style!css!sass',
 //        // include: path.join(__dirname, 'src', 'styles') },
 //      { test: /\.png$/,
 //        loader: 'file' },
 //      { test: /\.(ttf|eot|svg|woff(2)?)(\?[a-z0-9]+)?$/,
 //        loader: 'file'}
 //    ]
 //  }

  module: {
    loaders: [
      { test: /\.jsx?$/, exclude: /node_modules/, loader: 'babel-loader' },
      { test: /\.(png|woff|woff2|eot|ttf|svg)$/, loader: 'url-loader?limit=100000' }
    ]
  }
}
