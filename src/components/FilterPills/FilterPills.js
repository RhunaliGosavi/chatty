// @flow
import './FilterPills.css'

import { connect } from 'react-redux'
import * as React from 'react'
import 'font-awesome/css/font-awesome.min.css';

import { getColorString } from '../../utils'
import { mapDispatchToProps, mapStateToProps } from './connector';
// import { bindActionCreators } from "redux";
// import type { Intent } from '../../initialState'

type Pill = Array<string> | string | { value: string }
type Props = {
  extractedEntities: { [key: string]: string },
  deleteEntity: (string) => mixed,
  resetChat: void => mixed,
}
type State = {}

class FilterPills extends React.Component<Props, State> {
  formatFilterPillData(pill: Pill): string {
    if (typeof pill === 'string') {
      return pill
        .toLowerCase()
        .replace(/(\bby\b|\bfor\b|\bin\b|\bof\b|\bwise\b|\bterms\b|\bsort\b|\bwith\b|\bis\b)/, '')
    } else if (pill instanceof Array) {
      return pill.join()
    } else {
      return pill['value']
        .toLowerCase()
        .replace(/(\bby\b|\bfor\b|\bin\b|\bof\b|\bwise\b|\bterms\b|\bsort\b|\bwith\b|\bis\b)/, '')
    }
  }

  getFilterPills(): Array<React.Node> {
    let pills = []
    let count = -1
    for (let el in this.props.extractedEntities) {
      count += 1
      pills.push(
        <div className="FilterPills-pill" key={count}>
          <div className="FilterPills-remove" onClick={(): mixed => this.props.deleteEntity(el)}>
            <i className="fa fa-close" style={{fontSize: '10px'}}/>
          </div>
        <div className="FilterPills-name" style={{ backgroundColor: '#F7FAFD' }}>   {/* getColorString(el, 0.2) */}
            {el}
          </div>
          <div className="FilterPills-value">
            {this.formatFilterPillData(this.props.extractedEntities[el])}
          </div>
          
        </div>
      )
    }
    return pills
  }

  resetIntent = () => {this.props.resetEntity()}

  render(): React.Node {
    return (
      <div className=" row FilterPills d-flex justify-content-between "  id="filterPills">
         
        <div className="col-md-12 pr-0">
        {/* <div className=" col-md-1 "> */}
          <div className="FilterPills-clear-chat tooltip float-left" onClick={(): mixed => this.props.resetChat()} style={{backgroundColor:'#004F80',maxWidth:'50px'}}>
            <span className="tooltiptext">Reset</span>  <i className="fa fa-refresh" style={{color:'#fff'}} />
          {/* Reset chat */}
        </div>
          {/* </div> */}
        { this.props.intent && (
                <div className="intentBtn float-left ml-4">
                   <span class="btn-addon"><a onClick= {this.resetIntent} ><i class="fa fa-close" style={{color: "#0069d9"}}></i></a></span>
 <div className=" btn btn-primary text-center">{this.props.intent}</div>
                   
                   
                    
                </div>
                   
                
                 
                )}
        {!(
          this.props.extractedEntities === undefined ||
          Object.keys(this.props.extractedEntities).length === 0
        ) ? (
         
             <div className="FilterPills-inner">{this.getFilterPills()}
          </div>     
        ) : (
          <div className="FilterPills-empty  text-left" >No entities found</div>
        )}
        
           
              
      </div>
      </div> 
    )
  }
}



export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FilterPills)
