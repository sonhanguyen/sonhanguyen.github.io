const { createShell } = require('@sonha/scripts')
const $ = createShell(__dirname)

exports.dev = async() => {
  await $('next dev')
}