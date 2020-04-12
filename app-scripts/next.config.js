const { createPatch } = require('./webpack')

module.exports = {
  webpack: createPatch(),
  assetPrefix: './'
}
