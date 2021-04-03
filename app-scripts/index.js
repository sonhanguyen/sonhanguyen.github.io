const webScripts = require('@sonha/web-scripts')
const { createShell, cli } = require('@sonha/scripts')
const $ = createShell(__dirname)

module.exports = {
  ...webScripts,

  dev() {
    // webScripts.storybook()
    $('next dev')
  },

  async build() {
    await $('next build')
    return $('next export')
  }
}

if (require.main === module) {
  cli(module.exports, 'interactiveUpgrade')
}