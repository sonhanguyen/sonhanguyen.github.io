#!/usr/bin/env node

const { dev, build } = require('@sonha/app-scripts')
const { cli } = require('@sonha/scripts')

const directory = require('./services/directory')

cli({
  async dev() {
    directory.start()
    return await dev()
  },
  async build() {
    directory.start()
    return await build().then(directory.stop)
  }
})
