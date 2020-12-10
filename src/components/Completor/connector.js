export const mapStateToProps = state => {
  let completions = []

  let currentNode = state.currentNode
  if (state.completions == undefined) {
    currentNode = undefined
  } else if (!(currentNode in state.completions)) {
    if ('greet_user' in state.completions) currentNode = 'greet_user'
    if ('completions' in state.completions) currentNode = 'completions'
    else currentNode = undefined
  }

  if (currentNode) {
    completions = state.completions[currentNode].entities
  }

  // remove duplicates
  completions = completions.filter((elem, pos, arr) => {
    return arr.indexOf(elem) == pos
  })

  return {
    suggestedQuestions: state.suggestedQuestions ? state.suggestedQuestions : [],
    completion: {
      type: 'entities',
      data: completions,
    },
  }
}
