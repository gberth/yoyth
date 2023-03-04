// @flow
import React, { Component } from 'react'
import { connect } from '@cerebral/react'
import { state, signal } from 'cerebral/tags'
import fields from './input.js'
import 'react-datepicker/dist/react-datepicker-cssmodules.css'
import uuid from 'uuid'
import SpeechToText from '../../shared/speechToText.js'
const _ = require('underscore')
/*
 * Presentational
 * ==================================== */     

const List = require('../../shared/YoythStyledComponents.js').YoythList
const FormButton = require('../../shared/YoythStyledComponents.js').YoythButton
const FormButtons = require('../../shared/YoythStyledComponents.js').YoythButtons
const Content = require('../../shared/YoythStyledComponents.js').YoythBrickContent
const DropDownMenu = require('../../shared/YoythStyledComponents.js').YoythDropDown

const labelAndTooltip = (label, tooltip) => {
  if (!label && !tooltip) return null
  return (
    <span>
      {label ? <a>{label}</a> : null}
      {tooltip ? <a title={tooltip}>&#10068;</a> : null}
      <br />
    </span>
  )
}
const fieldCaption = (caption) => {
  if (!caption) return null

}

export default connect(
  {
    popup: state`yoyth.popup`,
    wallInFocus: state`yoyth.wallInFocus`,
    yourbricks: state`yoyth.yourbricks`,
    contextMenu: state`yoyth.contextMenu`,
    objectEdited: state`yoyth.objectEdited`,
    identity: state`yoyth.identity`,
    language: state`yoyth.language`,
    createYourObject: signal`createYourObject`,
    setState: signal`setState`,
    openModal: signal`openModal`
  },
  class YoythSpeech extends Component {
    constructor (props) {
      super(props)
      this.state = {
        error: '',
        interimText: '',
        finalisedText: '',
        interpretedText: '',
        listening: false,
        btnIx: 0
      }      
      this.f = fields(this)
      this.btnfunc = {
        save: () => this.saveElement(),
        next: () => this.nextElement(),
        previous: () => this.previousElement(),
        clear: () => this.clearElement(),
        delete: () => this.deleteElement(),
        submit: () => this.saveElement(),
        search: () => this.searchElement(),
        startStopListening: () => this.startStopListening(),
        update: () => this.updateElement(),
        startOrStopButton: (btn) => this.startOrStopButton(btn)
      }
      this.menuDisplayed = false
    }

    componentDidMount() {
      const onAnythingSaid = text => {
        console.log('heard text', text);
        this.setState({ interimText: text});
      };
  
      const onFinalised = text => {
        console.log('finalised text', text);
        this.setState({ finalisedText: this.state.finalisedText.concat(' ' + text) });
      };
  
      const onFinishedListening = () => {
        console.log('finished listening..');
        this.setState({ listening: false });
      };
  
      try {
        this.listener = new SpeechToText(
          onAnythingSaid,
          onFinalised,
          onFinishedListening,
          !this.props.language ? 'no' : 'en' 
        );
      } catch (error) {
        this.setState({ error: error.message });
      }
    }
  
    startOrStopButton(button) {
      if (!this.state.listening) {
        console.log(button.name)
      } else { 
        console.log(button.altname)
      }
      if (!this.state.listening) {
        return button.name
      } else { 
        return button.altname
      }
    }

    startStopListening () {
      console.log('start/stop listening')
      if (this.state.listening) {
        this.listener.stopListening()
        this.setState({ listening: false })
      } else {
        this.listener.startListening()
        this.setState({ listening: true })
      }
    };
  
    saveElement () {
      let yContent = {}
      let yMetaData = {yType: this.state.brick.collection}
      if (!this.state.yItem) {
        yMetaData.yOwner = this.props.yourbricks[this.props.brickId] ? this.props.yourbricks[this.props.brickId].yItem.yMetaData.yOwner : null
      }
      if (this.state.brick.contentFields) {
        yContent = Object.assign(yContent, JSON.parse(this.state.brick.contentFields))
      } 
      if (this.state.brick.metaFields) {
        yMetaData = Object.assign(yMetaData, JSON.parse(this.state.brick.metaFields))
      } 

      this.state.brick.fields.forEach((field) => {
        const id = 'yAttr'+field.attribute
        if (field.attribute && this.state[id]) {
          console.log(this.state[id])
          yContent[field.attribute] = this.state[id]
        }
      })
      if (!this.state.yItem) {
          this.props.createYourObject({yMetaData: yMetaData, yContent: yContent})
      } else {

      }
    }

    nextElement () {

    }
    previousElement () {

    }
    clearElement () {

    }
    deleteElement () {

    }
    searchElement () {

    }
    updateElement () {

    }

    setBrickData () {
      let brickId = this.props.brickId
      let brickItem = this.props.yourbricks[brickId]
      this.setState({
        brickId: brickId,
        brick: brickItem ? brickItem.yItem.yContent.brick : null,
        version: this.props.objectEdited ? this.props.objectEdited.version : 0
      })
    }

    displayContextMenu () {
      const el = this.props.contextMenu
      this.menuDisplayed = true
      return (
        <DropDownMenu key='drdc' style={{ top: el.y + 'px', left: el.x + 'px' }}>
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
    renderButton (button) {
      return (
        <FormButton key={button.altname ? this.btnfunc[button.decide](button) : button.name} 
        onClick={this.btnfunc[button.function] || null}>{button.altname ? this.btnfunc[button.decide](button) : button.name}</FormButton>
      )
    }
    createButtons (buttons) {
      return (
        <FormButtons key='formbuttons'>
          {_.map(buttons, this.renderButton, this)}
        </FormButtons>
      )
    }

    render () {
      if (!this.state.brickId ||  
        (this.state.brickId !== this.props.brickId &&
        this.props.objectEdited && this.props.objectEdited.objectId &&
        (this.props.objectEdited.objectId === this.state.brickId && this.props.objectEdited.version !== this.state.version))) {
        this.setBrickData()
        return null
      }
      console.dir(this.state)
      return (
        <Content style={this.state.brick && this.state.brick.style ? JSON.parse(this.state.brick.style) : null}>
          <textarea id='interim' rows='10' cols='150' readOnly value={this.state.interimText}>
          </textarea>
          <textarea id='final' rows='10' cols='150' value={this.state.finalisedText}>
          </textarea>
          <textarea id='interpreted' rows='10' cols='150' value={this.state.interpreted}>    
          </textarea>
          {this.state.brick.buttons ? this.createButtons(this.state.brick.buttons) : null}
          {this.props.contextMenu && this.props.contextMenu.id === this.state.brickId && !this.menuDisplayed ?
            this.displayContextMenu()
            : this.resetContextMenu()
          }
        </Content>
      )
    }
  }

)
