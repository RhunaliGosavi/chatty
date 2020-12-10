// @flow
import * as React from 'react'
import './Loader.css'

import { connect } from 'react-redux'
import { mapStateToProps } from './connector'

type Props = {
  loading: boolean,
}
type State = {}

class Loader extends React.Component<Props, State> {
  render(): React.Node {
    return (
      <div className="Loader loader">
        <div className={this.props.loading ? 'bar loading' : 'bar'} />
        {/* <div className="actions">Could not connect to bot... (should this go under loader?)</div> */}
      </div>
    )
  }
}

export default connect(mapStateToProps)(Loader)
