// @flow
import './Message.css'

import { connect } from 'react-redux'
import Loadable from 'react-loadable'
import Modal from 'react-responsive-modal'
import * as React from 'react'
import ReactLoading from 'react-loading'
import Select from 'react-select'

import type { GraphMessage, Intent, MessageType, TableMessage } from '../../initialState'
import { affineTransform, downloadCSV, getDagger } from '../../utils'
import { mapDispatchToProps, mapStateToProps } from './connector'
import { modalStyle } from '../../values'
import IntentSelect from '../IntentSelect/IntentSelect'
import IntentSelectDocs from '../IntentSelectDocs/IntentSelectDocs'
import IntentSelectRebate from '../IntentSelectRebate/IntentSelectRebate'


const Loader = (): React.Node => {
  return <ReactLoading type="cylon" color="rgba(220, 233, 244, 1)" className="default-loader" />
}
const Chart = Loadable({
  loader: () => import('../Chart/Chart'),
  loading: Loader,
})
const ExternalLink = Loadable({
  loader: () => import('../ExternalLink/ExternalLink'),
  loading: Loader,
})
const FancySelect = Loadable({
  loader: () => import('../FancySelect/FancySelect'),
  loading: Loader,
})
const Image = Loadable({
  loader: () => import('../Image/Image'),
  loading: Loader,
})
const Table = Loadable({
  loader: () => import('../Table/Table'),
  loading: Loader,
})

type Props = {
  message: MessageType,
  bot: string,
  user?: string, // will not be available when in preview mode
  forPreview?: boolean,
  favouriteQuestions: Array<string>,
  currentIntent?: Intent,
  alternateIntents?: Array<{ name: string, confidence: number }>,
  isLastUserMessage: boolean,
  toggleFavs: (string, Array<string>) => mixed,
  sendRedoIntent: (string, string, string, string) => mixed,
}
type State = {
  open: boolean,
  vote?: string,
  chartType?: string,
}

