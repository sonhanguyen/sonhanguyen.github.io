import * as React from 'react'
import styled from 'astroturf/react'
import { motion } from 'framer-motion'
import { withMediaClass } from '../components/withHook'

type State = { afloat?: boolean }

const toggle = <K extends keyof State>(key: K) =>
  (state: State) => ({ ...state, [key]: !state[key] })

const SplitPane: React.FC<React.ComponentProps<'div'> & {
  wide?: boolean
  master: React.ReactNode
  children: React.ReactNode
  Switch?: React.ComponentType<{
    on?: boolean, onClick: React.MouseEventHandler
  }>
  Layout?: React.ComponentType<{ className?: string }>
}> = ({
  wide,
  master,
  children: detail,
  Layout,
  Switch,
  ...props
}) => {
  const [ { afloat }, dispatch ] = React.useState<State>({})

  const toggleAfloat = () => dispatch(toggle('afloat'))

  const widened = wide && afloat

  React.useEffect(() => {
    if (widened) toggleAfloat();
  }, [widened])

  return <Layout { ...props }>
    <Master afloat={afloat} animate>
      {wide ? null :
        <SwitchContainer on={afloat} animate>
          <Switch on={afloat} onClick={toggleAfloat} />
        </SwitchContainer>
      }
      {master}
    </Master>
    {detail}
  </Layout>
}

const Master = withMediaClass(
  styled(motion.aside)<{ afloat?: boolean }>`
    position: absolute;
    top: 0;
    bottom: 0;
    right: 100%;

    &.tablet {
      position: unset;
    }

    &.afloat {
      right: unset;
    }
  `
)

const SwitchContainer = styled(motion.div)<{ on?: boolean }>`
  position: absolute;
  left: 100%;
`

export default withMediaClass(
  styled(SplitPane)`
    position: relative;
    display: flex;  
  `
)

export const DefaultSwitch = styled.div<{ on?: boolean }>`
  position: absolute;
  font-size: 3rem;
  
  &:not(.on):after {
    height: 3rem;
    width: 3rem;
    left: 100%;
    content: '☰';
  }

  &.on {
    position: fixed;
    top: 0;
    bottom: 0;
    right: 0;
    left: 0;
  }
`

SplitPane.defaultProps = {
  Layout: styled.div`
    display: flex;
    flex: 1;
  `,
  Switch: DefaultSwitch
}
