const { createShell } = require('@sonha/scripts')
const $ = createShell(__dirname)

exports.dev = () => $('next dev')
exports.build = async () => {
  await $('next build')
  
  return $('next export')
}