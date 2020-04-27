const webScripts = require('@sonha/web-scripts')
const { createShell } = require('@sonha/scripts')
const $ = createShell(__dirname)

module.exports = {
  ...webScripts,

  dev: () => $('next dev'),

  async build() {
    await $('next build')
    return $('next export')
  }
}