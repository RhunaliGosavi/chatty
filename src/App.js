// @flow

import { connect } from 'react-redux'
import * as React from 'react'


import { mapStateToProps } from './connector'
import Chat from './components/Chat/Chat'
import LoginPage from './components/LoginPage/LoginPage'
import Meta from './components/Meta/Meta'
import CookieMessage from './components/CookieMessage/CookieMessage'
import config from './config'
import Body from './components/Body/Body';

type Props = {
  uid: string,
  switchPane?: boolean,
}
type State = {}

class App extends React.Component<Props, State> {
  render(): React.Node {
    const { switchPane } = this.props
    const { uid } = this.props
    return (
      <div className="App">
        {/* <CookieMessage /> */}
        {uid ? (
          <React.Fragment>
            <Chat />
          </React.Fragment>
        ) : (
          <LoginPage />
        )}
      </div>
    )
  }
}

export default connect(mapStateToProps)(App)
