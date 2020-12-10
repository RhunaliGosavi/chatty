// @flow

import type { Dispatch } from '../../redux'
import type { Entity, MessageType, Questions, ReduxState } from '../../initialState'
import { getDagger } from '../../utils'
import { failed_resp } from '../../constants'
import * as dispatcher from '../../dispatch.js'

export type BotRespType = {
  info: MessageType,
  prompt_text: string,
  name: string,
  message_to_be_changed: number,
}

export const sendMessage = (
  message: string,
  intent?: string,
  dispatch: Dispatch
) => {
  dispatch(dispatcher.message(message))

  const data = { text: intent || message, meta: { redo_intent: null } }
  getDagger()
    .post('run', data)
    .then(resp => {
      dispatch(dispatcher.resp(resp.data));
      resp.data.dag_info && resp.data.dag_info.intent == "greet" && dispatch(dispatcher.setIntent());
    })
    .catch(() => {
      dispatch(dispatcher.resp(failed_resp))
    })
}

export const mapStateToProps = (
  state: ReduxState
): {
  inputType: string,
  suggestedQuestions: Questions,
  entityValues: Array<Entity>,
  disabiguationIntents?: { [key: string]: string },
  nonShortListedDisambiguationIntents?: { [key: string]: string },
} => {
  let entityValues = []
  const { currentNode, completions } = state

  if (completions) {
    entityValues = (completions['completions'] || completions['greet_user'] || { entities: [] })
      .entities

    // TODO: might wanna add in a differnt way to use node specific completions later
    if (entityValues.length === 0 && currentNode)
      entityValues = (completions[currentNode] || { entities: [] }).entities
  }

  // remove duplicates
  entityValues = entityValues.filter(
    (elem: Entity, pos: number, arr: Array<Entity>): boolean => {
      return arr.indexOf(elem) == pos
    }
  )

  return {
    inputType: state.inputType,
    suggestedQuestions: state.suggestedQuestions,
    entityValues,
    disabiguationIntents: state.disabiguationIntents,
    nonShortListedDisambiguationIntents: state.nonShortListedDisambiguationIntents,
  }
}

export const mapDispatchToProps = (dispatch: Dispatch): mixed => {
  return {
    sendMessage: (message: string, intent?: string) => {
      sendMessage(message, intent, dispatch)
    },
  }
}
