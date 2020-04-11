import React from 'react'
import styled from 'astroturf'
import { Button } from 'components'

type Item = Record<'title' | 'path', string>

export type Props = {
  items: Item[]
  Link?: React.ElementType<JSX.IntrinsicElements['a']>
}

export default ({ items, Link = require('next/link').default }: Props) => <Nav>
  {items.map(({ path, title }) =>
    <Link key={path} href={path}>
      <div><Button as='li'>{title}</Button></div>
    </Link>
  )}
</Nav>

const Nav = styled.ol`
  list-style-type: none;
`
