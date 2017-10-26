import path from 'path';
import nodeExternals from 'webpack-node-externals';
import webpack from 'webpack';
import HappyPack from 'happypack';

const NODE_MODULES = path.resolve(__dirname, 'node_modules');
const CLIENT = path.resolve(__dirname, 'client');

const loaders = [
  { test: /\.js$/, loader: 'happypack/loader?id=js', exclude: NODE_MODULES, include: CLIENT },
  { test: /\.json$/, loader: 'happypack/loader?id=json' },
  { test: /\.css$/, loader: 'happypack/loader?id=css' },
  { test: /\.scss$/, loader: 'happypack/loader?id=scss' }
];

const plugins = [
  new webpack.HotModuleReplacementPlugin(),
  new webpack.NoEmitOnErrorsPlugin(),
  new HappyPack({ id: 'js', loaders: ['babel-loader'] }),
  new HappyPack({ id: 'json', loaders: ['json-loader'] }),
  new HappyPack({ id: 'css', loaders: ['style-loader!css-loader'] }),
  new HappyPack({ id: 'scss', loaders: ['style-loader', 'css-loader', 'sass-loader'] })
];

const client = {
  entry: [
    'babel-polyfill',
    'react-hot-loader/patch',
    './client/client.js',
  ],
  output: {
    path: path.join(__dirname, 'client', 'assets', 'build'),
    filename: 'client.js',
  },
  module: {
    loaders
  },
  plugins
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
    filename: 'server.js',
    libraryTarget: 'commonjs2',
  },
  module: {
    loaders
  },
  plugins
};

export default [client, server];
