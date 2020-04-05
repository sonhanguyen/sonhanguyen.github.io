#!/usr/bin/env node

const { dev, build } = require('@sonha/app-scripts')
const { cli } = require('@sonha/scripts')

const fileListingService = require('./fileListingService')

cli({
  async dev() {
    fileListingService.start()
    return await dev()
  },
  async build() {
    fileListingService.start()
    return await build()
  }
})
