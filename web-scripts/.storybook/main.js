// import this file and override if needed

const { execSync: $ } = require('child_process')
const { SB_PATTERN = '**/*.stories.(md|js|ts)x' } = process.env

module.exports = {
  presets: [
    { name: '@storybook/addon-docs/preset',
      options: { configureJSX: true }
    }
  ],
  addons: [
    '@storybook/addon-viewport/register'
  ],
  stories: [
    String($('npm root')).trim().replace(/node_modules$/, SB_PATTERN)
  ],
  async webpackFinal(config) {
    config.module.rules.push(
      {
        test: /\.tsx?$/,
        loader: require.resolve('babel-loader'),
        options: {
          presets: [
            [ require.resolve('babel-preset-react-app'),
              { flow: false, typescript: true }
            ]
          ]
        },
      },
      {
        test: /\.s?css$/,
        use: [require.resolve('style-loader'), require.resolve('css-loader')],
      },
      {
        enforce: 'pre',
        test: /\.s?css$/,
        loader: require.resolve('sass-loader')
      },
    )
    
    return config
  }
}