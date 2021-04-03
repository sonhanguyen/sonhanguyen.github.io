import * as React from 'react'
import styled from 'astroturf/react'
import { button } from 'components'

type Item = Record<'title' | 'path', string>

export type Props = {
  items: Item[]
  Link?: React.ElementType<JSX.IntrinsicElements['a']>
}

export default ({ items, Link = require('next/link').default }: Props) => <Nav>
  {items.map(({ path, title }) =>
    <Link key={path} href={path}>
      <div><li className={button}>{title}</li></div>
    </Link>
  )}
</Nav>

const Nav = styled.ol`
  list-style-type: none;
`
