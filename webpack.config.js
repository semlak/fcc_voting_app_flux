var webpack = require('webpack')


module.exports = {
  entry: './js/index.jsx',


  // add this handful of plugins that optimize the build
  // when we're in production
  plugins: process.env.NODE_ENV === 'production' ? [
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.optimize.UglifyJsPlugin()
  ] : [],


  output: {
    path: 'public/javascripts',
    filename: 'bundle.js',
    publicPath: ''
  },

  resolve: {
    extensions: ['', '.js', '.jsx']
  },

  module: {
    preLoaders: [
        // Javascript
        { test: /\.jsx?$/, loader: 'eslint', exclude: /node_modules/ }
    ],
    loaders: [
      { test: /\.jsx?$/, exclude: /node_modules/, loader: 'babel-loader?presets[]=es2015&presets[]=react' },
      { test: /\.(png|woff|woff2|eot|ttf|svg)$/, loader: 'url-loader?limit=100000' }
    ]
  },
  eslint: {
    failOnWarning: false,
    failOnError: true
  },
}
