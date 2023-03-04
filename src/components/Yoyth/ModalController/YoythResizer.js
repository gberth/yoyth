import React, { Component } from "react"
import style from 'styled-components'

const FlexibleModalResizer = style.div`
  position:absolute;
  right:0;
  bottom:0;
  cursor:se-resize;
  margin:5px;
  border-bottom: solid 2px #333;
  border-right: solid 2px #333;
`

class YoythResizer extends Component {
  constructor(props) {
    super(props)
  }
  onMouseDown(e) {
    this.props.updateStateResizing(true);
  }
  render() {
    const style = {
      width: 16,
      height: 16
    };
    return (
      <FlexibleModalResizer
        style={style}
        onMouseDown={this.onMouseDown.bind(this)}
      />
    )
  }
}

export default YoythResizer