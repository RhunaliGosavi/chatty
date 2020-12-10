// @flow
import * as React from 'react'
import './FancySelect.css'

type Content = { [key: string]: string | number }

type Props = {
  trigger: React.Node,
  contents: Array<Content>,
  contentRenderer: Content => React.Node,
}
type State = {}

class FancySelect extends React.Component<Props, State> {
  render(): React.Node {
    const { trigger, contents, contentRenderer } = this.props
    return (
      <div className="FancySelect">
        <div className="FancySelect-trigger">{trigger}</div>
        <div className="FancySelect-contents">
          {contents.map((content: Content): React.Node => contentRenderer(content))}
        </div>
      </div>
    )
  }
}

export default FancySelect
