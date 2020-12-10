export const OVERRIDE_USER = false
//export const OVERRIDE_USER = true

const config = {
  bot: {
    displayName: 'Ubot',
    user: 'bot',
    name: 'file',
  },
  login: {
    header: 'Ubot Virtual Assistant',
    message: 'Login to Ubot',
  },
  meta: {
    position: 'left',
    show: true,
    items: {
      graphScroller: {
        collapsed: false,
        show: true,
      },
      suggestedQuestions: {
        collapsed: false,
        show: true,
      },
      favouriteQuestions: {
        collapsed: false,
        show: true,
      },
    },
  },
}

export default config
