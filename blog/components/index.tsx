import styled, { css } from 'astroturf'

css`
  @import url(~sanitize.css);

  body {
    overscroll-behavior: none;
  }
`

export const Theme = styled.div`
  --background: black;
  --middleground: gray;
  --foreground: white;

  min-height: 100vh;
  background: var(--background);
  color: var(--foreground);
`
export const Styled = styled.div`
  padding: .5rem;
`

export const Button = styled(Styled)`
  background-color: var(--background);
  display: inline-block;

  &:hover {
    filter: invert(1);
  }
`