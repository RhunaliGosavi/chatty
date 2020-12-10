// @flow
import * as React from 'react'
import './ExternalLink.css'

import tableau from 'tableau-api' // eslint-disable-line
import filelogo from './file-icon.png'
import pdflogo from './pdf-icon.png'
import { scrollIntoView } from 'react-select/src/utils'

type Props = {
  message: { link: string, text: string, entity: String },
  linkType: string,
  mini?: boolean,
}
type State = {
  viz?: any,
  rendered: boolean,
}

const i_figured_tableau_out = false // change once tableau is somethig I understand

class ExternalLink extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)

    this.state = {
      viz: undefined,
      rendered: false,
    }

    let self: any = this // eslint-disable-line
    self.tableauDownload = self.tableauDownload.bind(this);
    self.myFunction = self.myFunction.bind(this);
  }

  myFunction() {
    var iframe = document.getElementById("mid-container");
    var elmnt = iframe.contentWindow.document.getElementsByClassName("content-wrapper");
    elmnt.style.overflow = "auto";
  }

  componentDidMount() {
    const { message, linkType } = this.props

    if (linkType === 'tableau' && i_figured_tableau_out) {
      window.addEventListener('load', this.myFunction);
      const link = message.link + '&:toolbar=no'
      const options = {
        hideTabs: true,
        width: '100%',
        height: '100%',
      }
      if (document.getElementById('tableau-iframe').childNodes.length === 0) {
        try {
          this.setState({
            ...this.state,
            viz: new window.tableau.Viz(document.getElementById('tableau-iframe'), link, options),
          })
        } catch {
          console.log('error')
        }
      }
    }
  }

  tableauDownload(type: string) {
    const viz = this.state.viz
    switch (type) {
      case 'pdf':
        viz.showExportPDFDialog()
        break
      case 'excel':
        viz.showExportCrossTabDialog()
        break
      case 'image':
        viz.showExportImageDialog()
    }
  }

  getLinkTypeName(type: string): string {
    console.log('type:', type)
    switch (type) {
      case 'tableau':
        return 'Tableau report'
      case 'pdf':
        return 'PDF File'
      default:
        return 'External link'
    }
  }

  render(): React.Node {
    const { message, linkType, mini } = this.props

    // const returnedEntity = message.entity;

    const doclink = message.doclink + (linkType && i_figured_tableau_out === 'tableau' ? '&:toolbar=no' : '');
    //console.log("doclink:",doclink);
     

    const link = message.link + (linkType && i_figured_tableau_out === 'tableau' ? '&:toolbar=no' : '');
    //console.log("Link: ",link);

        if (message.doclink.length > 0 || message.link.length > 0 ) {
          //console.log("message.doclink.length > 1");
          if(message.entity == 'qtr')
          {
            //console.log("QUARTER");
            
            return[
          
            (<div>
              {message.link.map((val, idx) => {
                let link = message.link[idx] + (linkType && i_figured_tableau_out === 'tableau' ? '&:toolbar=no' : '');
                return (
                  // <div className="ExternalLink mt-3 pt-2 pb-3" style={{ borderBottom: idx != (message.link.length - 1) ? "1px solid lightgray" : "3px solid #004F80" }}>
                  <div className="ExternalLink mt-3 pt-2 pb-3" style={{ borderBottom: idx != (message.link.length - 1) ? "1px solid lightgray" : "0px solid #004F80" }}>
                    {/* {(() => {
                          if (idx == 0) {
                            return (
                              <div className="LinkCategory"><span className="LinkCatSpan">Tools &amp; Resources</span></div>
                            )
                          } 
                        })()}
                     */}
                    <div className="ExternalLink-top">
                      {mini && (
                        <div className="ExternalLink-header">
                          <div className="ExternalLink-title">
                            <i className="fas fa-link ExternalLink-title-icon" />
                            {this.getLinkTypeName(linkType)}
                          </div>
                        </div>
                      )}
                      {/*{'External link: '}*/}
                      {mini && <i className="ExternalLink-open-msg"> (click to open)</i>}
                      {!mini && (
      
      
                        <div className="ExternalLink-button">
      
                          {(() => {
      
      
      
                            // {(() => {
                            if (message.entity == 'document') {
                              return ([
                                <a href={link} className="pdfImg-btn" target="_blank">
                                  <img src={filelogo} alt="PDF IMAGE" className="pdf-img" />
                                </a>,
      
                                <a href={link} target="_blank" rel="noopener noreferrer">
                                {/* <i className="fas fa-external-link-alt ExternalLink-button-icon" /> */}
                                {/* {message.text} */}
                                {message.text[idx]}

                                  
                                  
                                
                                </a>
                               ] )
                            }
      
                            // })()}
      
                            return ([
      
                              <a href={link} target="_blank" rel="noopener noreferrer">
                                {/* <i className="fas fa-external-link-alt ExternalLink-button-icon" /> */}
                                {message.text[idx]}
                                
                              </a>])
      
                          })()
                          }
                        </div>
                        
                      )}
      
      
                      {/* {!mini && (
                        <div className="ExternalLink-link" id="inner">
                          <a href={message.link[idx]} target="_blank" rel="noopener noreferrer">
                            
                            {(() => {
                            if(message.link[idx].length> 80){
                              var link = [];
                              for (var i = 0; i <= 50; i++) {
                                link.push(message.link[idx][i]);           
                                }
                                link.push('...');
                                return link; 
                            }
                            else{
                                  return message.link[idx]
                            }
                            
                          })()}
                            
                            

                          </a>
                        </div>
                      )} */}
                    </div>
                    
                    {/* {
                      var elmnt = document.getElementById("inner");
                      elmnt.scrollIntoView();
                      console.log("SCRIPT");
                      
                      
                    } */}
                    
                    {/* {!mini && (
              <React.Fragment>
                <div className="ExternalLink-iframe" id="tableau-iframe">
                  {!(linkType === 'tableau' && i_figured_tableau_out) && <iframe height='320px' src={link} />}
                </div>
              </React.Fragment>
           )}  */}
                    {!mini && linkType === 'tableau' && i_figured_tableau_out && (
                      <React.Fragment>
                        <div className="tableau-buttons">
                          <div
                            className="button-tableau-download"
                            onClick={(): mixed => this.tableauDownload('pdf')}>
                            PDF Download
                  </div>
                          <div
                            className="button-tableau-download"
                            onClick={(): mixed => this.tableauDownload('excel')}>
                            Excel Download
                  </div>
                          <div
                            className="button-tableau-download"
                            onClick={(): mixed => this.tableauDownload('image')}>
                            Image Download
                  </div>
                        </div>
                      </React.Fragment>
                    )}
                  </div>
                );
              })
              }
            </div>)]
            

          }
          
          else{
           
          return [
            (<div>
              {message.link.map((val, idx) => {
                let link = message.link[idx] + (linkType && i_figured_tableau_out === 'tableau' ? '&:toolbar=no' : '');
                return (
                  <div className="ExternalLink mt-3 pt-2 pb-3" style={{ borderBottom: idx != (message.link.length - 1) ? "1px solid lightgray" : "3px solid #004F80" }}>
                    {(() => {
                          if (idx == 0) {
                            return (
                              <div className="LinkCategory"><span className="LinkCatSpan">Tools &amp; Resources</span></div>
                            )
                          } 
                        })()}
                    
                    <div className="ExternalLink-top">
                      {mini && (
                        <div className="ExternalLink-header">
                          <div className="ExternalLink-title">
                            <i className="fas fa-link ExternalLink-title-icon" />
                            {this.getLinkTypeName(linkType)}
                          </div>
                        </div>
                      )}
                      {/*{'External link: '}*/}
                      {mini && <i className="ExternalLink-open-msg"> (click to open)</i>}
                      {!mini && (
      
      
                        <div className="ExternalLink-button">
      
                          {(() => {
      
      
      
                            // {(() => {
                            if (message.entity == 'document') {
                              return ([
                                <a href={link} className="pdfImg-btn" target="_blank">
                                  <img src={filelog} alt="PDF IMAGE" className="pdf-img" />
                                  {/* <img src="https://image.flaticon.com/icons/svg/337/337946.svg"  /> */}
                                </a>,
      
                                <a href={link} target="_blank" rel="noopener noreferrer">
                                {/* <i className="fas fa-external-link-alt ExternalLink-button-icon" /> */}
                                {/* {message.text} */}
                                {message.text[idx]}

                                  
                                  
                                
                                </a>
                               ] )
                            }
      
                            // })()}
      
                            return ([
      
                              <a href={link} target="_blank" rel="noopener noreferrer">
                                {/* <i className="fas fa-external-link-alt ExternalLink-button-icon" /> */}
                                {message.text[idx]}
                                {/* {window.innerWidth} */}
                                {/* {console.log("window width", window.innerWidth)} */}
                              </a>])
      
                          })()
                          }
                        </div>
                        
                      )}
      
      
                      {/* {!mini && (
                        <div className="ExternalLink-link" id="inner">
                          <a href={message.link[idx]} target="_blank" rel="noopener noreferrer">
                            
                            {(() => {
                            if(message.link[idx].length> 80){
                              var link = [];
                              for (var i = 0; i <= 80; i++) {
                                link.push(message.link[idx][i]);           
                                }
                                link.push('...');
                                return link; 
                            }
                            else{
                                  return message.link[idx]
                            }
                            
                          })()}
                            
                            

                          </a>
                        </div>
                      )} */}
                    </div>
                    
                    {/* {
                      var elmnt = document.getElementById("inner");
                      elmnt.scrollIntoView();
                      console.log("SCRIPT");
                      
                      
                    } */}
                    
                    {/* {!mini && (
              <React.Fragment>
                <div className="ExternalLink-iframe" id="tableau-iframe">
                  {!(linkType === 'tableau' && i_figured_tableau_out) && <iframe height='320px' src={link} />}
                </div>
              </React.Fragment>
           )}  */}
                    {!mini && linkType === 'tableau' && i_figured_tableau_out && (
                      <React.Fragment>
                        <div className="tableau-buttons">
                          <div
                            className="button-tableau-download"
                            onClick={(): mixed => this.tableauDownload('pdf')}>
                            PDF Download
                  </div>
                          <div
                            className="button-tableau-download"
                            onClick={(): mixed => this.tableauDownload('excel')}>
                            Excel Download
                  </div>
                          <div
                            className="button-tableau-download"
                            onClick={(): mixed => this.tableauDownload('image')}>
                            Image Download
                  </div>
                        </div>
                      </React.Fragment>
                    )}
                  </div>
                );
              })
              }
            </div>),
            (
            <div>
              {message.doclink.map((val, idx) => {
                let link = message.doclink[idx] + (linkType && i_figured_tableau_out === 'tableau' ? '&:toolbar=no' : '');
                return (
                  <div className="ExternalLink mt-3 pt-2 pb-3" style={{ borderBottom: idx != (message.doclink.length - 1) ? "1px solid lightgray" : "" }}>
                    
                    {(() => {
                          if (idx == 0) {
                            return (
                              <div className="LinkCategory"><span>Drive documents</span></div>
                            )
                          } 
                        })()}
                    <div className="ExternalLink-top">
                      {mini && (
                        <div className="ExternalLink-header">
                          <div className="ExternalLink-title">
                            <i className="fas fa-link ExternalLink-title-icon" />
                            {this.getLinkTypeName(linkType)}
                          </div>
                        </div>
                      )}
                      {/*{'External link: '}*/}
                      {mini && <i className="ExternalLink-open-msg"> (click to open)</i>}
                      {!mini && (
    
    
                        <div className="ExternalLink-button">
    
                          {(() => {
    
    
                          let len = message.doctext[idx].length;
                          let p = len - 3;
                          let d = len - 2;
                          let f = len - 1;
                          //console.log(p);
                          //console.log(message.doctext[idx][p].toLowerCase());
                          let PDF = message.doctext[idx][p].toLowerCase()
                           + message.doctext[idx][d].toLowerCase() 
                           + message.doctext[idx][f]
                          
                          // if(message.doctext[idx][p] + message.doctext[idx][p] + message.doctext[idx][p] == 'pdf')
                          // {console.log("PDF");
                          // }
                          // if(message.doctext[idx][p].toLowerCase() == 'p'){
                          //   console.log("p");
                          // }
                          // if(message.doctext[idx][d].toLowerCase() == 'd'){
                          //   console.log("d");
                          // }
                          // if(message.doctext[idx][f].toLowerCase() == 'f'){
                          //   console.log("f");
                          // }
                          //console.log(message.doctext[idx].p);
                          
                            
                            // {(() => {
                            if (message.docentity == 'document') {
                              if(PDF == 'pdf'){
                              return ([
                                <a href={message.doclink[idx]} className="pdfImg-btn" target="_blank">
                                  <img src={pdflogo} alt="PDF IMAGE" className="pdf-img2" />
                                  
                                </a>,
    
                                <a href={message.doclink[idx]} target="_blank" rel="noopener noreferrer">
                                {/* <i className="fas fa-external-link-alt ExternalLink-button-icon" /> */}
                                
                                {message.doctext[idx]}
                                  </a>
                               ] )}
                               else
                               return ([
                                <a href={message.doclink[idx]} className="pdfImg-btn" target="_blank">
                                  <img src={filelogo} alt="file IMAGE" className="pdf-img" />
                                </a>,
    
                                <a href={message.doclink[idx]} target="_blank" rel="noopener noreferrer">
                                {/* <i className="fas fa-external-link-alt ExternalLink-button-icon" /> */}
                                
                                {message.doctext[idx]}
                                
    
                                </a>
                               ] )
                            }
    
                            // })()}
    
                            return ([
    
                              <a href={message.doclink[idx]} target="_blank" rel="noopener noreferrer">
                                {/* <i className="fas fa-external-link-alt ExternalLink-button-icon" /> */}
                                {/* {message.text} */}
                                {message.doctext[idx]}
                                {/* {console.log(message.text[idx]) } */}
                                {/* {console.log("TEXT[0]::",message.text[0][0])}  */}
                                {/* {console.log("ELSE link.message:", message.link.length)} */}
                              </a>])
    
    
    
    
                          })()
                          }
                        </div>
                      )}
    
                      {!mini && (
                        <div className="ExternalLink-link path">
                          
                         
                            {(() => {
                           
                                  return message.docpath[idx]
                           
                            
                          })()}
                          
                        </div>
                      )}
                      {/* {!mini && (
                        <div className="ExternalLink-link">
                          <a href={message.doclink[idx]} target="_blank" rel="noopener noreferrer">
                         
                            {(() => {
                            if(message.doclink[idx].length> 80){
                              var link = [];
                              for (var i = 0; i <= 80; i++) {
                                link.push(message.doclink[idx][i]);           
                                }
                                link.push('...');
                                return link; 
                            }
                            else{
                                  return message.doclink[idx]
                            }
                            
                          })()}
                          </a>
                        </div>
                      )} */}
                    </div>
                    
                    {!mini && linkType === 'tableau' && i_figured_tableau_out && (
                      <React.Fragment>
                        <div className="tableau-buttons">
                          <div
                            className="button-tableau-download"
                            onClick={(): mixed => this.tableauDownload('pdf')}>
                            PDF Download
                  </div>
                          <div
                            className="button-tableau-download"
                            onClick={(): mixed => this.tableauDownload('excel')}>
                            Excel Download
                  </div>
                          <div
                            className="button-tableau-download"
                            onClick={(): mixed => this.tableauDownload('image')}>
                            Image Download
                  </div>
                        </div>
                      </React.Fragment>
                    )}
                  </div>
                );
              })
              }
            </div>
            
          )
        ]
      } //if 'qtr'
          
        }
        else {
          return (
            <div className="ExternalLink">
              <div className="ExternalLink-top">
                
                {/*{'External link: '}*/}
                {mini && <i className="ExternalLink-open-msg"> (click to open)</i>}
                {!mini && (
    
    
                              <div className="NoRecordFound">
                                  I cannot answer this question now. I am going to sign up for additional training to answer this question.
                              </div>
    
                )}
             
              </div>
              
              {!mini && linkType === 'tableau' && i_figured_tableau_out && (
                <React.Fragment>
                  <div className="tableau-buttons">
                    <div
                      className="button-tableau-download"
                      onClick={(): mixed => this.tableauDownload('pdf')}>
                      PDF Download
                  </div>
                    <div
                      className="button-tableau-download"
                      onClick={(): mixed => this.tableauDownload('excel')}>
                      Excel Download
                  </div>
                    <div
                      className="button-tableau-download"
                      onClick={(): mixed => this.tableauDownload('image')}>
                      Image Download
                  </div>
                  </div>
                </React.Fragment>
              )}
            </div>
          )
        }
 
  }
}

export default ExternalLink