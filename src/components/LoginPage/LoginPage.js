// @flow
import './LoginPage.css'

import { connect } from 'react-redux'
import Modal from 'react-responsive-modal'
import * as React from 'react'

import { mapDispatchToProps, mapStateToProps } from './connector'
import { modalStyle } from '../../values'
import ForgotPassword from '../ForgotPassword/ForgotPassword'
import Signup from '../Signup/Signup'
import config from '../../config'

type ModalContentOptions = 'signup' | 'forgotpassword' | 'all'

type Props = {
  loginUser: (string, string) => mixed,
  loginFailed: boolean,
  loggingIn?: boolean,
}
type State = {
  open: boolean, // open signup modal
  modalContent?: ModalContentOptions,
  username: string,
  password: string,
  loginFailMessage: string,
  loginTimeoutHit: boolean,
}

class LoginPage extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      open: false,
      username: '',
      password: '',
      loginFailMessage: '',
      loginTimeoutHit: false,
    }

    let self: any = this // eslint-disable-line
    self.userLogin = self.userLogin.bind(this)
    self.getLoginFailMessage = self.getLoginFailMessage.bind(this)
    self.onModalToggle = self.onModalToggle.bind(this)
  }

  trim(s: string): string {
    return (s || '').replace(/^\s+|\s+$/g, '')
  }

  getLoginFailMessage(): string {
    const { username, password } = this.state
    const { loginFailed } = this.props
    if (loginFailed) return 'Incorrect email or password'
    if (this.trim(username).length === 0) return 'The email field is blank'
    if (this.trim(password).length === 0) return 'The password field is blank'
    return 'Incorrect email or password'
  }

  userLogin() {
    const { username, password } = this.state
    if (this.trim(username).length !== 0 && this.trim(password).length !== 0) {
      this.props.loginUser(username, password)
      this.setState({
        ...this.state,
        loginTimeoutHit: false,
      })

      // reset login indicatior after 7sec
      setTimeout(() => {
        this.setState({
          ...this.state,
          loginTimeoutHit: true,
        })
      }, 7000)
    } else {
      this.setState({
        ...this.state,
        loginFailMessage: this.getLoginFailMessage(),
      })
    }
  }

  onModalToggle(state: boolean, modalContent: ModalContentOptions, e: window.HTMLInputEvent) {
    if (e) {
      e.stopPropagation()
      if (e.nativeEvent) e.nativeEvent.stopImmediatePropagation()
    }
    this.setState({
      ...this.state,
      open: state,
      modalContent,
    })
  }

  render(): React.Node {
    let { username, password, loginFailMessage, loginTimeoutHit, open, modalContent } = this.state
    let { loginFailed, loggingIn } = this.props

    loggingIn = loggingIn && !loginFailed

    if (loginFailed) loginFailMessage = 'Incorrect email or password'
    if (loginTimeoutHit) loggingIn = false
    const miniModalStyle = {
      closeIcon: modalStyle.closeIcon,
      modal: { ...modalStyle.modal, maxWidth: '500px', padding: 0 },
    }
    return (
      <div className="LoginPage">
        <div className="LoginPage-widget">
          <div className="LoginPage-header">{config.login.header}</div>
          <div className="LoginPage-login">
            <div className="LoginPage-login-item">
              <div className="LoginPage-login-item-name">Email id</div>
              <input
                className="LoginPage-login-item-input"
                value={username}
                onChange={evt => {
                  this.setState({
                    ...this.state,
                    username: evt.target.value,
                  })
                }}
                onKeyUp={evt => {
                  if (evt.keyCode === 13) {
                    this.userLogin()
                  }
                }}
              />
            </div>
            <div className="LoginPage-login-item">
              <div className="LoginPage-login-item-name">Password</div>
              <input
                className="LoginPage-login-item-input"
                type="password"
                value={password}
                onChange={evt => {
                  this.setState({
                    ...this.state,
                    password: evt.target.value,
                  })
                }}
                onKeyUp={evt => {
                  if (evt.keyCode === 13) {
                    this.userLogin()
                  }
                }}
              />
            </div>
          </div>
          <div className="Login-error show">{loginFailMessage}</div>
          <div className="LoginPage-button-wrapper">
            <div
              className={`LoginPage-button ${loggingIn ? 'login-loading' : ''}`}
              disabled={loggingIn}
              onClick={this.userLogin}>
              {loggingIn ? 'Logging you in...' : config.login.message}
            </div>
          </div>

          <div className="LoginPage-signup">
            <button
              className="LoginPage-signup-button"
              onClick={(e: window.HTMLInputEvent): mixed => this.onModalToggle(true, 'signup', e)}>
              Sign Up
            </button>
            {'|'}
            <button
              className="LoginPage-signup-button"
              onClick={(e: window.HTMLInputEvent): mixed =>
                this.onModalToggle(true, 'forgotpassword', e)
              }>
              Forgot password
            </button>
            <Modal
              styles={miniModalStyle}
              open={open}
              onClose={(e: window.HTMLInputEvent): mixed => this.onModalToggle(false, 'all', e)}
              little
              center>
              {modalContent === 'signup' ? (
                <Signup
                  onClose={(e: window.HTMLInputEvent): mixed =>
                    this.onModalToggle(false, 'signup', e)
                  }
                />
              ) : (
                <ForgotPassword
                  onClose={(e: window.HTMLInputEvent): mixed =>
                    this.onModalToggle(false, 'forgotpassword', e)
                  }
                />
              )}
            </Modal>
          </div>
        </div>
        <div className="LoginPage-powerd">Powerd by Saama</div>
      </div>
    )
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LoginPage)
