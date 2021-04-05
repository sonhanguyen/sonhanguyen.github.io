const { createPatch } = require('./webpack')

module.exports = {
  webpack: createPatch(),
  assetPrefix: './',
  // future: {
  //   webpack5: true,
  // }
}
