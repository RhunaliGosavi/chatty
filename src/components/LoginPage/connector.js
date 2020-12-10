//@flow

import type { Dispatch } from '../../redux'
import type { ReduxState } from '../../initialState'
import { getDagger, guid } from '../../utils'
import { sendUserMessage, updateFavs } from '../../daggers'
import config from '../../config'
import * as dispatcher from '../../dispatch'

const user = config.bot.user
const botName = config.bot.name

export const mapStateToProps = (
  state: ReduxState
): {
  loginFailed: boolean,
  loggingIn?: boolean,
} => {
  return {
    loginFailed: state.loginFailed,
    loggingIn: state.loggingIn,
  }
}

export const mapDispatchToProps = (dispatch: Dispatch): mixed => {
  return {
    loginUser: (username: string, password: string) => {
      dispatch(dispatcher.loginStart())

      getDagger()
        .post('auth', { username, password })
        .then(resp => {
          if (resp.data.success) {
            const token = resp.data.token
            dispatch(dispatcher.login({ username, token, session: guid() }))
            updateFavs(dispatch)
            sendUserMessage(dispatch, 'hi')
          } else {
            dispatch(dispatcher.loginFailed())
          }
        })
        .catch(() => {
          console.warn('login failed')
          dispatch(dispatcher.loginFailed())
        })
    },
  }
}
