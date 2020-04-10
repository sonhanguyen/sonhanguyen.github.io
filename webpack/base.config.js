const name = 'static/[name].[hash].[ext]'

module.exports = {
  module: {
    rules: [
      { test: /\.(gif|svg|eot|ttf|woff|woff2)$/,
        use: {
          loader: require.resolve('url-loader'),
          options: { name }
        }
      },
      { test: /\.(jpe?g|png)$/i,
        use: {
          loader: require.resolve('url-loader'),
          options: {
            limit: 10000,
            fallback: require.resolve('responsive-loader'),
            name: name.replace(/(\[hash\])/, '[width]-$1'),
            adapter: require('responsive-loader/sharp')
          }
        }
      }
    ]
  }
}
