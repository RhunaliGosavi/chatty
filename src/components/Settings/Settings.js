// @flow
import './Settings.css'

import { connect } from 'react-redux'
import * as React from 'react'

import { mapStateToProps, mapDispatchToProps } from './connector'

type Props = {
  switchPane?: boolean,
  togglePane: () => mixed,
}
type State = {}

class Settings extends React.Component<Props, State> {
  render(): React.Node {
    const { togglePane } = this.props
    return (
      <div className="Settings">
        <div className="Settings-switch-panes" onClick={togglePane}>
          <i className="fas fa-exchange-alt" /> Switch panes
        </div>
      </div>
    )
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Settings)
