// @flow
import './Hero.css'

import { connect } from 'react-redux'
import * as React from 'react'
import swal from 'sweetalert'

import { mapDispatchToProps, mapStateToProps } from './connector'
import config from '../../config'
import saamalogo from './saamalogo.png'

type Props = {
  uid: string,
  switchPane?: boolean,
  logout: void => mixed,
}
type State = {}

class Hero extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    let self: any = this // eslint-disable-line
    self.userLogout = self.userLogout.bind(this)
  }

  userLogout() {
    swal({
      title: 'Are you sure?',
      text: 'Are you sure you want to log out of the current session.',
      icon: 'warning',
      buttons: true,
      dangerMode: true,
    }).then(
      (ok: boolean): mixed => {
        if (ok) this.props.logout()
      }
    )
  }

  render(): React.Node {
    const { switchPane } = this.props
    return (
      <div className="Hero">
        {!(config.meta.position === 'right' || switchPane === true) && (
          <div className="Hero-left">
            <img src={saamalogo} alt="Saama" />
          </div>
        )}

        <div className="Hero-right">
          <div className="Hero-name">{config.bot.displayName}</div>
          <div className="Hero-user">
            Signed in as{' '}
            <span className="Hero-user-name" onClick={this.userLogout}>
              {this.props.uid}
            </span>
            <span className="Hero-logout-message" onClick={this.userLogout}>
              click to logout
            </span>
          </div>
        </div>

        {(config.meta.position === 'right' || switchPane === true) && (
          <div className="Hero-left right">
            <img src={saamalogo} alt="Saama" />
          </div>
        )}
      </div>
    )
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Hero)
