// @flow
import './Messages.css'

import { connect } from 'react-redux'
import * as React from 'react'

import type { MessageType } from '../../initialState'
import { mapStateToProps } from './connector'
import { scrollChatUp } from '../../utils'
import Message from '../Message/Message'

export type DataType = { [key: string]: string | number }
type Props = {
  user: string,
  bot: string,
  messages: Array<MessageType>,
  lastUserMessageIndex: boolean,
}
type State = {}

class Messages extends React.Component<Props, State> {
  componentDidUpdate() {
    scrollChatUp()
  }

  render(): React.Node {
    const { user, bot, messages, lastUserMessageIndex } = this.props
    return (
      <React.Fragment>
        {messages.map(
          (msg: MessageType, i: number): React.Node => (
            <Message
              key={i}
              message={msg}
              bot={bot}
              user={user}
              isLastUserMessage={i === lastUserMessageIndex}
            />
          )
        )}
      </React.Fragment>
    )
  }
}

export default connect(mapStateToProps)(Messages)
