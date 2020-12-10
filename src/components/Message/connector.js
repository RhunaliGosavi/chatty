// @flow

import type { Dispatch } from '../../redux'
import type { Intent, ReduxState } from '../../initialState'
import { sendUserMessage } from '../../daggers'
import { toggleFav } from '../QuestionsList/connector'
import * as dispatcher from '../../dispatch'

export const mapStateToProps = (
  state: ReduxState
): {
  favouriteQuestions: Array<string>,
  currentIntent?: Intent,
  alternateIntents?: Array<{ name: string, confidence: number }>,
} => {
  return {
    favouriteQuestions: state.favouriteQuestions,
    currentIntent: state.currentIntent,
    alternateIntents: state.alternateIntents,
  }
}

export const mapDispatchToProps = (dispatch: Dispatch): mixed => {
  return {
    toggleFavs: (question: string, favouriteQuestions: Array<string>) => {
      toggleFav(question, favouriteQuestions, dispatch)
    },
    sendRedoIntent: (redoIntent: string, lastUserMessage: string) => {
      dispatch(dispatcher.message(lastUserMessage))
      sendUserMessage(dispatch, lastUserMessage, { redo_intent: redoIntent })
    },
  }
}
