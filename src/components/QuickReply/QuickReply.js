// @flow
import './QuickReply.css'

import * as React from 'react'
import Select from 'react-select'

export type Button = { value: string, label: string }
type Props = {
  mainButtons: Array<Button>,
  otherButtons?: Array<Button>,
  onSubmit: (string, string) => mixed,
}
type State = {}

class QuickReply extends React.Component<Props, State> {
  replySelect({ value, label }: Button) {
    const { onSubmit } = this.props
    onSubmit(value, label)
  }

  getButton(btn: Button): React.Node {
    const { value, label } = btn
    return (
      <div
        key={`${value} - ${label}`}
        className="QuickReply-button"
        onClick={(): mixed => this.replySelect(btn)}>
        {label}
      </div>
    )
  }

  getOthersButton(data?: Array<Button>): ?React.Node {
    if (data && data.length > 0)
      return (
        <Select
          placeholder="Other"
          onChange={(opt: Button): mixed => this.replySelect(opt)}
          options={data}
          menuPlacement="top"
          isClearable={false}
        />
      )
  }

  render(): React.Node {
    const { mainButtons, otherButtons } = this.props
    return (
      <div className="QuickReply">
        <div className="QuickReply-buttons">
          {mainButtons.map((btn: Button): React.Node => this.getButton(btn))}
        </div>
        <div className="QuickReply-others">{this.getOthersButton(otherButtons)}</div>
      </div>
    )
  }
}

export default QuickReply
