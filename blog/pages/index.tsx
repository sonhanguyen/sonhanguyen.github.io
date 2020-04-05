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

export default () => <Theme>
  <Sidebar>
    Hello
  </Sidebar>
  <Content>
    afa
  </Content>
</Theme>
