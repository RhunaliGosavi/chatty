// @flow
import './ChartLine.css'

import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import * as React from 'react'

import type { DataType } from '../Messages/Messages'
import type { GraphMessage } from '../../initialState'
import { defaultColors } from '../../values.js'
import { filterArray } from '../../utils'
import ToolTip from '../ToolTip/ToolTip'

type Props = {
  mini?: boolean,
  message: GraphMessage,
}
type State = {}

class ChartLine extends React.Component<Props, State> {
  splitData(
    data: Array<DataType>,
    splitBy: string | Array<string>
  ): Array<{ name: string, data: Array<DataType> }> {
    let chunks = []
    if (typeof splitBy === 'string') {
      const options = [...new Set(data.map(d => d[splitBy]))]
      options.forEach(option => {
        let chunk = []
        data.forEach(d => {
          let c = { ...d }
          if (c[splitBy] === option) {
            delete c[splitBy]
            chunk.push(c)
          }
        })
        chunks.push({ name: option, data: chunk })
      })
    }
    return chunks
  }
  render(): React.Node {
    const { mini, message } = this.props
    let { data, xaxis, yaxis, options, colors, chartFields } = message

    colors = colors ? colors : defaultColors
    const splitBy = options && options.line && options.line.splitBy

    let toRemove = Object.keys(data[0]).filter(k => k.startsWith('@extra/'))
    if (xaxis) toRemove.push(xaxis)
    if (splitBy) toRemove.push(splitBy)
    let keys = filterArray(chartFields || Object.keys(data[0]), toRemove)

    const connectNulls = ((options || {}).charts || {}).connectNulls === true
    const allowDecimals = ((options || {}).charts || {}).allowDecimals === true

    let chunks = [{ name: 'default', data: data }]
    if (splitBy) chunks = this.splitData(data, splitBy)
    const splits = chunks.length

    let height = '100%'
    let width = '100%'
    if (splits > 2) {
      height = '50%'
      width = '50%'
    } else if (splits === 2) height = '50%'
    const containerStyle = { height, width, xaxis, yaxis }

    return (
      <div className="ChartLine-container" style={{ overflow: splits > 4 ? 'scroll' : 'hidden' }}>
        {chunks.map(
          (chunk, index: number): React.Node => (
            <div style={containerStyle} key={index}>
              <ResponsiveContainer>
                <LineChart data={chunk['data']}>
                  {!this.props.mini && <CartesianGrid strokeDasharray="3 3" />}
                  <XAxis
                    dataKey={xaxis}
                    allowDecimals={allowDecimals}
                    label={{
                      value: `${splits > 1 ? '[' + chunk['name'] + '] ' : ''} ${xaxis}`,
                      offset: 0,
                      position: 'insideBottom',
                    }}
                  />
                  <YAxis
                    dataKey={keys.indexOf(yaxis) > -1 && yaxis}
                    domain={['auto', 'auto']}
                    hide={mini}
                    allowDecimals={allowDecimals}
                    label={{ value: yaxis, angle: -90, position: 'insideLeft' }}
                  />
                  <Tooltip content={<ToolTip />} />
                  <Legend />
                  {keys.map(
                    (key: string, i: number): React.Node => (
                      <Line
                        key={i}
                        connectNulls={connectNulls}
                        type="monotone"
                        dataKey={key}
                        stroke={colors[i]}
                      />
                    )
                  )}
                </LineChart>
              </ResponsiveContainer>
            </div>
          )
        )}
      </div>
    )
  }
}

export default ChartLine
