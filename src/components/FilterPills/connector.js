//@flow
import type { Dispatch } from '../../redux'
import type { ReduxState } from '../../initialState'
import { botDelete, sendEntititesDelete, sendUserMessage } from '../../daggers'
import * as dispatcher from '../../dispatch.js'

export const mapStateToProps = (
  state: ReduxState
): {
  extractedEntities?: { [key: string]: string },
  intent ?: string
} => {
  return {
    extractedEntities: state.extractedEntities,
    intent: state.intent
  }
}

export const mapDispatchToProps = (dispatch: Dispatch): mixed => {
  return {
    resetChat: () => {
      botDelete(dispatch)
    },
    deleteEntity: (entity: string) => {
      sendEntititesDelete(dispatch, [entity])
    },
    resetEntity: () => {
      sendUserMessage(dispatch, "hi");
      dispatch(dispatcher.setIntent(""));
    }

  }
}
