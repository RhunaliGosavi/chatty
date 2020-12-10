// @flow

import type { Dispatch } from '../../redux'
import type { ReduxState } from '../../initialState'
import { sendFavs } from '../../daggers'
import { sendMessage } from '../InputBox/connector'
import config from '../../config'

export const toggleFav = (
  question: string,
  favouriteQuestions: Array<string>,
  dispatch: Dispatch
) => {
  favouriteQuestions = [...favouriteQuestions]
  const index = favouriteQuestions.indexOf(question)

  // remove or add question
  if (question === undefined) return
  if (index > -1) {
    favouriteQuestions.splice(index, 1)
  } else {
    favouriteQuestions = [...favouriteQuestions, question]
  }

  sendFavs(dispatch, favouriteQuestions)
}

export const mapStateToProps = () => {
  return {}
}

export const mapDispatchToProps = (dispatch: Dispatch): mixed => {
  return {
    removeQuestion: (question: string, favouriteQuestions: Array<string>) => {
      toggleFav(question, favouriteQuestions, dispatch)
    },
    sendMessage: (message: string, intent?: string) => {
      sendMessage(message, intent, dispatch)
    },
  }
}
