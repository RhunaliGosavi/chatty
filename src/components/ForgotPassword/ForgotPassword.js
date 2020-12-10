// @flow
import './ForgotPassword.css'

import * as React from 'react'
import swal from 'sweetalert'

import { getDagger, isValidEmail } from '../../utils'
import { urls } from '../../constants'

type Props = {
  onClose: window.HTMLInputEvent => mixed,
}
type State = {}

class ForgotPassword extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)

    this.emailField = React.createRef()

    let self: any = this // eslint-disable-line
    self.sendForgotPasswordEmail = self.sendForgotPasswordEmail.bind(this)
  }

  sendForgotPasswordEmail(e: window.HTMLInputEvent) {
    if (e) {
      e.stopPropagation()
      if (e.nativeEvent) e.nativeEvent.stopImmediatePropagation()
    }

    const email = this.emailField ? this.emailField.current.value : ''

    if (!isValidEmail(email)) return

    const data = { email, url: urls.base }
    getDagger()
      .post('forgotpassword', data)
      .then(resp => {
        let type = 'success'
        let title = 'Success'
        let text = 'Check your email for a link to change password'
        if (!resp.data.success) {
          type = 'error'
          title = 'Could not verify'
          text = 'Unfortunately we could not verify you. Please try signing in again.'
        } else if (!resp.data.isValidAccount) {
          type = 'error'
          title = 'No user found'
          text = 'Users does not exist. Sign up for a new account with this email.'
        }
        swal({ type, icon: type, title, text })
      })
      .catch(err => {
        console.warn('Could not do forgotpassword')
      })
  }

  render(): React.Node {
    return (
      <div className="ForgotPassword">
        <div className="Signup-form">
          <div className="Signup-form-element">
            <div className="Signup-form-name">Email</div>
            <input
              ref={this.emailField}
              type="input"
              className="Signup-form-item"
              placeholder="youremail@saama.com"
            />
          </div>

          <button className="Signup-submit" onClick={this.sendForgotPasswordEmail}>
            Send email
          </button>
        </div>
      </div>
    )
  }
}

export default ForgotPassword
