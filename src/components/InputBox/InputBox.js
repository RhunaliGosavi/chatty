// @flow
import './InputBox.css'

import { connect } from 'react-redux'
import Completor from 'react-completor'
import * as React from 'react'

import type { Entity, Questions } from '../../initialState'
import { dtokv } from '../../utils'
import { mapDispatchToProps, mapStateToProps } from './connector'
import QuickReply, { type Button } from '../QuickReply/QuickReply'
import sendIcon from './send.svg'
import recorder from './Ripple-1s-24px.gif'
import microphone from './mic-icon.png'

type Props = {
  uid: string,
  inputType: 'text' | 'buttons',
  suggestedQuestions: Questions,
  entityValues: Array<Entity>,
  disabiguationIntents?: { [key: string]: string },
  nonShortListedDisambiguationIntents?: { [key: string]: string },
  initialFetch: void => mixed,
  sendMessage: (string, ?string) => mixed,
  initialMessage: void => mixed,
}
type State = {}

class InputBox extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    //for speechRecognition
    // this.state = {
    //   inputText: ' ',
    // }
    let self: any = this //eslint-disable-line
    self.onSubmit = self.onSubmit.bind(this);
    self.onSubmitRecorder = self.onSubmitRecorder.bind(this)
  }

  onSubmit(message: string, intent?: string) {
    const { sendMessage } = this.props
    //console.log("INPUT message: ", message);
    //console.log("intent: ", intent);
    sendMessage(message, intent)
  }
  
  onSubmitRecorder() {
    window.SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
    let finalTranscript = '';
    let recognition = new window.SpeechRecognition();
    recognition.interimResults = true;
    recognition.maxAlternatives = 10;
    recognition.continuous = true;
    console.log("Recorder clicked!!!");
    var inputText,temp;
    var timeout="";
    recognition.start();
    recognition.onstart = function() {
      console.log('Speech recognition service has started');
      document.getElementById('triggerRecorder').innerHTML =
      '<img class="sendicon2" src=' + recorder + ' alt=">>">'
  };

    recognition.onresult = (event) => {
      clearTimeout(timeout);
      let interimTranscript = '';
      for (let i = event.resultIndex, len = event.results.length; i < len; i++) {
        let transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript;

        } else {
          interimTranscript += transcript;
        }
      }
      var scrolling = function(e, c) {
        e.scrollIntoView();
        if (c < 5) setTimeout(scrolling, 300, e, c + 1);
      };
      var ensureVisible = function(e) {
        setTimeout(scrolling, 300, e, 0);
      };
     
      document.getElementById("react-completor-user-input").value = finalTranscript ;
      document.getElementById("react-completor-user-input").onfocus = ensureVisible(this);

      inputText=finalTranscript;
      //for speechRecognition input
      // this.setState({
      //   ...this.state,
      //   inputText: finalTranscript,
      // })
       
      timeout = setTimeout(()=>{
         recognition.stop();

       },3000)

    }
    recognition.onend = function() {
      document.getElementById('triggerRecorder').innerHTML =
    '<img class="sendicon2" src=' + microphone + ' alt=">>">'
    sendMessage(inputText,temp);
     };
   
     const { sendMessage } = this.props;
     
    // setTimeout(()=>{
    //   this.onSubmit(inputText);
    //  },3000)

    //this.onSubmit(iputText,temp); 
  }
  render(): React.Node {
    const {
      suggestedQuestions: sentences,
      entityValues: chunks,
      inputType,
      disabiguationIntents = {},
      nonShortListedDisambiguationIntents = {},
    } = this.props
    //const { inputText } = this.state;
    const mainButtons = dtokv(disabiguationIntents)
    const otherButtons = dtokv(nonShortListedDisambiguationIntents)

    const trigger = (): React.Node => {
      return <div className="tooltipTrigger"><span className="tooltiptext">Send</span><i className="fa fa-send icon-color"/></div>
    }
    const triggerRecorder = (): React.Node => {
      return <div className="tooltipTrigger" id="triggerRecorder"><span className="tooltiptext">Speak</span><img class="sendicon2" src={microphone} alt=">>"/></div>
    }
 
    return (
    
      <React.Fragment>
        
        <div className="InputBox">
          {inputType === 'text' ? (
            <Completor
              trigger={trigger}
              triggerRecorder={triggerRecorder}
              placeholder="Type your message..."
              data={{ sentences, chunks }}
              onSubmit={this.onSubmit}
              onSubmitRecorder={this.onSubmitRecorder}
             
            />
          ) : (
            <QuickReply
              mainButtons={mainButtons}
              otherButtons={otherButtons}
              onSubmit={(value: string, label: string): mixed => this.onSubmit(label, value)}
            />
          )}
        </div>
      </React.Fragment>
    )
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(InputBox)
