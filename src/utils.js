//@flow

import { produce } from 'immer'
import ColorHash from 'color-hash'
import Cookies from 'js-cookie'
import axios from 'axios'
import swal from 'sweetalert'
import jwt_decode from 'jwt-decode'

import type { Button } from './components/QuickReply/QuickReply'
import type { DataType } from './components/Messages/Messages'
import type { Dict } from './initialState'
import { urls, backlistedEmailProviders } from './constants'
import config from './config'

let sessionUpdated = false

export const downloadCSV = (data: Array<DataType>, name: string = 'Data') => {
  let arrData = typeof data != 'object' ? JSON.parse(data) : data
  let CSV = ''

  let row = ''
  for (let index in arrData[0]) {
    if (!index.startsWith('@extra')) row += index + ','
  }
  row = row.slice(0, -1)
  CSV += row + '\r\n'

  for (let i = 0; i < arrData.length; i++) {
    let row = ''
    for (let index in arrData[i]) {
      if (!index.startsWith('@extra')) row += '"' + arrData[i][index] + '",'
    }
    row.slice(0, row.length - 1)
    CSV += row + '\r\n'
  }

  if (CSV == '') {
    return
  }

  var uri = 'data:text/csv;charset=utf-8,' + escape(CSV)

  var link = document.createElement('a')
  link.href = uri
  link.style = 'visibility:hidden'
  link.download = name + '.csv'

  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

export const filterData = (data: Array<DataType>): Array<DataType> => {
  // removes keys that start with @extra/
  return produce(data, (draft: Array<DataType>) => {
    draft.map(
      (d: DataType): DataType => {
        let keysToBeRemoved = Object.keys(d).filter((k: string): boolean => k.startsWith('@extra/'))
        for (let key of keysToBeRemoved) {
          delete d[key]
        }
        return d
      }
    )
  })
}

export const filterArray = (keys: Array<string>, toRemove: Array<string>): Array<string> => {
  return keys.filter((key: string): boolean => toRemove.indexOf(key) === -1)
}

export const guid = (): string => {
  function s4(): string {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1)
  }
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4()
}
export const scrollChatUp = () => {
  const messagesWindow = document.getElementById('messages-window')
  if (messagesWindow) messagesWindow.scrollTop = messagesWindow.scrollHeight
}
/*export const scrollChatUp = () => {
  const messagesWindow = document.getElementById('messages-window')
  //const inner = document.getElementById('inner')
  //messagesWindow.scrollIntoView();
  console.log("messagesWindow", messagesWindow.scrollHeight);
  if (messagesWindow) {
    
    messagesWindow.scrollTop = messagesWindow.scrollHeight
    //messagesWindow.scrollIntoView();
    //inner.scrollTop = inner.scrollHeight

  } 
  //inner.scrollIntoView();
}*/

export const getInput = (): string => {
  const inputBox: ?HTMLInputElement = document.getElementById('user-input-message')
  if (inputBox) return inputBox.value
  else return ''
}
export const setInput = (value: string) => {
  const inputBox: ?HTMLInputElement = document.getElementById('user-input-message')
  if (inputBox) inputBox.value = value
}

export const numberWithCommas = (n: string): string => {
  const parts = n.toString().split('.')
  return parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',') + (parts[1] ? '.' + parts[1] : '')
}

export const cleanData = (data: Array<Dict>, keys: Array<string>): [Array<Dict>, Array<string>] => {
  const dataConverted = data.map(
    (el: Dict): Dict => {
      let elNew = {}
      keys.forEach((key: string) => {
        if (isNaN(el[key]) && keys.indexOf(key) > -1) keys.splice(keys.indexOf(key), 1)
        if (typeof el[key] === 'string' && !isNaN(el[key]))
          elNew[key] = Number(el[key].replace('$', '').replace('%', ''))
        else elNew[key] = el[key]
      })
      return elNew
    }
  )
  return [dataConverted, keys]
}

export const commedData = (
  data: Array<Dict>,
  keys: Array<string>
): [Array<Dict>, Array<string>] => {
  // Used to add comma to long numbers which are represented as strings?
  // probably should work on actual numbers that strings
  const dataWithComma = data.map(
    (el: Dict): Dict => {
      let elNew = {}
      keys.forEach((key: string) => {
        if (key == 'Number') elNew[key] = numberWithCommas(el[key])
        else elNew[key] = el[key]
      })
      return elNew
    }
  )
  return [dataWithComma, keys]
}

export const affineTransform = (
  a: number,
  b: number,
  c: number,
  d: number,
  value: number
): number => {
  return (value - a) * ((d - c) / (b - a)) + c
}

export const dtokv = (d: Dict): Array<Dict> => {
  return Object.keys(d).map(
    (key: string): Button => {
      return { value: key, label: d[key] }
    }
  )
}

export const isValidEmail = (email: string, showSwal: boolean = false): boolean => {
  let valid = /.+@.+\..+/.test(email)
  if (valid) {
    const rightHandSide = email.split('@')[1]
    if (rightHandSide.split('.').length < 2) {
      valid = false
    }
    const provider = email.split('@')[1].replace(/\.[a-zA-Z0-9]*$/, '')
    if (backlistedEmailProviders.indexOf(provider) !== -1) {
      valid = false
      if (showSwal) swal('You cannot use your personal email id. Please use your work email.')
    }
  }
  return valid
}

