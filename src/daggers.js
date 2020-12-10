import { getDagger } from './utils'
import * as dispatcher from './dispatch'

export const updateFavs = dispatch => {
  getDagger()
    .get('fav')
    .then(resp => {
      if (resp.data.success) dispatch(dispatcher.fav(resp.data.favouriteQuestions))
    })
    .catch(() => {
      console.warn('Could not fetch fav questions for user')
    })
}

export const sendFavs = (dispatch, questions) => {
  getDagger()
    .post('fav', { questions })
    .then(resp => {
      if (resp.data.success) dispatch(dispatcher.fav(questions))
    })
    .catch(() => {
      console.warn('Could not fetch fav questions for user')
    })
}

export const getInitialMessage = dispatch => {
  getDagger()
    .get('run')
    .then(resp => {
      dispatch(dispatcher.resp(resp.data))
    })
    .catch(() => {
      console.warn('Could not fetch initial bot message')
      dispatch(dispatcher.meta('Bot did not respond'))
    })
}

export const updateCompletions = dispatch => {
  getDagger()
    .get('completions')
    .then(resp => {
      if (resp.data.success) dispatch(dispatcher.completions(resp.data.completions))
    })
    .catch(() => {
      console.warn('Could not fetch completions')
    })
}

export const sendUserMessage = (dispatch, text, meta = { redo_intent: null }) => {
  getDagger()
    .post('run', { text, meta, request: 'RUN' })
    .then(resp => {
      dispatch(dispatcher.resp(resp.data))
    })
    .catch(err => {
      console.warn(err) // eslint-disable-line
      dispatch(dispatcher.meta('Could not connect to bot'))
    })
}

export const botDelete = dispatch => {
  getDagger()
    .post('run', {  bot: true , request: 'DELETE' })
    .then(resp => {
      dispatch(dispatcher.reset())
    })
    .catch(() => {
      console.warn('Could not reset chat')
    })
}

export const sendEntititesDelete = (dispatch, entities) => {
  getDagger()
    .post('run', { entities , request: 'DELETE' }) // delete does not ususally support  data
    .then(resp => {
      if (resp.data.message === 'OK') {
        dispatch(dispatcher.deleteEntity(entities))
      }
    })
}
