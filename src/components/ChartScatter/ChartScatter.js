// @flow
import './ChartScatter.css'

import {
  CartesianGrid,
  Cell,
  Legend,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis,
  ZAxis,
} from 'recharts'
import * as React from 'react'

import type { DataType } from '../Messages/Messages'
import type { GraphMessage } from '../../initialState'
import { affineTransform } from '../../utils'
import { defaultColors } from '../../values.js'
import ToolTip from '../ToolTip/ToolTip'

type Props = {
  mini?: boolean,
  message: GraphMessage,
}
type State = {}

class ChartScatter extends React.Component<Props, State> {
  getZRange(data: Array<DataType>, key: string): [number, number] {
    let values = []
    for (let el of data) {
      values.push(parseFloat(el[key]))
    }
    return [Math.min(...values), Math.max(...values)]
  }

  render(): React.Node {
    const { mini, message } = this.props
    let { data, xaxis, yaxis, zaxis, options, colors, chartFields } = message

    const keys = chartFields || Object.keys(data[0])
    colors = colors ? colors : defaultColors

    const useColorForZ =
      (options && options.scatter && options.scatter.zaxis && options.scatter.zaxis.indicator) ===
      'color'
    const zrange = this.getZRange(data, zaxis)

    return (
      <React.Fragment>
        <ResponsiveContainer>
          <ScatterChart>
            {!this.props.mini && <CartesianGrid strokeDasharray="3 3" />}
            <XAxis
              dataKey={xaxis}
              type="number"
              allowDecimals={false}
              label={{ value: xaxis, offset: -10, position: 'insideBottom' }}
            />
            <YAxis
              dataKey={keys.indexOf(yaxis) > -1 && yaxis}
              type="number"
              allowDecimals={false}
              hide={mini}
              label={{ value: yaxis, angle: -90, position: 'insideLeft' }}
            />
            {zaxis && !useColorForZ && <ZAxis dataKey={zaxis} range={zrange} hide={mini} />}
            <Legend />
            <Tooltip content={<ToolTip />} />
            <Scatter data={data} fill={'rgba(0,0,0,0)'}>
              {data.map(
                (entry: DataType, index: number): React.Node => {
                  let fillcolor = colors[0]
                  if (useColorForZ)
                    fillcolor = `hsl(${120 -
                      affineTransform(zrange[0], zrange[1], 1, 120, entry[zaxis])}, 80%, 40%)`
                  return <Cell key={`cell-${index}`} fill={fillcolor} />
                }
              )}
            </Scatter>
          </ScatterChart>
        </ResponsiveContainer>
      </React.Fragment>
    )
  }
}

export default ChartScatter
