const { createShell } = require('@sonha/scripts')
const $ = createShell(__dirname)

exports.storybook = () => $('start-storybook')
