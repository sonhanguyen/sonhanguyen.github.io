
const { createClient } = require('../libs/rpc')
const directory = createClient({ address: require('./services').directory }).connect()

const flatten = tree => {
  if (tree.filePath && !tree.children) return [ tree ]

  return [].concat(...Object
    .values(tree.children || tree)
    .map(flatten)
  )
}

const pagesFromWebpackContext = context => {
  const desc = context.id.split(' ')
  const pattern = desc.pop()
  const dir = desc.shift().replace('./', '')
  const files = directory.list(RegExp(`^${dir}.+${pattern}`))
    .then(flatten)
    .then(collection => collection
      .map(({ filePath, meta }) => {
        let slug = filePath.replace(/\.[^.]+$/, '')
        slug = slug.replace(/\/\\/g, '/')

        return {
          slug,
          props: {
            ...meta,
            component: filePath.replace(RegExp('^' + dir), '.')
          },
          name: slug.split('/').pop()
        }
      })
    )

  return {
    async getStaticPaths() {
      const index = await files
      return index.map(({ name }) => ({ params: { name }}))
    },
    async getStaticProps({ params }) {
      const index = await files
      const { props } = index.find(({ name }) => name === params.name)
      return { index, ...props }
    }
  }
}

module.exports = { pagesFromWebpackContext }
