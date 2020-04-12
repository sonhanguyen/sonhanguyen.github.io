const { createClient } = require('@sonha/rpc')
const directory = createClient(require('./directory')).connect()

exports.pages = context => {
  const files = directory
    .list(context
      .keys()
      .map(context.resolve)
    )
    .then(index => index.map(
      ({ path, meta }) => {
        const component = context.key(path)
        path = context.path(path)
          .replace(/(\/index)?\.[^.]+$/, '')

        return {
          props: {
            ...meta,
            component,
            path,
          },
          slug: path.split`/`
        }
      }
    ))

  return {
    async getStaticPaths() {
      const index = await files
      return index.map(({ slug }) => ({ params: { slug }}))
    },
    async getStaticProps({ params }) {
      const index = await files
      const page = index.find(({ props }) => params.slug.join`/` === props.path)

      return { index, ...page && page.props }
    }
  }
}

