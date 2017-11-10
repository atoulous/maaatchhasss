import path from 'path';
import nodeExternals from 'webpack-node-externals';
import webpack from 'webpack';
import HappyPack from 'happypack';

const NODE_MODULES = path.resolve(__dirname, 'node_modules');
const CLIENT = path.resolve(__dirname, 'client');
const SERVER = path.resolve(__dirname, 'server');

const client = {
  entry: [
    'babel-polyfill',
    'react-hot-loader/patch',
    './client/client.js',
  ],
  output: {
    path: path.join(__dirname, 'client', 'assets', 'build'),
    filename: 'client-bundle.js',
  },
  module: {
    loaders: [
      { test: /\.js$/, loader: 'happypack/loader?id=js', exclude: NODE_MODULES, include: CLIENT },
      { test: /\.css$/, loader: 'happypack/loader?id=css' },
      { test: /\.scss$/, loader: 'happypack/loader?id=scss' }
    ]
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    new HappyPack({ id: 'js', loaders: ['react-hot-loader/webpack', 'babel-loader'] }),
    new HappyPack({ id: 'css', loaders: ['style-loader!css-loader'] }),
    new HappyPack({ id: 'scss', loaders: ['style-loader', 'css-loader', 'sass-loader'] })
  ],
  devServer: {
    host: 'localhost',
    port: 3000,
    hot: true,
  }
};

const server = {
  target: 'node',
  node: {
    __dirname: false,
  },
  externals: [nodeExternals({
    modulesFromFile: true,
  })],
  entry: {
    js: './server/server.js',
  },
  output: {
    path: path.join(__dirname, 'client', 'assets', 'build'),
    filename: 'server-bundle.js',
    libraryTarget: 'commonjs2',
  },
  module: {
    loaders: [
      { test: /\.js$/, loader: 'happypack/loader?id=js', exclude: NODE_MODULES, include: SERVER },
    ]
  },
  plugins: [
    new webpack.NamedModulesPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    new HappyPack({ id: 'js', loaders: ['babel-loader'] }),
  ]
};

export default [client, server];
