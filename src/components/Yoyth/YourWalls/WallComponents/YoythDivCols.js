// @flow
import React, { Component } from 'react'
import { connect } from '@cerebral/react'
import { state, signal } from 'cerebral/tags'
import style from 'styled-components'


/*
 * Presentational
 * ==================================== */     
const DivCols = style.div`
    min-width: 0;
    grid-area: span 1 / span ${props => props.cols};
`;

export default connect(
  {
    wallInFocus: state`yoyth.wallInFocus`,
    yourbricks: state`yoyth.yourbricks`
  },
  class YoythDivCols extends Component {
    constructor (props) {
      super(props)
      this.state = {
        hidden: true,
      }
    }
    
    setBrickData () {
      this.setState({
        brickId: this.props.brickId,
        brick: this.props.yourbricks[this.props.brickId] ? this.props.yourbricks[this.props.brickId].yItem.yContent.brick : null
      })
    }

    render () {
      if (!this.state.brickId || this.state.brickId !== this.props.brickId) {
        this.setBrickData()
        return null
      }
      return (
        <DivCols cols={this.state.brick.cols ? this.state.brick.cols : 1}>
        </DivCols>
      )
    }
  }
)