class Message extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      open: false,
      vote: undefined,
      chartType: undefined,
    }

    let self: any = this // eslint-disable-line
    self.onModalToggle = self.onModalToggle.bind(this)
    self.getMessage = self.getMessage.bind(this)
    self.markVote = self.markVote.bind(this)
    self.getChartModalUtil = self.getChartModalUtil.bind(this)
    self.getVoteIcons = self.getVoteIcons.bind(this)
    self.getFavButton = self.getFavButton.bind(this)
    self.onChartSelect = self.onChartSelect.bind(this)
    self.downloadData = self.downloadData.bind(this)
    self.intentRenderer = self.intentRenderer.bind(this)
   
  }

  componentDidMount() {
    Chart.preload()
    ExternalLink.preload()
    FancySelect.preload()
    Image.preload()
    Table.preload()
  }

  onModalToggle() {
    // if (e) {
    //   e.stopPropagation()
    //   if (e.nativeEvent) e.nativeEvent.stopImmediatePropagation()
    // }
    this.setState({
          open: !this.state.open ,
    })
  }

  onChartSelect(data: { value: string, label: string }) {
    const type = data.value
    this.setState({
      ...this.state,
      chartType: type,
    })
  }

  downloadData() {
    let { data, title } = this.props.message
    downloadCSV(data, title)
  }
 
  getChartModalUtil(
    message: GraphMessage | TableMessage,
    mini: boolean,
    onlyTable: boolean = false,
    chartType: string
  ): React.Node {
    let { data, title, xaxis, charts, enableDownload } = message

    const supportedCharts = ['table', 'line', 'bar', 'pie', 'scatter']
    const chartInfo = {
      table: {
        displayName: 'Table',
        icon: 'fas fa-table',
      },
      line: {
        displayName: 'Line chart',
        icon: 'fas fa-chart-line',
      },
      bar: {
        displayName: 'Bar chart',
        icon: 'fas fa-chart-bar',
      },
      pie: {
        displayName: 'Pie chart',
        icon: 'fas fa-chart-pie',
      },
      scatter: {
        displayName: 'Scatter plot',
        icon: 'fas fa-braille',
      },
      csv: {
        displayName: 'Download',
        icon: 'fas fa-file-download',
      },
    }

    let enabledCharts
    if (charts && charts.length > 0) {
      charts = charts.filter((ch: string): boolean => supportedCharts.indexOf(ch) > -1)
      enabledCharts = charts
    } else enabledCharts = [...supportedCharts]

    const chartOptions = enabledCharts.map(
      (chart: string): { value: string, label: string } => {
        return { value: chart, label: chartInfo[chart].displayName }
      }
    )

    const currentChartType = chartType
      ? { value: chartType, label: chartInfo[chartType].displayName }
      : undefined

    return (
      <div className={`chart-modal-utils ${mini ? 'mini' : ''}`}>
        <div className="chart-modal-utils-title">{title}</div>
        <div className="chart-modal-utils-buttons">
          {!mini && !onlyTable && enabledCharts.length > 1 && (
            <Select
              options={chartOptions}
              value={currentChartType}
              defaultValue={chartOptions[0]}
              className="chart-options"
              classNamePrefix="select"
              onChange={this.onChartSelect}
            />
          )}
          {!mini && enableDownload && (
            <button className="chart-modal-utils-download-button" onClick={this.downloadData}>
              <i className="fas fa-file-download chart-modal-utils-download-button-icon" />
              <div className="chart-modal-utils-download-button-text">Download</div>
            </button>
          )}
        </div>
        {mini && !onlyTable && (
          <div className="chart-modal-utils-visualize-button">Graphs available</div>
        )}
      </div>
    )
  }

  getVoteIcons(): React.Node {
   
    const { source, isPrompt } = this.props.message
    if (source === 'bot' && isPrompt === false)
      return (
        <div className="vote-icons">
          <i
            className={`far fa-thumbs-up vote-icon ${this.state.vote === 'up' ? 'selected' : ''}`}
            onClick={(e: window.HTMLInputEvent): mixed => this.markVote('up', e)}
          />
          <i
            className={`far fa-thumbs-down vote-icon ${
              this.state.vote === 'down' ? 'selected' : ''
            }`}
            onClick={(e: window.HTMLInputEvent): mixed => this.markVote('down', e)}
          />
        </div>
      )
  }

  getFavButton(): React.Node {
    const {
      favouriteQuestions,
      message: { source, data },
    } = this.props
    const isFav = favouriteQuestions.indexOf(data) > -1
    if (source === 'user')
      return (
        <div
          className="fav-icon"
          onClick={(): mixed => {
            this.props.toggleFavs(data, favouriteQuestions)
          }}>
          <i className={`${isFav ? 'fas' : 'far'} fa-star`} />
        </div>
      )
  }

  intentRenderer(intent: Intent): React.Node {
    const { name, confidence, displayName } = intent
    const {
      message: { data: lastUserMessage },
      sendRedoIntent,
    } = this.props
    // const lastUserMessage = message.data
    let color = `hsl( ${120 - affineTransform(1, 0, 1, 120, confidence)}, 80%, 40%)`
    return (
      <div
        className="FancySelect-content"
        style={{ color }}
        onClick={() => {
          sendRedoIntent(name, lastUserMessage)
        }}>
        <div>{displayName || name}</div>
        <div>{Math.round(confidence * 100)}%</div>
      </div>
    )
  }

  getIntentSwitcher(): ?React.Node {
    const { currentIntent, alternateIntents, isLastUserMessage } = this.props
    if (!currentIntent) return
    const { displayName, confidence, name } = currentIntent
    let color = `hsl( ${120 - affineTransform(1, 0, 1, 120, confidence)}, 80%, 40%)`
    if (isLastUserMessage)
      return (
        <FancySelect
          trigger={
            <div style={{ color, display: 'flex' }}>
              <div>{displayName || name}</div>
              <div>{Math.round(confidence * 100)}%</div>
            </div>
          }
          contents={alternateIntents}
          contentRenderer={this.intentRenderer}
        />
      )
  }

  markVote(vote?: string, e: window.HTMLInputEvent) {
    if (e) {
      e.stopPropagation()
      if (e.nativeEvent) e.nativeEvent.stopImmediatePropagation()
    }
    if (this.state.vote === vote) vote = undefined
    this.setState({ ...this.state, vote })

    const {
      message: { id },
    } = this.props
    const data = { id, vote: vote }

    getDagger()
      .post('update', data)
      .catch(err => console.warn(err))
  }

  getMessage(message: MessageType, forPreview: boolean): React.Node {
    let { type, source, data, charts, unused_words = [], linkType } = message
    console.log("WHOLE MESSAGE", message);
    if(message.data == 'Hi, How may I help you?') console.log("TRuE");
    
    if(message.data == 'Hi, How may I help you?')
    {
      return (
        [<div class="message message-bot-text"><div class="inner" id="inner">
          Hi, How may I help you?</div></div>
        ,<div class="message message-bot-text">
          <IntentSelect />
          <IntentSelectDocs />
          <IntentSelectRebate />
          {/* <button className = "btn btn-primary btn-greet">Tools</button> */}
        {/* <button className = "btn btn-primary btn-greet">Drive Docs</button> */}
        {/* <button className = "btn btn-primary btn-greet">Rebate Statement</button> */}
        </div>  
      ]
      )
    }
    if (!message) return
    let onlyTable = true
    if (charts) onlyTable = charts.length === 1 && charts[0] === 'table'

    let chartType = charts && charts.length > 0 ? charts[0] : 'table'
    chartType = this.state.chartType ? this.state.chartType : chartType

    if ((type === 'table' || type === 'chart') && data.length === 0) {
      type = 'text'
      data = 'No data available'
    }
    let className = `${type === 'divider' ? '' : 'message'} message-${source}-${type}`
    if (forPreview) className = 'for-preview'
    let element = '...'
    if (type === 'text') {
      if(data!= undefined){
        let msgSplits = data.split('\n').filter(
          (ms: string): boolean => {
            return !(ms === '' || ms === ' ')
          }
        )
        element = msgSplits.map(
          (msg: string, i: number): React.Node => (
            <div className={className} key={i}>
              {this.getFavButton()}
              <div className="inner" id="inner">
                {msg.split(' ').map(
                  (m: string, i: number): React.Node => {
                    return (
                      <React.Fragment key={i}>
                        <span id="test" className={`${unused_words.indexOf(m.toLowerCase()) > -1 ? 'faded' : ''}`}>
                          {m}
                        </span>{' '}
                      </React.Fragment>
                    )
                  }
                )}
              </div>
              {/* {i === msgSplits.length - 1 && this.getVoteIcons()} */}
            </div>
          )
        )
      }
       
  
      // element.push(this.getIntentSwitcher())
    } else if (type === 'divider') {
      element = (
        <div className={className}>
          <div className="divider">{'//'}</div>
          {data}
          <div className="divider">{'//'}</div>
        </div>
      )
    } else if (type === 'image') {
      element = (
        <div
          className={className}
          onClick={(e: window.HTMLInputEvent): mixed => this.onModalToggle(true, e)}>
          <Modal
            styles={modalStyle}
            open={this.state.open}
            onClose={(e: window.HTMLInputEvent): mixed => this.onModalToggle(false, e)}
            center>
            <Image data={data} />
          </Modal>
          <div className="inner">
            <Image data={data} mini />
          </div>
          {/* {this.getVoteIcons()} */}
        </div>
      )
    } else if (type === 'link') {
      element = (
        <div
          className={className}>
            {/* <div className="inner" style={{width:'70%'}} */ }
            {/**<div className="inner" style={{width:'30%'}}
          onClick={(e: window.HTMLInputEvent): mixed => this.onModalToggle(true, e)}>
           <ExternalLink message={data} linkType={linkType}/> 
          </div>**/}

         {/* <div className="inner" style={{width:'40%'}} > */ }

         <div className="inner innerAnswer" >
           
           <ExternalLink message={data} linkType={linkType}/> {/**mini */} 
          </div>

          <Modal
            styles={modalStyle}
            open={this.state.open}
            onClose={(e: window.HTMLInputEvent): mixed => this.onModalToggle(false, e)}
            center>
              {console.log("Data::", data)}
              {/* {console.log("LINK:",data.link[0]) }
              {console.log("TEXT:",data.text[0]) } */}
              {/* {console.log("ENTITY:",data.entity) } */}
              
            <ExternalLink message={data} linkType={linkType} />
          </Modal>
         
          {/* {this.getVoteIcons()} */}
        </div>
      )
    } else {
      element = (
        <React.Fragment>
          <div className={className}>
            <Modal
              styles={modalStyle}
              open={this.state.open}
              onClose={this.onModalToggle}
              little
              center>
              {this.getChartModalUtil(message, false, onlyTable, chartType)}
              <Chart type={chartType} data={message} />
            </Modal>
            <div
              className={`inner ${chartType=='table'?'':'width100vw'}`}
              onClick={this.onModalToggle}> {/** className={`inner ${chartType=='table'?'':'width100vw'}`} */}
              {this.getChartModalUtil(message, true, onlyTable, chartType)}
              <Chart type={chartType} data={message} mini={chartType=='table'}/> {/** mini */}
            </div>
            {/* {!forPreview && this.getVoteIcons()} */}
          </div>
        </React.Fragment>
      )
    }
    return element
  }

  render(): React.Node {
    let { message, forPreview = false } = this.props
    return <React.Fragment>{this.getMessage(message, forPreview)}</React.Fragment>
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Message)
