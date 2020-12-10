// export let urls = { base : 'https://peachatbot-ws01.upeadev.com:443'};
export let urls = { base : 'https://giohubdev.saama.com/'};
//export let urls = { base : 'https://52.9.226.209/'};
if (process.env.NODE_ENV === 'production')
  urls = { base: 'https://' + window.location.href.split('/')[2] }

export const backlistedEmailProviders = [
  'gmail',
  'outlook',
  'hotmail',
  'protonmail',
  'yahoo',
  'ymail',
  'icloud',
  'rocketmail',
]

export const failed_resp = {
  name: 'overrided_input',
  info: null,
  prompt_text:
    'I cannot answer this question now.\nI am going to sign up for additional training to answer this question.',
  mode: 'prompt',
  dag_info: {
    unused_words: [],
    intent: 'overrided_input',
    entities: {},
    intent_ranking: [],
    user_ip: '',
    username: 'user',
  },
  id: '1dd8e119-0c1e-4cb8-a265-36fcdc3fa7d1-' + Math.random(),
}

// const failed_resp_simple = {
//     info: 'Could not connect to bot',
//     prompt: undefined,
//     msg_type: 'meta',
//   }
