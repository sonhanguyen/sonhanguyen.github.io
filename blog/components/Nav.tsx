import React from 'react'
import Link from 'next/link'

type Item = Record<'title' | 'path', string>

export type Props = {
  items: Item[]
}

export default ({ items }: Props) => <>
  {items.map(({ path, title }) =>
    <Link key={path} href={path}>{title}</Link>
  )}
</>
