const { createShell } = require('@sonha/scripts')
const $ = createShell(__dirname)

exports.dev = () => $('next dev')
exports.build = () => $('next build; next export')
