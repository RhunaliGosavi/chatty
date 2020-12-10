// @flow
import './GraphScroller.css'

import { connect } from 'react-redux'
import * as React from 'react'

import { mapStateToProps } from './connector'
import Message from '../Message/Message'

type MessageType = {
  type: string,
  message: string,
  source: string,
  xaxis?: string,
  yaxis?: string,
  chartType?: string,
  title?: string,
}

type Props = {
  messages: Array<MessageType>,
}
type State = {
  collapsed: boolean,
}

class GraphScroller extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      collapsed: false,
    }
  }
  render(): React.Node {
    const messages = this.props.messages.filter(
      (message: MessageType): boolean => message.type === 'graph'
    )
    const { collapsed } = this.state
    return (
      <div className="GraphScroller">
        {messages.length > 0 && (
          <React.Fragment>
            <div
              className=''
              onClick={() => {
                this.setState({
                  ...this.state,
                  collapsed: !this.state.collapsed,
                })
              }}>
              Graphs
              {/* <i
                className={`fas fa-angle-up QuestionsList-dropdown-arrow ${
                  collapsed ? 'collapsed' : ''
                }`}
              /> */}
            </div>

            <div className={`GraphScroller-list ${collapsed ? 'collapsed' : ''}`}>
              {messages.map(
                (msg: MessageType, i: number): React.Node => (
                  <div className="GraphScroller-graph" key={i}>
                    <Message forPreview={true} message={msg} />
                  </div>
                )
              )}
            </div>
          </React.Fragment>
        )}
      </div>
    )
  }
}

export default connect(mapStateToProps)(GraphScroller)
