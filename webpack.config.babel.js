import path from 'path';
import webpack from 'webpack';
import HappyPack from 'happypack';

const NODE_MODULES = path.resolve(__dirname, 'node_modules');
const CLIENT = path.resolve(__dirname, 'client');

export default {
  devtool: 'source-map',
  entry: [
    // 'babel-polyfill',
    // 'react-hot-loader/patch',
    // 'webpack-hot-middleware/client',
    path.resolve(CLIENT, 'client.js')
  ],
  output: {
    path: path.join(CLIENT, 'assets', 'build'),
    filename: 'bundle.js',
    publicPath: '/'
  },
  module: {
    loaders: [
      { test: /\.js$/, loader: 'happypack/loader?id=js', exclude: NODE_MODULES, include: CLIENT },
      { test: [/\.css$/, /\.scss$/], loader: 'happypack/loader?id=style' }
    ]
  },
  plugins: [
    new webpack.ProvidePlugin({
      jQuery: 'jquery',
      $: 'jquery',
      jquery: 'jquery',
      Popper: ['popper.js', 'default']
    }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.optimize.OccurrenceOrderPlugin(),
    new HappyPack({ id: 'js', loaders: ['react-hot-loader/webpack', 'babel-loader'] }),
    new HappyPack({ id: 'style', loaders: ['style-loader', 'css-loader', 'sass-loader'] })
  ],
  devServer: {
    host: 'localhost',
    port: 3000,
    hot: true,
  }
};
