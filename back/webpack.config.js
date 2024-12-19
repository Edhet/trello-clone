const path = require('path')

const {
  NODE_ENV = 'production',
} = process.env

module.exports = {
  entry: './src/main.ts',
  mode: NODE_ENV,
  target: 'node',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'index.js'
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  watch: NODE_ENV === 'development',
  module: {
    rules: [
        {
            test: /\.ts$/,
            exclude: /node_modules/,
            use: ['ts-loader']
        }
    ]
  },
  externals: {
    express: 'express'
  }
}