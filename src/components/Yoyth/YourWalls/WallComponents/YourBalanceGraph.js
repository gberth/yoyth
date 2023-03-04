import uuid from 'uuid'
import React, { Component } from 'react'
import style from 'styled-components'
import { Chart } from 'react-google-charts'
import { connect } from '@cerebral/react'
import { state, signal } from 'cerebral/tags'
import { sortbythen } from '../../../../shared/sortbythen.js'

const GraphDiv = style.div`
  margin-top: 25px;
  border: 2px solid black; 
  border-radius: 10px;
`

export default connect(
  {
    yourresponse: state`yoyth.yourresponse`,
    yourbricks: state`yoyth.yourbricks`,
    wallInFocus: state`yoyth.wallInFocus`,
    response: state`yoyth.response`,
    dbSearch: signal`dbSearch`,
    clearRequest: signal`clearRequest`
  },

  class YourBalanceGraph extends Component {
    constructor (props) {
      super()
      this.state = {
        dataFetched: false,
        graph: null
      }
    }

    getInitialData () {
      let reqId = uuid.v1()
      this.setState({
        requestId: reqId,
        wallRef: this.props.wallRef,
        graph: null
      })
      this.props.dbSearch({
        requestId: reqId,
        queryData: {
          collections: [this.props.wallRef],
          searchString: {
            'yItem.yContent.date': {
              '$gte': '2016-11-01',
              '$lte': '2018-06-01'
            }, 
            'yItem.yMetaData.ySubItemType': 'BAL'
          }
        }
      })
    }
    getGraph () {
      if (this.props.response && this.state.requestId && this.props.yourresponse && this.props.yourresponse[this.state.requestId]) {
        const msgs = this.props.yourresponse[this.state.requestId]
        const getDate = (date) => {
          return new Date(parseInt(date.substr(0, 4)), parseInt(date.substr(5, 2)) - 1, parseInt(date.substr(8, 2)))
        }
        let rows = msgs.map((msg) => {
          return {date: getDate(msg.yItem.yContent.date), balance: msg.yItem.yContent.balance}
        })
        const rowsordered = rows.sort(sortbythen('date', false, null)).map((row) => { return [row.date, row.balance] })

        const columns = [
          {type: 'date', label: 'Time of Day'},
          {type: 'number', label: 'Balance'}
        ]

        const options = {
          ...this.props.options
        }
        this.setState({
          dataFetched: true,
          graph:
          <Chart
            chartType='LineChart'
            rows={rowsordered}
            columns={columns}
            options={options}
            graph_id={this.props.id + 'g'}
            legend_toggle
            />
          }
        )
      }
    }

    render () {
      if ((this.props.wallInFocus && !this.state.dataFetched && !this.state.requestId) ||
        (this.state.wallRef && this.state.wallRef !== this.props.wallRef)) {
        this.getInitialData()
        return null
      }
      if (!this.state.graph) {
        this.getGraph()
        return null
      }
      if (!this.state.graph) {
        return null
      }
      return (
        <GraphDiv style={{height: 500}}>
          {
            (this.state.graph) ? this.state.graph : null
          }
        </GraphDiv>
      )
    }
  }
)
