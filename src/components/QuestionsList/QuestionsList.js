// @flow
import './QuestionsList.css'

import { connect } from 'react-redux'
import * as React from 'react'

import { mapDispatchToProps, mapStateToProps } from './connector'

type Props = {
  name: string,
  questions: Array<string>,
  removeOption?: boolean,
  removeQuestion: (string, Array<string>) => mixed,
  sendMessage: (string, ?string) => mixed,
}
type State = {
  collapsed: boolean,
}

export class QuestionsList extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      collapsed: false,
    }
    let self: any = this // eslint-disable-line
    self.toggleCollapse = self.toggleCollapse.bind(this)
  }

  toggleCollapse() {
    this.setState({
      ...this.state,
      collapsed: !this.state.collapsed,
    })
  }
 
  questionClicked(i: number) {
    const { questions, sendMessage } = this.props
    const question = questions[i]
    sendMessage(question, undefined);
    this.props.onQuestionSelect();
  }

  render(): React.Node {
    const { collapsed } = this.state
    const { name, questions, removeOption, removeQuestion } = this.props
    return (
      <React.Fragment>
        {questions.length > 0 && (
          <div className='QuestionCard'> {/** className="QuestionsList" */}
            {/* <div
              className="QuestionsList-name"
              onClick={this.toggleCollapse}>
              {name}
              <i className="fas fa-angle-down"/>
            </div> */}
            <div className="QuestionsList-name">
              {name}
              {/* <i className="fas fa-angle-down"/> */}
            </div>
            {/* <div className={`QuestionsList-questions ${collapsed ? 'collapsed' : ''}`}> */}
            <div className={`QuestionsList-questions ${collapsed ? 'collapsed' : ''}`}>
              {questions.map(
                (question: string, i: number): React.Node => (
                  <div key={i} className={`QuestionsList-question-wrapper ${removeOption?'d-flex':''}`}>
                    <div
                      className={`QuestionsList-question ${removeOption?'col-11 paddingLeft':''}`}
                      onClick={(): mixed => this.questionClicked(i)}>
                      <i className={`fa ${removeOption?'':'fa-question-circle'} menu-icon-color`}/> 
                      {question}
                    </div>
                    {removeOption && (
                      <div
                        className={`QuestionsList-remove ${removeOption?'col-1':''}`}
                        onClick={(): mixed => removeQuestion(question, questions)}>
                        <i className="fas fa-times-circle" />
                      </div>
                    )}
                  </div>
                )
              )}
            </div>
          </div>
        )}
      </React.Fragment>
    )
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(QuestionsList)
