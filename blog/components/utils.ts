function* rainbow(min = 0, max = 360) {
  const mid = Math.round((max + min) / 2)
  yield mid

  const next = [ rainbow(mid, max), rainbow(min, mid) ]

  let seq, which = Boolean(Math.round(Math.random()))
  while (seq = next[Number(which)]) {
    yield seq.next().value
    which = !which
  }
}

export const color = rainbow()

export const debugLayout = (
  style?: object,
  getBaseStyle = () => ({
    outline: `4px solid hsl(${color.next().value} 30% 30%)`
  })
) => ({
  style: {
    ...getBaseStyle(),
    width: '100%',
    height: '100%',
    ...style
  }
})