// @flow
import { createStore } from 'redux'
import Cookies from 'js-cookie'
import produce from 'immer'

import { type Intent, type ReduxState, initialState } from './initialState'
import { OVERRIDE_USER } from './config.js'
import { getUserSession, getUserFromCookie } from './utils.js'
import { sendUserMessage, updateCompletions, updateFavs } from './daggers'
import { setUserSession } from './utils'
import * as dispatcher from './dispatch'

// Set session based on url or create new
setUserSession()

export type Action = {
  +type: string,
  payload: any,
}
export type Dispatch = (action: Action) => mixed

export const reducer = (state: ReduxState = initialState, action: Action): ReduxState => {
  state = produce(state, (draft: ReduxState) => {
    switch (action.type) {
      case 'SWITCH_PANE':
        draft.switchPane = !draft.switchPane
        break
      case 'COMPLETIONS_FETCH':
        var payload = action.payload
        draft.completions = payload
        if (payload.completions) {
          draft.suggestedQuestions = payload.completions.sentences || []
        } else if (payload.greet_user) {
          draft.suggestedQuestions = payload.greet_user.sentences || []
        }

        if (payload.intent_nle) draft.intentNaturalLanguageEquivalent = payload.intent_nle
        break
      case 'LOGIN_INITIALIZE':
        draft.loggingIn = true
        draft.loginFailed = false
        break
      case 'USER_LOGIN':
        draft.loggingIn = false
        draft.loginFailed = false
        draft.uid = action.payload.username
        draft.jwttoken = action.payload.token
        Cookies.set('user', JSON.stringify(action.payload), { expires: 10 })
        break
      case 'LOGIN_FAILED':
        draft.loginFailed = true
        break
      case 'USER_LOGOUT':
        draft.uid = undefined
        draft.favouriteQuestions = []
        draft.loading = false
        draft.currentNode = undefined
        draft.extractedEntities = undefined
        draft.messages = []
        draft.inputType = 'text'
        draft.loginFailed = false
        draft.lastUserMessageIndex = undefined
        Cookies.remove('user')
        break
      case 'RESET_CHAT':
        draft.loading = false
        draft.inputType = 'text'
        draft.extractedEntities = undefined
        draft.currentNode = undefined
        draft.inputType = 'text'
        draft.extractedEntities = undefined
        draft.messages.push({
          source: 'bot',
          type: 'divider',
          data: 'chat reset',
        })
        break
      case 'UPDATE_FAVS':
        draft.favouriteQuestions = action.payload
        break
      case 'TABLEU_MESSAGE':
        draft.loading = false
        draft.currentNode = undefined
        if (action.payload.found === true)
          draft.messages.push({
            source: 'bot',
            type: 'link',
            linkType: 'external',
            isPrompt: true,
            data: { link: action.payload.link, text: 'Tableau result' },
          })
        else
          draft.messages.push({
            source: 'bot',
            type: 'text',
            isPrompt: true,
            data: action.payload.message,
          })
        break
      case 'DELETE_ENTITY':
        action.payload.entities.forEach((entity: string) => {
          delete draft.extractedEntities[entity]
        })
        break
      case 'USER_MESSAGE':
        draft.loading = true
        draft.currentIntent = undefined
        draft.lastUserMessageIndex = draft.messages.length
        draft.messages.push({
          source: 'user',
          type: 'text',
          data: action.payload,
          unused_words: [],
        })
        break
      case 'BOT_RESP':
        draft.loading = false
        var dag_info = action.payload.dag_info
        if (dag_info) {
          draft.extractedEntities = dag_info.entities || {}
          if (dag_info.intent && dag_info.intent_ranking) {
            // add displayName to intent dict
            dag_info.intent_ranking = dag_info.intent_ranking.map(
              (intent: Intent): Intent => {
                return {
                  ...intent,
                  displayName:
                    intent.displayName || draft.intentNaturalLanguageEquivalent[intent.name],
                }
              }
            )
            draft.alternateIntents = dag_info.intent_ranking || []
            draft.currentIntent = dag_info.intent_ranking.filter(
              (intent: { name: string }): boolean => intent.name === dag_info.intent
            )[0]
          } else {
            draft.alternateIntents = []
            draft.currentIntent = undefined
          }
        }
        if (action.payload.mode === 'intent_disambiguation') {
          draft.inputType = 'buttons'
          draft.disabiguationIntents = action.payload.info.shortlisted_intents
          draft.nonShortListedDisambiguationIntents = action.payload.info.remaining_intents
          if (action.payload.prompt_text)
            draft.messages.push({
              id: action.payload.id,
              source: 'bot',
              type: 'text',
              isPrompt: true,
              data: action.payload.prompt_text,
            })
        } else {
          draft.inputType = 'text'
          if (
            draft.lastUserMessageIndex &&
            action.payload.dag_info &&
            draft.messages[draft.lastUserMessageIndex]
          ) {
            const unused_words = action.payload.dag_info.unused_words
              ? action.payload.dag_info.unused_words
              : []
            draft.messages[draft.lastUserMessageIndex]['unused_words'] = unused_words
          }
          if (action.payload.info) {
            if (action.payload.msg_type === 'meta')
              draft.messages.push({
                source: 'bot',
                type: 'divider',
                data: action.payload.info,
              })
            else {
              if (action.payload.info.type == 'text')
                draft.messages.push({
                  id: action.payload.id,
                  source: 'bot',
                  type: 'text',
                  isPrompt: false,
                  data: action.payload.info.data,
                })
              else if (action.payload.info.type == 'link')
                draft.messages.push({
                  id: action.payload.id,
                  source: 'bot',
                  type: 'link',
                  linkType: action.payload.info.linkType || 'external',
                  isPrompt: false,
                  data: {
                    link: action.payload.info.data.link,
                    text: action.payload.info.data.text,
                    entity: action.payload.info.data.entity,
                    doclink: action.payload.info.data.doclink,
                    doctext: action.payload.info.data.doctext,
                    docpath: action.payload.info.data.docpath,
                    docentity: action.payload.info.data.docentity
                  },
                })
              else if (action.payload.info.type == 'image')
                draft.messages.push({
                  id: action.payload.id,
                  source: 'bot',
                  type: 'image',
                  isPrompt: false,
                  data: {
                    link: action.payload.info.data.link,
                    title: action.payload.info.data.title,
                  },
                })
              else if (action.payload.info.type == 'graph')
                draft.messages.push({
                  id: action.payload.id,
                  source: 'bot',
                  type: 'graph',
                  isPrompt: false,
                  xaxis: action.payload.info.xaxis || action.payload.info.baseName, // name field
                  yaxis: action.payload.info.yaxis,
                  zaxis: action.payload.info.zaxis,
                  options: action.payload.info.options ||  {},
                  chartFields: action.payload.info.chartFields,
                  chartData: action.payload.info.chartData,
                  data: action.payload.info.data,
                  title: action.payload.info.title || 'Data',
                  charts: action.payload.info.charts || [],
                  colors: action.payload.info.colors,
                  columns: action.payload.info.columns,
                  enableDownload: action.payload.info.enableDownload
                    ? action.payload.info.enableDownload
                    : true,
                })
              else if (action.payload.info.type == 'table')
                draft.messages.push({
                  id: action.payload.id,
                  source: 'bot',
                  type: 'graph',
                  isPrompt: false,
                  data: action.payload.info.data,
                  title: action.payload.info.title || 'Data',
                  charts: ['table'],
                  options: action.payload.info.options ||  {},
                  columns: action.payload.info.columns,
                  enableDownload: action.payload.info.enableDownload
                    ? action.payload.info.enableDownload
                    : true,
                })
            }
          }
          if (action.payload.prompt_text)
            draft.messages.push({
              id: action.payload.id,
              source: 'bot',
              type: 'text',
              isPrompt: true,
              data: action.payload.prompt_text,
            })
          if (action.payload.prompt_text === null && action.payload.info === null)
            draft.messages.push({
              source: 'bot',
              type: 'divider',
              data: 'bot left the chat',
            })
          if (action.payload.name) draft.currentNode = action.payload.name
        }
        break
      case 'SET_INTENT':
        
        draft.intent = action.payload
        
        break
    }
  })
  return state
}

export const store = createStore(
  reducer,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
)

updateCompletions(store.dispatch)

const cookie_user = getUserFromCookie()
const session = getUserSession()
if (cookie_user) {
  store.dispatch(dispatcher.login({ ...cookie_user, session }))
  updateFavs(store.dispatch)
  sendUserMessage(store.dispatch, 'hi')
} else if (OVERRIDE_USER) {
  const token =
    ' .eyJ1c2VybmFtZSI6InVzZXIifQ.1R7aHt5EFQ1VZ0IsZQHJwUelBrjOLvfNmPN8Dy0Ce0c'
  const user = { username: 'user', token, session }
  store.dispatch(dispatcher.login({ ...user, session }))
  updateFavs(store.dispatch)
  sendUserMessage(store.dispatch, 'hi')
}
