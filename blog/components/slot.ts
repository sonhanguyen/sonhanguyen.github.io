import {
  createElement,
  ComponentType,
  ElementType,
  ReactNode,
  Children
} from 'react'

const filter = <S extends {}, E>(sample: S, elements: E[]): Array<E & S> => {
  const entries = Object.entries(sample)

  return elements.filter((element): element is E & S =>
    entries.every(([key, val]) => element[key] === val)
  )
}

export const ofUnknownType = <T, E>(types: T[], elements: E[]) => elements
  .filter(({ type }: any) => !types.includes(type))

export type Slot<PortalProps extends {} = {}, Props = PortalProps> =
& { match(children: ReactNode | ReactNode[], props?: Props): typeof children } 
& ComponentType<PortalProps>

export const slot = <
  Props extends {},
  Render extends (_: {}, ...children: Props[]) => ReactNode
>(
  render: Render,
  options: { displayName: string } = render as any
): Slot<Props, Parameters<Render>[0]> => {
  const type = () => null
  const match = (children, props) => {
    const elements = filter({ type }, Children.toArray(children))

    return render(props, ...elements.map(({ props }: any) => props))
  }

  return Object.assign(type, {
    displayName: options.displayName,
    match
  }) 
}

export const forOne = <P extends {}>(slot: ElementType<P>) => {
  const { 
    name = slot as any,
    displayName = name
  }: Record<string, string> = slot as any

  return Object.assign(
    (defaultProps, ...propArray: P[]): ReactNode => {
      if (propArray.length > 1) throw Error(
        'at most one instance expected for ' + displayName
      )

      const [ props ] = propArray      
      return createElement(slot, { ...defaultProps, ...props })
    }, { displayName }
  )
}
