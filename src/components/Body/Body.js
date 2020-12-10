import * as React from 'react'
import { connect } from 'react-redux'

import Chat from '../Chat/Chat'
import bgImg from './UnileverImg.png'
import GraphScroller from '../GraphScroller/GraphScroller'
import QuestionsList from '../QuestionsList/QuestionsList'
import { mapStateToProps } from '../Chat/connector'

import './Body.css'
type Props = {
  suggestedQuestions: Array<string>,
  favouriteQuestions: Array<string>,
}
type State = {}

class Body extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
          showQuestions: false
    }
      this.toggleQuestionMenuWindow = this.toggleQuestionMenuWindow.bind(this);
  }

  toggleQuestionMenuWindow() {
    this.setState({
      showQuestions: !this.state.showQuestions,
    });
  }

  render(): React.Node {
    return (
      <div className="bodyDiv">
        <div className="chatBox d-flex">
        <div className="col-5" style={{paddingRight:'0',bottom:'45px'}}>
          {this.state.showQuestions && (<div><QuestionsList
            name="Suggested Questions"
            questions={this.props.suggestedQuestions} /></div>)}

          {this.state.showQuestions && (<div><QuestionsList
            name="Favorite Questions"
            questions={this.props.favouriteQuestions}
            removeOption />
          </div>)}
        </div>
       <Chat toggleQuestionMenu={this.toggleQuestionMenuWindow} />
        </div>
      </div>
    )
  }
}

export default connect(mapStateToProps)(Body) 