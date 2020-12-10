// @flow
import './Signup.css'

import * as React from 'react'
import swal from 'sweetalert'

import { getDagger, isValidEmail } from '../../utils'
import config from '../../config'
import { urls } from '../../constants'

type Props = {
  onClose: window.HTMLInputEvent => mixed,
}
type State = {
  disableButton: boolean,
  error: ?string,
  checkEmailMessage: string,
}

class Signup extends React.Component<Props, State> {
  //emailField: ?{ current: { value: string } }
  //passwordField: ?{ current: { value: string } }
  //confirmField: ?{ current: { value: string } }
  // confirmField: ?React.Ref<'input'>

  constructor(props: Props) {
    super(props)
    this.state = {
      error: undefined,
      disableButton: false,
      checkEmailMessage:
        'Your request has been submitted, please check your email and click the verification link',
    }
    let self: any = this // eslint-disable-line
    self.signupUser = self.signupUser.bind(this)

    self.emailField = React.createRef()
    self.passwordField = React.createRef()
    self.confirmField = React.createRef()
    self.titleField = React.createRef()
    self.companyField = React.createRef()
  }

  submitSignupRequest(email: string, password: string, userInfo: { [key: string]: string }) {
    // send the url from here so that I will not have to set the config file in the backend
    let data = { email, password, url: urls.base, userInfo }
    this.setState(
      (state: State): State => {
        return {
          ...state,
          disableButton: true,
        }
      }
    )

    getDagger()
      .post('signup', data)
      .then(resp => {
        let type = 'error'
        let title = 'Signup failed'
        let text = 'Could not sign up for Ubot. Check again later.'
        if (resp.data.success) {
          if (resp.data.userExists) {
            type = 'warning'
            title = 'Could not signup'
            text =
              'The email id already exists, use forgot password if you do not remember your password'
          } else {
            type = 'success'
            title = 'Signup success'
            text = 'Check your email for a verification email'
          }
        }
        swal({ type, icon: type, title, text })
        this.props.onClose(undefined)
      })
      .catch(() => {
        this.setState({
          ...this.state,
          disableButton: false,
          error: 'Trouble connecting to server',
        })
      })
  }

  signupUser() {
    const email = this.emailField ? this.emailField.current.value : ''
    const password = this.passwordField ? this.passwordField.current.value : ''
    const confirm = this.confirmField ? this.confirmField.current.value : ''

    const company = this.companyField ? this.companyField.current.value : ''
    const title = this.titleField ? this.titleField.current.value : ''

    let err = undefined
    if (email.length === 0) err = 'Email field is blank'
    else if (password && password.length < 3) err = 'Enter a good password'
    else if (!isValidEmail(email, true)) err = 'Email is not valid'
    else if (password !== confirm) err = 'Passwords do not match'
    else if (company.length === 0) err = 'Company field is blank'
    else if (title.length === 0) err = 'Title field is blank'
    this.setState({
      ...this.state,
      error: err,
    })
    if (!err) this.submitSignupRequest(email, password, { company, title })
  }

  formItem(item: Array<string>): React.Node {
    return (
      <div className="Signup-form-element">
        <div className="Signup-form-name">{item[0]}</div>
        <input ref={item[1]} type={item[2]} className="Signup-form-item" placeholder={item[3]} />
      </div>
    )
  }

  render(): React.Node {
    const { error, disableButton } = this.state
    const formItems = [
      [
        ['Email', this.emailField, 'input', 'youremail@saama'],
        ['Password', this.passwordField, 'password', 'password'],
        ['Confirm password', this.confirmField, 'password', 'password'],
      ],
      [
        ['Title', this.titleField, 'input', 'Sr. Analyst'],
        ['Company', this.companyField, 'input', 'Saama'],
      ],
    ]
    return (
      <div className="Signup">
        <h2 className="Signup-header">Signup</h2>
        {error && <div className="Signup-error-window">{error}</div>}
        <div className="Signup-form">
          {formItems[0].map(item => this.formItem(item))}
          <hr className="seperator" />
          {formItems[1].map(item => this.formItem(item))}
          <button className="Signup-submit" onClick={this.signupUser} disabled={disableButton}>
            {disableButton ? 'Signing you up...' : 'Signup'}
          </button>
        </div>
      </div>
    )
  }
}

export default Signup
