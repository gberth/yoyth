// @flow
import React, { Component } from 'react'
import ReactHtmlParser, { processNodes, convertNodeToElement, htmlparser2 } from 'react-html-parser';
import { connect } from '@cerebral/react'
import { state, signal } from 'cerebral/tags'
import style from 'styled-components'

/*
 * Presentational
 * ==================================== */     
const Article = style.div`
    min-width: 0;
    > article {
      margin-left: 10px;
      min-width: 0;
      font-family: montserrat;
      font-size: 20px;
      > * {
        grid-column: 2;
        min-width: 0;
      }
      > h1 {
        color: green;
      }      
      > figure {
        margin: 20px;
        > img {
          max-width: 100%;
        }
      }
      > code {
        background: #eee;
        padding: 2px 5px;
      }
      > pre {
        background: #eee;
        padding: 10px 15px;
        overflow: auto;
        > code {
          padding: 0;
        }
      }
    }
`
const Brick = style.div`    
    grid-column: 1 / -1;
    max-width: 100%;
`
export default connect(
  {
    wallInFocus: state`yoyth.wallInFocus`,
    yourdocuments: state`yoyth.yourdocuments`,
    yourbricks: state`yoyth.yourbricks`
  },
  class YoythHtmlArticle extends Component {
    constructor (props) {
      super(props)
      this.state = {
        hidden: true,
      }
    }
    
    setBrickData () {
      let stateChange = {
        brickId: this.props.brickId,
        brick: this.props.yourbricks[this.props.brickId]
      }
      if (this.props.yourdocuments) {
        stateChange.document = this.props.yourdocuments[this.props.brickId]
        if (stateChange.document) {
          stateChange.content = stateChange.document.yItem.yContent.content
        }
      }
      stateChange.editorContent = stateChange.content
      this.setState(stateChange)
    }

    render () {
      if (!this.state.brickId || this.state.brickId !== this.props.brickId) {
        this.setBrickData()
        return null
      }
      return (
        <Brick>
          <Article>
            { ReactHtmlParser(this.state.editorContent) }
          </Article>
        </Brick>
      )
    }
  }
)
