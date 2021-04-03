import Shell from 'components/Shell'
import { debugLayout as css } from 'components/utils'

export default () => <Shell>
  <Shell.Header>
    <div {...css()} />
  </Shell.Header>
  <Shell.Aside>
    <div {...css()} />
  </Shell.Aside>
  <Shell.AsideHeader>
    <div {...css()} />
  </Shell.AsideHeader>
  <div {...css()} />
</Shell>