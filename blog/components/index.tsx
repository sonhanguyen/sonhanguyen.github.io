import { css } from 'astroturf'
import styled from 'astroturf/react'

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

export const atom = css`
  padding: .5rem;
`

export const button = css`
  composes: ${atom};

  background-color: var(--background);
  display: inline-block;

  &:hover {
    filter: invert(1);
  }
`