export const getUserToken = (): ?string => {
  const user = getUserFromCookie()
  if (user) return user.token
  return null
}

export const setUserSession = (reset: boolean = false) => {
  if (reset) {
    let userCookie = Cookies.get('user')
    if (userCookie) {
      userCookie = JSON.parse(userCookie)
      userCookie.session = guid()
      Cookies.set('user', userCookie)
    }
  } else if (!sessionUpdated) {
    sessionUpdated = true // to make sure this only runs once
    const url = new URL(window.location)
    console.log(url);
    const userSession = url.searchParams.get('session')
    const token = url.searchParams.get('token')
    const auth_token = url.searchParams.get('auth_token')
    console.log('token:', token)

    if (token) {
      // if they need to login a new user (used with saml integration)
      let username
      try {
        username = jwt_decode(token)['username']
        console.log("Decoded:", username);
        
      } catch (e) {
        console.error('Invalid auth token')
        // console.error(e)
        return
      }
      // const toBeCookie = { username, token, session: userSession || guid() }
      //let username = 'adeel';
      const toBeCookie = { username, token, session: userSession || guid() }
      Cookies.set('user', toBeCookie)
      window.history.pushState({ html: '', pageTitle: 'DaLIA | Saama' }, '', window.location.origin)
      return
    }
    // for just maintaining user session (used with "open in new tab feature")
    let userCookie = Cookies.get('user')
    if (userCookie) {
      userCookie = JSON.parse(userCookie)
      if (userSession) userCookie.session = userSession
      else userCookie.session = guid()
      Cookies.set('user', userCookie)
      window.history.pushState({ html: '', pageTitle: 'DaLIA | Saama' }, '', window.location.origin)
    }
  }
}

/*export const setUserSession = (reset: boolean = false) => {
  if (reset) {
    let userCookie = Cookies.get('user')
    if (userCookie) {
      userCookie = JSON.parse(userCookie)
      userCookie.session = guid()
      Cookies.set('user', userCookie)
    }
  } else if (!sessionUpdated) {
    sessionUpdated = true
    // const url = new URL(window.location)
    // const userSession = url.searchParams.get('session')
    let userCookie = Cookies.get('user')
    if (userCookie) {
      userCookie = JSON.parse(userCookie)

      const url = new URL(window.location)
      const userSession = url.searchParams.get('session')
      console.log(url.href);
      
      if (userSession) userCookie.session = userSession
      else userCookie.session = guid()

      Cookies.set('user', userCookie)
      // console.log('window.location:', window.location)
      // window.location = window.location
      window.history.pushState({ html: '', pageTitle: 'DaLIA | Saama' }, '', window.location.origin)
      // location.replace("https://www.w3schools.com")

      // console.log(JSON.parse(Cookies.get('user')))
    }
  }
}*/

export const getUserSession = (): string => {
  // const url = new URL(window.location)
  // const userSession = url.searchParams.get('session')
  // if (userSession) return userSession

  const user_cookie = Cookies.get('user')
  if (user_cookie) {
    const user = JSON.parse(user_cookie)
    if (user.session) return user.session
  }

  return guid()
}

export const getUserFromCookie = (): ?{ token: string } => {
  const user_cookie = Cookies.get('user')
  if (user_cookie) return JSON.parse(user_cookie)
  return null
}

// thing that fetcher from dag = dagger
export const getDagger = (): mixed => {
  const { user, name } = config.bot
  return axios.create({
    baseURL: `${urls.base}/`,
    headers: {
      FROM: getUserToken(),
      session: getUserSession(),
      builder: user,
      bot: name,
    },
  })
}

export const getColorString = (text: string, alpha: number = 0.5): string => {
  const colorHash = new ColorHash({ lightness: 0.5 })
  let color = colorHash.rgb(text)
  return `rgba(${color[0]}, ${color[1]}, ${color[2]}, ${alpha})`
}

export const getStylesObject = (styles: Dict = {}): Dict => {
  const validCSSProps = [
    'color',
    'width',
    'height',
    'background',
    'fontSize',
    'textAlign',
    'padding',
    'margin',
    'border',
    'borderRadius',
    'borderTop',
    'borderBottom',
    'borderLeft',
    'borderRight',
  ]
  let styleObject = {
    padding: '7px 5px',
    width: '100%',
    height: '100%',
  }
  const check = (key: string, val: string): boolean => key === val && styles[key] === true
  for (let key in styles) {
    if (validCSSProps.indexOf(key) !== -1) styleObject[key] = styles[key]
    else {
      if (check(key, 'bold')) styleObject['fontWeight'] = 'bold'
      if (check(key, 'underline')) styleObject['textDecoration'] = 'underline'
      if (check(key, 'italic')) styleObject['fontStyle'] = 'italic'
    }
  }
  return styleObject
}

// export const overrideUser = (token: string) => {
//   const user = { username: 'user', token, session: guid() }
//   Cookies.set('user', user)
// }
