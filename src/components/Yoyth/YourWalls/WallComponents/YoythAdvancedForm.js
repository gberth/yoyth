// @flow
import React, { Component } from 'react'
import { connect } from '@cerebral/react'
import { state, signal } from 'cerebral/tags'
import fields from './input.js'
import 'react-datepicker/dist/react-datepicker-cssmodules.css'
import uuid from 'uuid'
import { isMoment } from 'moment';
const _ = require('underscore')
/*
 * Presentational
 * ==================================== */     

const FormButton = require('../../shared/YoythStyledComponents.js').YoythButton
const FormButtons = require('../../shared/YoythStyledComponents.js').YoythButtons
const Content = require('../../shared/YoythStyledComponents.js').YoythBrickContent
const DropDownMenu = require('../../shared/YoythStyledComponents.js').YoythDropDown
const Select = require('../../shared/YoythStyledComponents.js').YoythSelect

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
    signalElement: signal`signalElement`,
    openModal: signal`openModal`
  },
  class YoythAdvancedForm extends Component {
    constructor (props) {
      super(props)
      this.state = {
        dataFetched: false,
        data: null,
        yAttr: {},
        version: 0
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
        update: () => this.updateElement(),
        signal: () => this.signalElement(),
        renderSelection: () => this.render
      }
      this.renderSelection = (el, ix, arr) => this.renderSelections(el, ix, arr)
      this.getElementContent = (el, content) => this.getElementContents(el, content)      
      this.menuDisplayed = false
    }

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

      yContent = this.getContent()

      if (!this.state.yItem) {
          this.props.createYourObject({yMetaData: yMetaData, yContent: yContent})
      } else {

      }
    }

    nextElement () {

    }
    signalElement () {
      this.props.signalElement({signal: this.getContent()})
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

    setValueFromDom (name) {
      return () => {
        let newv = {}
        newv[name] = document.getElementById(name).value
        console.log('new value')
        console.dir(newv)
        this.setState(newv)
      }
    }

    getElementName(el) {
      return 'yAttr'+el.attribute
    }

    getElementValue(el) {
      return this.state[this.getElementName(el)]
    }
    cntryIncluded (id, ctry) {
      if (!ctry) return id
      return id + ctry
    }

    renderField (element, ix) {
      if (!element) return null
      if (typeof element.style === 'string') {
        element.style = JSON.parse(element.style)
      }
      const value = this.getElementValue(element)
      return (
        <span key={'f' + ix}>
          {labelAndTooltip(element.label, element.tooltip)}
          {this.f[element.tag](element, value)}
          {fieldCaption(element.fieldcaption)}
          {element.br ? <br /> : null}
        </span>
      )      
    }

    renderTag (element, ix) {
      if (typeof element.style === 'string') {
        element.style = JSON.parse(element.style)
      }
      return (
        <span key={'t' + ix}>
          {this.f[element.tag](element)}
          {element.br ? <br /> : null}
        </span>
      )      
    }
    selectOptions (options) {
      return options.map((option) => {
        return (
          <option key={option} value={option}>{option}</option>
        )
      })
    }
    getElementContents (element, content) {
      let val = this.getElementValue(element)
      if (!val && element.selections) {
        val = element.selections[0]
      }

      if (isMoment(val)) {
        console.log('jada moment')
        val = val.format('YYYY-MM-DD')
      }
      content[element.attribute] = val
      if (element.fields) {
        console.log('jada fields')
        console.dir(element)
        element.fields.forEach((field) => {
          this.getElementContent(this.state.brick.form.fields[field], content)
        })
      }

      if (element.selections && element.selections.includes(val) && this.state.brick.form.selections[val]) {
        this.getElementContent(this.state.brick.form.selections[val], content)
      }
    }

    getContent () {
      let content = {}
      this.state.brick.form.sequence.forEach((element) => {
        if (element.field) {
          this.getElementContent(this.state.brick.form.fields[element.field], content)
        } else 
        if (element.selection) {
          this.getElementContent(this.state.brick.form.selections[element.selection], content)
        }
      })
      console.dir(content)
      return content
    }

    renderSelections (element, ix, arr) {
      if (!element) return null
      let val = this.getElementValue(element) || element.selections[0]
      if (!element.selections.includes(val)) {
        val = element.selections[0]
      }
      const x = (
        <div key={this.getElementName(element)}> 
          <Select onChange={this.setValueFromDom(this.getElementName(element))} id={this.getElementName(element)} defaultValue={val}>
            {this.selectOptions(element.selections)} 
          </Select>
          <p />
        </div>
      )
      arr.push(x)
      // render tags and fields 
      if (element.tags) {
        let ixx = 0
        element.tags.forEach((tag) => {
          ixx++
          arr.push(this.renderTag(this.state.brick.form.fields[tag], ixx))
        })
      }      
      if (element.fields) {
        let ixx = 0
        element.fields.forEach((field) => {
          ixx++
          arr.push(this.renderField(this.state.brick.form.fields[field], ixx))
        })
      }
      if (this.state.brick.form.selections[val]) {
        return this.renderSelection(this.state.brick.form.selections[val], ix, arr)
      }
      return arr
    }

    renderElement (element, ix) {
      // tag / selection / field (this.brick.form.selections / this.brick.form.fields )
      console.dir(element)
      console.dir(this.state.brick.form.selections)
      let res
      if (element.tag) {
        return this.renderTag(element, ix)
      } else
      if (element.field) {
        return this.renderField(this.state.brick.form.fields[element.field], ix)
      } else
      if (element.selection) {
        let ret =  this.renderSelection(this.state.brick.form.selections[element.selection], ix, [])
        console.dir(ret)
        return ret
      }
      if (res === null) {
        //msg
      }
    }

    getData (fromDate, toDate) {
      let reqId = uuid.v1()
      this.setState({
        requestId: reqId,
        collection: this.props.wallRef,
        data: null
      })
      let searchString = { 
        'yItem.yContent.date': {
          '$gte': fromDate,
          '$lte': toDate
        }
      }
      if (this.state.brick.subtype) {
        searchString['yItem.yContent.subtype'] = this.state.brick.subtype
      }
      this.props.dbSearch({
        requestId: reqId,
        queryData: {
          collections: [this.state.brick.collection],
          searchString: searchString
        }
      })
    }

    setBrickData () {
      let brickId = this.cntryIncluded(this.props.brickId, this.props.language)
      let brickItem = this.props.yourbricks[brickId]
      if (!brickItem && this.props.language) {
        brickId = this.props.brickId
        brickItem = this.props.yourbricks[this.props.brickId]
      }
      this.setState({
        brickId: brickId,
        brick: brickItem ? brickItem.yItem.yContent.brick : null,
        language: this.props.language,
        version: this.props.objectEdited ? this.props.objectEdited.version : 0
      })
    }

    handleSubmitForm () {
      let yContent = {}
      let yMetaData = {yType: this.state.brick.collection}
      yMetaData.yOwner = this.props.yourbricks[this.props.brickId] ? this.props.yourbricks[this.props.brickId].yItem.yMetaData.yOwner : null
      if (this.state.brick.contentFields) {
        yContent = Object.assign(yContent, JSON.parse(this.state.brick.contentFields))
      } 
      if (this.state.brick.metaFields) {
        yMetaData = Object.assign(yMetaData, JSON.parse(this.state.brick.metaFields))
      } 

      this.state.brick.fields.forEach((field) => {
        const id = 'yAttr'+field.attribute
        if (field.attribute && this.state[id]) {
          yContent[field.attribute] = this.state[id]
        }
      })
      this.props.createYourObject({yMetaData: yMetaData, yContent: yContent})

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
        <FormButton key={button.name} onClick={this.btnfunc[button.function] || null}>{button.name}</FormButton>
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
      if (!this.state.brickId || this.props.language !== this.state.language ||
        (this.state.brickId !== this.props.brickId &&
          this.state.brickId !== this.cntryIncluded(this.props.brickId, this.props.language)) ||
        (this.props.objectEdited && this.props.objectEdited.objectId &&
        (this.props.objectEdited.objectId === this.state.brickId && this.props.objectEdited.version !== this.state.version))) {
        this.setBrickData()
        return null
      }
      console.dir(this.state.brick)
      return (
        <Content style={this.state.brick && this.state.brick.style ? JSON.parse(this.state.brick.style) : null}>
          {_.map(this.state.brick.form.sequence, this.renderElement, this)}
          {this.state.brick.button ? <FormButton onClick={this.handleSubmitForm.bind(this)}>{this.state.brick.button}</FormButton> : null}
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
