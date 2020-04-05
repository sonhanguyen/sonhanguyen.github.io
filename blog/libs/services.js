
const { createClient } = require('./rpc')
const { list } = createClient(
  { address: require('.').fileListingService },
  [ 'list' ]
).connect()

const flatten = tree => {
  if (tree.filePath && !tree.children) return [ tree ]

  const result = []
  for (const descendants of Object.values(tree.children || tree).map(flatten)) {
    result.push(...descendants)
  }

  return result
}

const pagesFromWebpackContext = context => {
  const desc = context.id.split(' ')
  const pattern = desc.pop()
  const dir = desc.shift().replace('./', '')
  const files = list(RegExp(`^${dir}.+${pattern}`))
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
