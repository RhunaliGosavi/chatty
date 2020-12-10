// @flow
import * as React from 'react'
import './ToolTip.css'

type Payload = {
  payload: { fill: ?string, [key: string]: string },
  stroke: ?string,
  fill: ?string,
  name: string,
  value: string | number,
}

type Props = {
  active: boolean,
  payload: Array<Payload>,
}
type State = {}

class ToolTip extends React.Component<Props, State> {
  render(): React.Node {
    const { active, payload = [] } = this.props

    if (payload.length === 0) return <div />
    const point = payload[0].payload

    if (active)
      return (
        <div className="ToolTip">
          <div className="ToolTip-keys">
            {payload.map(
              (pl: Payload, i: number): React.Node => {
                return (
                  <div
                    key={i}
                    style={{
                      color: pl.stroke || pl.fill || pl.payload.fill || '#222',
                    }}>{`${pl.name} : ${pl.value}`}</div>
                )
              }
            )}
          </div>
          {'@extra/tooltip' in point && point['@extra/tooltip'] !== null && (
            <div className="ToolTip-meta">
              {point['@extra/tooltip']
                .toString()
                .split('\n')
                .map(
                  (s: string, i: number): React.Node => (
                    <div key={i}>{s}</div>
                  )
                )}
            </div>
          )}
        </div>
      )
    else return <div />
  }
}

export default ToolTip
