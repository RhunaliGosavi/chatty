// @flow
import 'react-table/react-table.css'

import './Table.css'

import * as React from 'react'
import ReactTable from 'react-table'

import type { DataType } from '../Messages/Messages'
import { filterData, getStylesObject } from '../../utils'

type Dict = { [key: string]: string | number }

type Props = {
  data: Array<DataType>,
  mini: boolean,
  columns: ?Array<string>,
  options: { formatting: Dict },
}
type State = {}

class Table extends React.PureComponent<Props, State> {
  getColums(
    data: Array<DataType>,
    cols: Array<string>,
    options: Dict
  ): Array<{ Header: string, accessor: string }> {
    let columns = []
    if (cols) {
      cols.forEach(
        (c: string): mixed => {
          options = options || {}
          const form = options.formatting || {}
          const formatting = form[c] || {}
          columns.push({
            Header: (): React.Node => {
              return <div style={getStylesObject(formatting.header)}>{c}</div>
            },
            Cell: (v: { value: string }): React.Node => {
              return <div style={getStylesObject(formatting.cell)}>{v.value}</div>
            },
            accessor: c,
          })
        }
      )
    } else {
      if (data.length === 0) return []
      for (let key in data[0]) {
        options = options || {}
        const form = options.formatting || {}
        const formatting = form[key] || {}
        // const formatting = options.formatting[key] || {}
        columns.push({
          Header: (): React.Node => {
            return <div style={getStylesObject(formatting.header)}>{key}</div>
          },
          Cell: (v: { value: string }): React.Node => {
            return <div style={getStylesObject(formatting.cell)}>{v.value}</div>
          },
          accessor: key,
        })
      }
    }
    return columns
  }

  render(): React.Node {
    let { data, columns, mini, options } = this.props
    const filteredData = filterData(data)
    columns = this.getColums(filteredData, columns, options)

    return (
      <React.Fragment>
        {!mini ? (
          <ReactTable
            data={data}
            filterable={true}
            columns={columns}
            className="-striped -highlight"
          />
        ) : (
          <ReactTable
            data={data}
            columns={columns}
            className="-striped -highlight chart-table"
            showPagination={true}
            resizable={false}
            minRows={0}
            PaginationComponent={(): React.Node => (
              <React.Fragment>
                {data.length > 10 && (
                  <div className="RTable-custom-pagination" style={{width:'90%'}}>
                    <i className="fas fa-info" />
                    Click to view full data
                  </div>
                )}
              </React.Fragment>
            )}
          />
        )}
      </React.Fragment>
    )
  }
}

export default Table
