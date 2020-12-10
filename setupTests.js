// global-mocks.js

import React from 'react'
import { createStore } from 'redux'
import { Provider } from 'react-redux'
import { render } from 'react-testing-library'
import { reducer } from './src/redux.js'

const fetchPolifill = require('whatwg-fetch')

global.fetch = fetchPolifill.fetch
global.Request = fetchPolifill.Request
global.Headers = fetchPolifill.Headers
global.Response = fetchPolifill.Respons


export const renderWithRedux = (ui, { initialState, store = createStore(reducer, initialState) } = {}) => {
  return {
    ...render(<Provider store={store}>{ui}</Provider>),
    store,
  }
}
global.renderWithRedux = renderWithRedux
