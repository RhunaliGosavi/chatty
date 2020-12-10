export const completions = co => {
  return {
    type: 'COMPLETIONS_FETCH',
    payload: co,
  }
}

export const logout = () => {
  return {
    type: 'USER_LOGOUT',
    payload: {},
  }
}

export const login = user => {
  return {
    type: 'USER_LOGIN',
    payload: user,
  }
}

export const loginStart = () => {
  return {
    type: 'LOGIN_INITIALIZE',
    payload: {},
  }
}

export const loginFailed = () => {
  return {
    type: 'LOGIN_FAILED',
    payload: {},
  }
}

export const fav = favs => {
  return {
    type: 'UPDATE_FAVS',
    payload: favs,
  }
}

export const resp = msg => {
  return {
    type: 'BOT_RESP',
    payload: msg,
  }
}

export const setIntent = msg => {
  return {
    type: 'SET_INTENT',
    payload: msg,
  }
}

export const meta = msg => {
  return {
    type: 'BOT_RESP',
    payload: { info: msg, prompt: undefined, msg_type: 'meta' },
  }
}

export const message = msg => {
  return {
    type: 'USER_MESSAGE',
    payload: msg,
  }
}

export const reset = () => {
  return {
    type: 'RESET_CHAT',
    payload: {},
  }
}

export const deleteEntity = entities => {
  return {
    type: 'DELETE_ENTITY',
    payload: { entities },
  }
}

export const switchPane = () => {
  return {
    type: 'SWITCH_PANE',
    payload: {},
  }
}
