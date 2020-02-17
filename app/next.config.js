const { patchForLibSrc } = require('@sonha/app-scripts/webpack')

module.exports = {
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    patchForLibSrc(config)

    return config
  }
}