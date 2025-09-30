const path = require('path');

module.exports = {
  entry: './script.ts',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
    library: { type: 'commonjs-module' },
    environment: {
      arrowFunction: false,
      const: false,
      destructuring: false,
      forOf: false,
      module: false,
    },
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  mode: 'production',
  target: 'webworker', // Best for k6
  externalsType: 'commonjs',
  externals: {
    'k6': 'k6',
    'k6/http': 'k6/http',
    'k6/options': 'k6/options',
    // add more k6 modules here if they are in use
  },
};