// @flow
import './Meta.css'

import { connect } from 'react-redux'
import * as React from 'react'

import { mapStateToProps } from './connector'
import GraphScroller from '../GraphScroller/GraphScroller'

import QuestionsList from '../QuestionsList/QuestionsList'
import Settings from '../Settings/Settings'
import config from '../../config'

type Props = {
  suggestedQuestions: Array<string>,
  favouriteQuestions: Array<string>,
}
type State = {}

class Meta extends React.Component<Props, State> {
  render(): React.Node {
    return (
      <React.Fragment>
        {config.meta.show && (
         
            <div>
                {/* <Hero /> */}
              <GraphScroller />
           <div><QuestionsList name="Suggested Questions" questions={this.props.suggestedQuestions} /></div>
            <div>  <QuestionsList
                name="Favorite Questions"
                questions={this.props.favouriteQuestions}
                removeOption
              />
              </div>
            </div>
            
            
         
        )}
      </React.Fragment>
    )
  }
}

export default connect(mapStateToProps)(Meta)
