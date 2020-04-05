module.exports = {
  module: {
    rules: [
      {
        test: /\.mdx$/,
        use: [
          { loader: require.resolve('babel-loader'),
            options: { presets: [require.resolve('next/babel') ] }
          },
          require.resolve('@mdx-js/loader')
        ]
      }
    ]
  },
  node: { __dirname: false },
  mode: 'development',
  resolve: {
    extensions: [ '*', '.ts', '.tsx', '.js', '.jsx', '.md', '.mdx' ]
  },
}
