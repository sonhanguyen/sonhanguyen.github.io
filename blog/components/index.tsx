import styled from 'astroturf'

export const Theme = styled('div')`
  --background: black;
  --middleground: gray;
  --foreground: white;
`

export const Sidebar = styled('div')`
  background: var(--background);
  color: var(--foreground);
`

export const Main = styled('div')`
  background: var(--middleground);
  color: blue;
`