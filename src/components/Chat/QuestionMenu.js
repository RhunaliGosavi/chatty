import * as React from 'react'

import './QuestionMenu.css'



type Props = {}
type State = {}

class QuestionMenu extends React.Component<Props, State>{
    constructor(props: Props) {
        super(props)
       
      }
    render(){
        return(
            <div className="menuPopup"><div className="col p-2 borderBottom hover" onClick={this.props.showSuggested}><i className="fa fa-question-circle menu-icon-color"/>&nbsp;Suggested Questions</div>
            <div className="col p-1 hover" onClick={this.props.showFavorite}><i className="fa fa-star menu-icon-color"/>&nbsp;Favourite Questions</div></div>
        )
    }
}

export default QuestionMenu