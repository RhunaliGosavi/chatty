// @flow
import './ChartPie.css'

import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'
import * as React from 'react'

import type { GraphMessage } from '../../initialState'
import { defaultColors } from '../../values.js'
import { filterArray } from '../../utils'
import ToolTip from '../ToolTip/ToolTip'

type Props = {
  mini?: boolean,
  message: GraphMessage,
}
type State = {
  key?: string,
}

class ChartPie extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)

    let self: any = this // eslint-disable-line
    self.changeKey = self.changeKey.bind(this)

    this.state = {
      key: undefined,
    }
  }
  changeKey(key: string, e) {
    if (e) {
      e.stopPropagation()
      e.nativeEvent.stopImmediatePropagation()
    }
    this.setState({
      ...this.state,
      key,
    })
  }

  reshapeData(
    data: Array<{ [key: string]: any }>,
    key: string,
    xaxis: string
  ): Array<{ [key: string]: any }> {
    const reshapedData = data.map(el => {
      return { name: el[xaxis], value: el[key], '@extra/tooltip': el['@extra/tooltip'] || null }
    })
    return reshapedData
  }

  render(): React.Node {
    const { mini, message } = this.props
    let { data, xaxis, colors, chartFields } = message

    const toRemove = Object.keys(data[0]).filter(k => k.startsWith('@extra/'))
    let keys = filterArray(Object.keys(chartFields || data[0]), [xaxis, ...toRemove])

    colors = colors ? colors : defaultColors

    data = Array.from(data).splice(0, 20) // Array.from due to immer ( limit to 20 )

    const currentKey = this.state.key ? this.state.key : keys[0]
    const reshapedData = this.reshapeData(data, currentKey, xaxis)

    return (
      <div className="ChartPie">
        <div className="ChartPie-chart">
          <ResponsiveContainer>
            <PieChart>
              {!mini && <Legend />}
              <Tooltip content={<ToolTip />} />
              <Pie
                data={reshapedData}
                fill="#8884d8"
                innerRadius={'30%'}
                labelLine={false}
                label={(data: {
                  payload: { name: string, value: string },
                  percent: number,
                }): ?React.Node => {
                  if (data.percent > 0.05) return `${data.payload.name}: ${data.payload.value}`
                }}>
                {data.map(
                  (entry: mixed, index: number): React.Node => {
                    return <Cell key={index} fill={colors[index % colors.length]} stroke={'#fff'} />
                  }
                )}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
        {keys.length > 1 && (
          <div className="ChartPie-keys">
            {keys.map(
              (key: string, i: number): React.Node => (
                <div
                  key={i}
                  className={`ChartPie-key ${currentKey === key ? 'selected' : ''}`}
                  onClick={(e: window.HTMLInputEvent): mixed => this.changeKey(key, e)}>
                  {key}
                </div>
              )
            )}
          </div>
        )}
      </div>
    )
  }
}

export default ChartPie
