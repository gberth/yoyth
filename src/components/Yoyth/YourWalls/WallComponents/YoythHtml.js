// @flow
import React, { Component } from 'react'
import ReactHtmlParser from 'react-html-parser';
import { connect } from '@cerebral/react'
import { state, signal } from 'cerebral/tags'
import style from 'styled-components'
import brace from 'brace';
import AceEditor from 'react-ace'
import 'brace/mode/html';
import 'brace/theme/github';

const pretty = require('pretty')

/*
 * Presentational
 * ==================================== */     
const HtmlDiv = style.div`
  min-width: 0;
  margin: 20px;
`
const Article = style.div`
    min-width: 0;
    margin: 20px;
    > article {
      min-width: 0;
      font-family: montserrat;
      font-size: 18px;
      font-weight: 300;
      line-height: 25px;
      letter-spacing: 0.46px;
      > * {
        min-width: 0;
      }
      > h1 {
        font-size: 48px;
        font-weight: 300;
        letter-spacing: 0.46px;
        line-height: 65px;
      }      
      > figure {
        margin: 10px;
        > img {
          max-width: 80%;
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
const DropDownMenu = style.div`
  width: 200px;
  position: fixed;
  display: block;
  opacity: 1;
  z-index: 100;
  > a {
    background-color: #eee;
    color: black;
    display: block;
    padding: 12px;
    text-decoration: none;
  }
  > a:hover {
    background-color: #ccc;
  }
`
export default connect(
  {
    wallInFocus: state`yoyth.wallInFocus`,
    popup: state`yoyth.popup`,
    contextMenu: state`yoyth.contextMenu`,
    language: state`yoyth.language`,
    yourdocuments: state`yoyth.yourdocuments`,
    yourbricks: state`yoyth.yourbricks`,
    setState: signal`setState`,
    setContent: signal`setContent`,
    openModal: signal`openModal`
  },
  class YoythHtmlArticle extends Component {
    constructor (props) {
      super(props)
      this.state = {
        hidden: true,
        editMode: false
      }
      this.menuDisplayed = false
    }
    cntryIncluded (id, ctry) {
      if (!ctry) return id
      return id + ctry
    }
    toggleMenu () {
      this.setState({editMode: !this.state.editMode})
    }

    onChange (newValue) {
      this.setState({editorContent: newValue});
    }
    saveContent () {
      this.props.setContent({itemType: 'yourdocuments', id: this.cntryIncluded(this.state.brickId, this.props.language), content: {content: this.state.editorContent}});
    }

    setBrickData () {
      let stateChange = {
        brickId: this.props.brickId,
        brick: this.props.yourbricks[this.props.brickId],
        language: this.props.language
      }
      if (this.props.yourdocuments) {
        stateChange.document = this.props.yourdocuments[this.cntryIncluded(this.props.brickId, this.props.language)] 
        if (stateChange.document) {
          stateChange.content = stateChange.document.yItem.yContent.content
        }
      }
      stateChange.editorContent = stateChange.content
      this.setState(stateChange)
    }

    beautify () {
      this.setState({editorContent: pretty(this.state.editorContent, {wrap_line_length: 100})})
    }

    displayContextMenu () {
      const el = this.props.contextMenu
      this.menuDisplayed = true
      return (
        <DropDownMenu key='drdc' style={{ top: el.y + 'px', left: el.x + 'px' }}>
          <a style={{cursor: 'pointer'}} onClick={() => this.toggleMenu()}>{this.state.editMode ? 'View' : 'Edit'}</a>
          {this.state.editMode ? <a style={{cursor: 'pointer'}} onClick={() => this.beautify()}>Beautify </a> : null}
          {this.state.editMode ? <a style={{cursor: 'pointer'}} onClick={() => this.saveContent()}>Save</a> : null}
          <a style={{cursor: 'pointer'}} 
            onClick={() => this.props.openModal({modal: 'editJsonObject', yId: this.state.brickId, yType: 'yourbricks'})}>Brick Configuration</a>

        </DropDownMenu>
      )
    }
    resetContextMenu () {
      if (this.props.contextMenu && this.props.contextMenu.id === this.state.brickId) {
        this.props.setState({stateVar: 'yoyth.contextMenu', stateVal: {}})
        this.menuDisplayed = false
      }
    }

    editContent () {
      return (
        <AceEditor
          mode='html'
          theme='github'
          value={this.state.editorContent}
          onChange={this.onChange.bind(this)}
          name='HTML_BRICK_DIV'
          width='700px'
          wrapEnabled
          fontSize={16}
          showPrintMargin={false}
          editorProps={{$blockScrolling: true}}
        />
      )
    }

    render () {
      if (!this.state.brickId || this.state.brickId !== this.props.brickId ||
        this.props.language !== this.state.language) {
        this.setBrickData()
        return null
      }
      return (
        <Article>
          { !this.state.editMode ? ReactHtmlParser(this.state.editorContent) : this.editContent()}
          {this.props.contextMenu && this.props.contextMenu.id === this.state.brickId && !this.menuDisplayed ?
            this.displayContextMenu()
            : this.resetContextMenu()
          }
        </Article>
      )
    }
  }
)
