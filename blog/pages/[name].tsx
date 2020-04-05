import styled from 'astroturf'

const Theme = styled('div')`
  --background: black;
  --middleground: gray;
  --foreground: white;
`

const Sidebar = styled('div')`
  background: var(--background);
  color: var(--foreground);
`

const Content = styled('div')`
  background: var(--middleground);
  color: blue;
`

export default (props) => {
  console.log(props)

  return <Theme>
    <Sidebar>
      { props.title }
    </Sidebar>
    <Content>
      afa
    </Content>
  </Theme>
}

// @ts-ignore
const context = require.context(__dirname, true, /\.mdx$/)

export const getStaticPaths = async() => {
  const { fromWebpackContext } = require('../fileListingService')
  const collection = fromWebpackContext(context)

  return {
    paths: await collection.getStaticPaths(),
    fallback: true
  }
}

export const getStaticProps = async(route) => {
  const { fromWebpackContext } = require('../fileListingService')
  const collection = fromWebpackContext(context)

  return { props: await collection.getStaticProps(route)}
}
