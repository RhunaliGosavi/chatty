// @flow
export type Intent = { name: string, confidence: number, displayName?: string }
type Question = string
export type Questions = Array<Question>
export type Dict = { [key: string]: string }
export type Entity = { name: string, type: string }
export type Completions = {
  [key: string]: {
    sentence: Questions,
    entities: Array<Entity>,
  },
}

export type TextMessage = {
  source: 'bot' | 'user',
  isPrompt?: boolean,
  id: string,
  unused_words: Array<string>,
  type: 'text',
  data: string,
}
export type TableMessage = {
  source: 'bot',
  isPrompt?: boolean,
  id: string,
  unused_words: Array<string>,
  type: 'table',
  data: Array<Dict>,
  enableDownload: boolean,
}
export type LinkMessage = {
  source: 'bot',
  isPrompt?: boolean,
  id: string,
  unused_words: Array<string>,
  type: 'link',
  linkType: 'external',
  data: {
    link: string,
    text: string,
    entity: String,
    doclink: String,
    doctext: String,
    docentity: String

  },
}
export type GraphMessage = {
  source: 'bot',
  isPrompt?: boolean,
  id: string,
  unused_words: Array<string>,
  type: 'graph',
  data: Array<Dict>,
  xaxis: string,
  yaxis?: string,
  zaxis?: string,
  title: string,
  charts?: Array<string>,
  colors?: Array<string>,
  enableDownload: boolean,
  options?: { [key: string]: any },
}
export type DividerMessage = {
  source: 'bot',
  type: 'divider',
  data: string,
}

export type MessageType = TextMessage | TableMessage | LinkMessage | GraphMessage | DividerMessage

export type ReduxState = {
  uid?: string,
  session?: string,
  intent?: String,
  suggestedQuestions: Questions,
  favouriteQuestions: Questions,
  completions?: Completions,
  inputType: 'text' | 'buttons',
  disabiguationIntents?: Dict,
  nonShortListedDisambiguationIntents?: Dict,
  loading: boolean,
  currentNode?: string,
  messages: Array<MessageType>,
  extractedEntities?: Dict,
  lastUserMessageIndex?: number,
  currentIntent?: Intent,
  alternateIntents?: Array<Intent>,
  loginFailed: boolean,
  jwttoken?: string,
  switchPane?: boolean,
  loggingIn?: boolean,

  intentNaturalLanguageEquivalent: Dict, // TODO: Remove this one new implementation is up
}

export const initialState: ReduxState = {
  suggestedQuestions: [],
  favouriteQuestions: [],
  completions: {},
  loading: false,
  messages: [],
  inputType: 'text',
  loginFailed: false,
  intentNaturalLanguageEquivalent: {},
}
