// @flow
import './Chart.css'

import React, { type Node, Component } from 'react'

import type { GraphMessage, TableMessage } from '../../initialState'
import ChartBar from '../ChartBar/ChartBar'
import ChartLine from '../ChartLine/ChartLine'
import ChartPie from '../ChartPie/ChartPie'
import ChartScatter from '../ChartScatter/ChartScatter'
import Table from '../Table/Table'

type Props = {
  type: string,
  data: GraphMessage | TableMessage,
  mini?: boolean,
}
type State = {}

class Chart extends Component<Props, State> {
  constructor(props: Props) {
    super(props)

    let self: any = this // eslint-disable-line
    self.getChart = self.getChart.bind(this)
  }

  getChart(): Node {
    let { mini, data: message, type } = this.props
    let { data, chartData, columns } = message

    let chartMesage = { ...message }

    if (chartData && chartData.length > 0) {
      chartMesage.data = chartData
    }

    const tableOptions = chartMesage.options ? chartMesage.options.table : undefined
    // const tableOptions = chartMesage?.options?.table

    // xaxis = xaxis ? xaxis : Object.keys(data[0])[0]
    // const keys = Object.keys(data[0])
    // [ dataConverted, keys ] = cleanData(data, keys)
    // [ dataWithComma, keys ] = commedData(data, keys)

    if (mini === undefined) mini = false
    let chart = 'No chart available'
    switch (type) {
      case 'line':
        chart = <ChartLine message={chartMesage} /> /** mini={mini} */
        break
      case 'bar':
        chart = <ChartBar message={chartMesage}/>
        break
      case 'pie':
        chart = <ChartPie message={chartMesage}/>
        break
      case 'scatter':
        chart = <ChartScatter message={chartMesage}/>
        break
      case 'table':
        chart = <Table data={data} mini={mini} columns={columns} options={tableOptions} />
        break
    }
    return chart
  }

  render(): Node {
    return <div className={this.props.mini ? 'Chart mini' : 'Chart'}>{this.getChart()}</div>
  }
}
export default Chart
