// @flow
import './Chat.css'

import { connect } from 'react-redux'
import * as React from 'react'

import FilterPills from '../FilterPills/FilterPills'

import InputBox from '../InputBox/InputBox'
import Loader from '../Loader/Loader'
import Messages from '../Messages/Messages'
import QuestionsList from '../QuestionsList/QuestionsList'
import config from '../../config'
import UbotHeader from './UbotHeader'
import ClosePanel from './Close-Panel.png'
import OpenPanel from './Open-Panel.png'


import { mapStateToProps } from './connector'

import { relative } from 'path';

type Props = {
  suggestedQuestions: Array<string>,
  favouriteQuestions: Array<string>,
}
type State = {}

class Chat extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      toggleWindow: true,
      showQuestions: false,
      isOpened: false
    }
    this.toggleQuestionMenuWindow = this.toggleQuestionMenuWindow.bind(this);
    this.setWrapperRef = this.setWrapperRef.bind(this)
    this.setWrapperRefOpenClose = this.setWrapperRefOpenClose.bind(this)
    this.handleClickOutside = this.handleClickOutside.bind(this)
  }
  closeWindow() {
    this.setState({
      toggleWindow: !this.state.toggleWindow,

    });
  }
  toggleQuestionMenuWindow() {
    //let x = document.getElementsByClassName("main");
    //x.style.marginLeft = "250px";
    
  // document.onclick = function(e){
  //   if(e.target.id == document.getElementById("menuIcon")){
  //     console.log("clicked outside menuIcon");
  //   }
  // };
    
    if(!this.isOpened){
        document.getElementById("main").style.transition = "0.5s";
        document.getElementById("main").style.marginLeft = "40%";
        // document.getElementById("main").style.marginRight = "2px";
        document.getElementById("main").style.width = "60%";
        document.getElementById("msgBoxBottom").style.width = "60%";
        document.getElementById("icon-close").style.display = "block";
        document.getElementById("icon-open").style.display = "none";
        this.isOpened = true;

        //console.log("opening");
        this.setState({
          showQuestions: !this.state.showQuestions,
        });
    }
    else{
      document.getElementById("main").style.marginLeft = "0px";
      document.getElementById("main").style.marginRight = "2px";
      document.getElementById("main").style.width = "100%";
      document.getElementById("msgBoxBottom").style.width = "100%";  
      document.getElementById("icon-close").style.display = "none";
      document.getElementById("icon-open").style.display = "block";
      this.isOpened = false;
      this.setState({
        showQuestions: false,
        isOpened: false
      })
      //console.log("closing");
      
    }
    
    
  }
  componentDidMount() {
    document.addEventListener('mousedown', this.handleClickOutside)
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleClickOutside)
  }

  /**
   * Set the wrapper ref
   */
  setWrapperRef(node) {
    this.wrapperRef = node
    //console.log(this.wrapperRef);
    //document.getElementById("main").style.transition = "0.5s";
    
  }

  setWrapperRefOpenClose(node) {
    this.wrapperRefOpenClose = node
    //console.log(this.wrapperRefOpenClose);
    //document.getElementById("main").style.transition = "0.5s";
    
  }
  
  handleClickOutside(event) {
    //console.log("clicked outside");
    
    if (this.wrapperRef && !this.wrapperRef.contains(event.target)) {
      //console.log("clicked outside");
      this.setState({
        showQuestions: false,
        isOpened: false
      })
      //this.toggleQuestionMenuWindow();
      //console.log(this.isOpened)
      document.getElementById("main").style.transition = "0.5s";
      document.getElementById("main").style.marginLeft = "0%";
      document.getElementById("main").style.marginRight = "2px";
      document.getElementById("main").style.width = "100%";
      document.getElementById("msgBoxBottom").style.width = "100%";
      document.getElementById("icon-close").style.display = "none";
      document.getElementById("icon-open").style.display = "block";
      if (!this.wrapperRefOpenClose.contains(event.target)){
        this.isOpened = false;
      }
      
    }
    
    if(event.target.id == "menuIcon" || event.target.parentElement.id == "menuIcon"){
      this.toggleQuestionMenuWindow() ;

    }
      
  }
  
  render(): React.Node {
    return (
      <div className="container-fluid main" id="main"> 
      <div className="row" >      
        <div className="questions">
        <div className="row" style={{ display: 'inline-block' }}>
                          
                          <div className="questionListPosition" ref={this.setWrapperRef}>
                            {this.state.showQuestions && (<QuestionsList
                              name="Suggested Questions"
                              questions={this.props.suggestedQuestions} 
                              onQuestionSelect={this.toggleQuestionMenuWindow}/>)}
        
                            {this.state.showQuestions && (<QuestionsList
                              name="Favorite Questions"
                              questions={this.props.favouriteQuestions}
                              onQuestionSelect={this.toggleQuestionMenuWindow}
                              removeOption />
                            )}
                          </div>
        
                        </div>
                       
        </div>
        <div className="col-md-12 chatPanel" >
        <FilterPills />
        <div className="row chatBot-Height" >
                  

                  {/* <Chat toggleQuestionMenu={this.toggleQuestionMenuWindow} /> */}
                  <div className="col-12" style={{ height: '89%',padding:'0'}}>
                    
        
                    <div className="card  ml-2" style={{ bottom: '0px', height: '100%', border: 'none',width:'100%',position:'absolute',    paddingRight: "7px" }}> 
                      <Loader />
                      <div className="messages" id="messages-window" >
                        {/* <div className="p-1 menuIcon" onClick={this.toggleQuestionMenuWindow} id="menuIcon"
                        ref={this.setWrapperRefOpenClose}> */}
                          {/* <i className="fa fa-bars icon-color" /> */}
                          
                          {/* <img src={OpenPanel} alt="PDF IMAGE" className="panelicon" id="icon-open"/>
                          <img src={ClosePanel} alt="PDF IMAGE" className="panelicon" id="icon-close"/> */}
                          {/* <i className="fa fa-chevron-circle-right icon-color" id="icon-open" />
                          <i className="fa fa-chevron-circle-left icon-color" id="icon-close" /> */}
                          {/* </div> */}
                       <Messages />
        
                      </div>
        
                    </div>
                    </div>
                    <div className="col-12" >
                    <div className="msgBoxBottom row  justify-content-between" id="msgBoxBottom">
                      {/* <div> <FilterPills /></div> */}
                       <div className="col-1 open-close">
                       <div className="p-1 menuIcon" 
                      //  onClick={this.toggleQuestionMenuWindow} 
                       id="menuIcon"
                        ref={this.setWrapperRefOpenClose}>
                          {/* <i className="fa fa-bars icon-color" /> */}
                          
                          <img src={OpenPanel} alt="PDF IMAGE" className="panelicon" id="icon-open"/>
                          <img src={ClosePanel} alt="PDF IMAGE" className="panelicon" id="icon-close"/>
                          {/* <i className="fa fa-chevron-circle-right icon-color" id="icon-open" />
                          <i className="fa fa-chevron-circle-left icon-color" id="icon-close" /> */}
                          </div>
                          </div>       
                         <div className="col-11 inputarea ">
                      <div id="inputBox"><InputBox /></div>
                      </div>
                    </div>
        
                  </div>
                </div>        
        </div>        
      </div>
      </div>      
    )
  }
}

export default connect(mapStateToProps)(Chat)




