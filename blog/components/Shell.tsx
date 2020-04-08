import React from 'react'
import { MDXProvider } from '@mdx-js/react'
import { Theme, Sidebar, Main } from 'components'
import { css } from 'astroturf'

css`@import-normalize;`

type Slots = Partial<Record<
| 'aside'
| 'header'
| 'footer'
, JSX.Element>>

export type Props = Slots & {
  children?: React.ReactElement | React.ComponentType
}

export default ({ header, footer, aside, children: Content }: Props) => {
  const children = React.isValidElement(Content) ? Content : <Content />

  return <Theme>
    <Sidebar>
      { aside }
    </Sidebar>
    <Main>
      { header }
      <MDXProvider>
        { children }
      </MDXProvider>
      { footer }
    </Main>
  </Theme>
}
