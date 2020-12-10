//@flow

// Uncomment these to have IE11 support
// import 'babel-polyfill'
// import 'core-js'
// import 'whatwg-fetch'
// import '../node_modules/abort-controller/dist/abort-controller.umd.js'

import './index.css'

import { Provider } from 'react-redux'
import * as React from 'react'
import ReactDOM from 'react-dom'

import { setUserSession } from './utils'
import { store } from './redux.js'
import App from './App'
import 'bootstrap/dist/css/bootstrap.min.css';
// Set session based on url or create new
setUserSession()

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('app')
) 
