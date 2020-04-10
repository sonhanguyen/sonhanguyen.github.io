import { ElementType, ComponentType, ComponentProps } from 'react'
import withStyle from './withStyle'

type Grid<
  C extends ElementType,
  T extends string,
  A extends Record<string, ElementType>
> =
& { [K in keyof A]: ComponentType<ComponentProps<A[K]>> }
& Record<Exclude<T, keyof A>, ComponentType>
& ComponentType<ComponentProps<C>>
& { withComponents:
    <E extends Record<string, ElementType>>(components: E) => Grid<C, T, A & E> }

export default <C extends ElementType = 'div'>(options: {
  className: string,
  component?: C
}) => <
  E extends string,
  A extends Record<string, ElementType> = {}
>(template: string, components?: A): Grid<C, E, A> => {
  const name = /([-\w]+)/
  const areaNames = template.match(/"([^"]+)"/g)
    .map(it => it.split(name).filter(it => name.test(it)))
    .reduce((accum, array) => [...accum, ...array], [])

  const withComponents = elements => from(areaNames, { ...components, elements })

  const Component = Object.assign(
    withStyle(options)`
      :root {
        display: grid;
        grid-template: ${template}
      }
    `, { withComponents },
  )

  const from = (names: string[], areas: {}) => {
    if (areas) names = names.concat(...Object.keys(areas))
    else areas = {} as any

    return Object.assign(
      Component,
      Array.from(new Set(names)).reduce(
        (map, displayName) => {
          let component = areas[displayName] 
          if (!component) {
            const tag: keyof JSX.IntrinsicElements = displayName[0] as any
            component = tag == tag.toLowerCase() ? tag : 'div'
          }

          map[displayName] = Object.assign(
            withStyle({
              className: `${options.className}-${displayName}`,
              component
            })`
              :root { grid-area: ${displayName} }
            `, { displayName }
          )

          return map
        }, {} as any
      )
    )
  }

  return from(areaNames, components) as any
}

// const makeComposite = <
//   C extends ElementType,
//   M extends Record<string, {}>,
//   V extends string[]
// >(
//   createComponent: (..._: V) => C,
//   createElement: <K extends keyof M>(component: ElementType, name: K): ElementType<M[K]>
// ) => (...args: V): C & ReturnType<typeof createElements> => {
//   const component = createComponent(...args)
  
//   return Object.assign(
//     component,
//     createElements(component)
//   )
// }