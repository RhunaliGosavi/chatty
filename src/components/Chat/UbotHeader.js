import * as React from 'react'
import 'font-awesome/css/font-awesome.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import QuestionMenu from './QuestionMenu'
import './UbotHeader.css'
type Props = {}
type State = {}

class UbotHeader extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
    
     
    }
   
  }

 
  render(): React.Node {
    return (
      <div>
       <div className="bg-config d-flex">
         <span className="col-1 p-2"><i className="fa fa-list icon-color" onClick={this.props.toggleQuestionMenu}/></span>
           <span className="title col-9">Ubot</span> 
           <span className="col-2 p-2"><i className="fa fa-window-maximize icon-color" onClick={this.props.triggerWIndowClose}/>&nbsp;&nbsp;<i className="fa fa-close icon-color" onClick={this.props.triggerWIndowClose}/></span>
          </div>
    
      </div>
    )
  }
}

export default UbotHeader