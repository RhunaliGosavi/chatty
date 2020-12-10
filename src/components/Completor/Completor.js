// @flow
import './Completor.css'

import { connect } from 'react-redux'
import * as React from 'react'
// import fuzzysearch from 'fuzzysearch'

import { mapStateToProps } from './connector'

type EntityCompletionData = { type: string, name: string }
type EntityCompletion = {
  type: 'entities',
  data: Array<EntityCompletionData>,
}
type Props = {
  empty: boolean,
  value: string,
  suggestedQuestions: Array<string>,
  completion: EntityCompletion,
  completionChosen: (string, string) => mixed,
}
type State = {}

class Completor extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)

    let self: any = this //eslint-disable-line
    self.completionChosen = self.completionChosen.bind(this)
    self.getCompletionElements = self.getCompletionElements.bind(this)
  }

  completionChosen(
    data:
      | string
      | {
          completion: string,
          replace_length: number,
          exact_match: boolean,
        },
    type: string,
    e
  ) {
    if (e) {
      e.stopPropagation()
      e.nativeEvent.stopImmediatePropagation()
      //console.log("event");
    }
    let value = this.props.value
    if (type === 'question') this.props.completionChosen(data, type)
    else if (type === 'entity') {
      value = value.split(' ')
      value = value.slice(0, value.length - data.replace_length)
      value = value.join(' ')
      value = value + ' ' + data.completion
      this.props.completionChosen(value, type)
    }
  }

  getCompletions(
    sentence: string,
    completions: Array<EntityCompletionData>,
    questions: Array<string>,
    preserveExactMatch: boolean = false,
    minSuggetionLength: number = 3
  ): {
    suggestedCompletions: Array<{
      completion: string,
      replace_length: number,
      exact_match: boolean,
      type: string,
    }>,
    suggestedQuestions: Array<string>,
  } {
    sentence = sentence.toLowerCase().replace(/^\s+|\s+$/g, '')
    const words = sentence.split(' ')
    const maxWords = words.length
    if (maxWords == 0) return { suggestedCompletions: [], suggestedQuestions: [] }

    let suggestedCompletions = []
    for (let i = 0; i < maxWords; i++) {
      let sub = [...words].slice(i).join(' ')
      if (sub.length < minSuggetionLength) continue
      completions.forEach((completion: EntityCompletionData) => {
        if (
          completion.name.toLowerCase().startsWith(sub.toLowerCase()) ||
          completion.type.toLowerCase() === sub.toLowerCase()
        ) {
          if ((completion.name !== sub && !preserveExactMatch) || preserveExactMatch)
            suggestedCompletions.push({
              completion: completion.name,
              replace_length: sub.split(' ').length,
              exact_match: completion === sub,
              type: completion.type,
            })
        }
      })
    }

    let suggestedQuestions = []
    questions.forEach((question: string) => {
      if (question.toLowerCase().includes(sentence.toLowerCase()) && question !== sentence) {
        suggestedQuestions.push(question)
      }
    })

    return { suggestedCompletions, suggestedQuestions }
  }

  getCompletionElements(): Array<React.Node> {
    const completions = this.getCompletions(
      this.props.value,
      this.props.completion.data,
      this.props.suggestedQuestions
    )

    let completionComponets = []

    if (completions.suggestedQuestions.length > 0) {
      const questionCompletions = (
        <div className="autocompletion-questions">
          {completions.suggestedQuestions.map(
            (question: string, i: number): React.Node => {
              return (
                <div
                  className="autocompletion-question"
                  key={'q' + i}
                  onClick={(e): mixed => this.completionChosen(question, 'question', e)}>
                  <i className="far fa-question-circle" alt="(?)" /> {question}
                </div>
              )
            }
          )}
        </div>
      )
      completionComponets.push(questionCompletions)
    }

    if (completions.suggestedCompletions.length > 0) {
      let entityCompletions = (
        <div className="autocompletion-entities" key={-1}>
          {completions.suggestedCompletions.map(
            (
              suggetion: {
                completion: string,
                replace_length: number,
                exact_match: boolean,
                type: string,
              },
              i: number
            ): React.Node => {
              return (
                <div
                  className="autocompletion-entity"
                  key={i}
                  onClick={(e): mixed => this.completionChosen(suggetion, 'entity', e)}>
                  <span>{suggetion.completion}</span>
                  {/* {console.log("click")} */}
                  <span className="autocompletion-entity-type">{suggetion.type}</span>
                </div>
              )
            }
          )}
        </div>
      )
      completionComponets.push(entityCompletions)
    }
    return completionComponets
  }

  render(): React.Node {
    return <div className="autocompletion-options">{this.getCompletionElements()}</div>
  }
}

export default connect(mapStateToProps)(Completor)
