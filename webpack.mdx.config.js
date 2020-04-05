path = require('path')

module.exports = {
  module: {
    rules: [
      { test: /\.(js|ts|md)x?$/,
        use: 'babel-loader',
        exclude: /node_modules/
      },
      { test: /\.mdx?$/,
        enforce: 'pre',
        use: 'mdx-loader',
        exclude: /node_modules/
      }
    ]
  },
  node: { __dirname: false },
  mode: 'development',
  resolve: {
    extensions: [ '*', '.ts', '.tsx', '.js', '.jsx', '.md', '.mdx' ]
  },
}