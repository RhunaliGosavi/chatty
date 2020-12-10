// @flow
import './ChartBar.css'

import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import * as React from 'react'

import type { GraphMessage } from '../../initialState'
import { defaultColors } from '../../values.js'
import { filterArray } from '../../utils'
import ToolTip from '../ToolTip/ToolTip'

type Props = {
  mini?: boolean,
  message: GraphMessage,
}
type State = {}

class ChartBar extends React.Component<Props, State> {
  render(): React.Node {
    const { mini, message } = this.props
    let { data, xaxis, yaxis, colors, options, chartFields } = message
    const isStacked = options && options.bar && options.bar.type === 'stacked'

    const toRemove = Object.keys(data[0]).filter(k => k.startsWith('@extra/'))
    let keys = filterArray(chartFields || Object.keys(data[0]), [...toRemove, xaxis])

    const connectNulls = ((options || {}).charts || {}).connectNulls === true
    const allowDecimals = ((options || {}).charts || {}).allowDecimals === true

    colors = colors ? colors : defaultColors

    return (
      <React.Fragment>
        <ResponsiveContainer>
          <BarChart data={data}>
            {!this.props.mini && <CartesianGrid strokeDasharray="3 3" />}
            <XAxis
              dataKey={xaxis}
              label={{ value: xaxis, offset: 0, position: 'insideBottom' }}
              allowDecimals={allowDecimals}
            />
            <YAxis
              dataKey={keys.indexOf(yaxis) > -1 && yaxis}
              hide={mini}
              allowDecimals={allowDecimals}
              label={{ value: yaxis, angle: -90, position: 'insideLeft' }}
            />
            <Legend />
            <Tooltip content={<ToolTip />} />
            {keys.map(
              (key: string, i: number): React.Node => (
                <Bar
                  key={i}
                  stackId={isStacked ? 'only' : undefined}
                  dataKey={key}
                  fill={colors[i]}
                  barSize={20}
                />
              )
            )}
          </BarChart>
        </ResponsiveContainer>
      </React.Fragment>
    )
  }
}

export default ChartBar
