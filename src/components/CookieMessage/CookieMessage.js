// @flow
import * as React from 'react'
import './CookieMessage.css'

import Cookies from 'js-cookie'

type Props = {}
type State = {
  wikiLink: string,
  okClicked: boolean,
}

class CookieMessage extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      wikiLink: 'https://en.wikipedia.org/wiki/HTTP_cookie',
      okClicked: false,
    }

    let self: any = this // eslint-disable-line
    self.setCookie = self.setCookie.bind(this)
  }

  setCookie() {
    Cookies.set('knowsAboutCookies', 'true')
    this.setState(
      (state: State): State => {
        return {
          ...state,
          okClicked: true,
        }
      }
    )
  }

  render(): React.Node {
    const { okClicked, wikiLink } = this.state
    const cookies = Cookies.get()
    const knowsAboutCookies =
      'knowsAboutCookies' in cookies && cookies['knowsAboutCookies'] === 'true'
    const showMessage = !(knowsAboutCookies || okClicked)

    return (
      <div className="CookieMessage" style={{ display: showMessage ? 'flex' : 'none' }}>
        <div className="CookieMessage-message">
          We use cookies to enhance your experience. By continuing to visit this site you agree to
          our use of cookies. <a href={wikiLink}>More Info</a>
        </div>
        <button className="CookieMessage-button" onClick={this.setCookie}>
          OK
        </button>
      </div>
    )
  }
}

export default CookieMessage
