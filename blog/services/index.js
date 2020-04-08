
const { createClient } = require('../libs/rpc')
const directory = createClient(require('./directory')).connect()
const path = require('path')

const flatten = tree => {
  if (tree.filePath && !tree.children) return [ tree ]

  return [].concat(
    ...Object
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
        const trim = '^' + dir
        filePath = filePath.substr(trim.length)
        const route = filePath
          .replace(/\/\\/g, '/')
          .replace(/(\/index)?\.[^.]+$/, '')

        return {
          props: {
            ...meta,
            path: route,
            component: `.${path.sep}${filePath}`
          },
          slug: route.split`/`
        }
      })
    )

  return {
    async getStaticPaths() {
      const index = await files
      return index.map(({ slug }) => ({ params: { slug }}))
    },
    async getStaticProps({ params }) {
      const index = await files
      const { props } = index.find(({ props }) => params.slug.join`/` === props.path)
      return { index, ...props }
    }
  }
}

module.exports = { pagesFromWebpackContext }
