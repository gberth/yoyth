// @flow
import React, { Component } from 'react'
import { connect } from '@cerebral/react'
import { state, signal } from 'cerebral/tags'
import 'react-datepicker/dist/react-datepicker-cssmodules.css'
import uuid from 'uuid'
const _ = require('underscore')
/*
 * Presentational
 * ==================================== */
const List = require('../../shared/YoythStyledComponents.js').YoythList
const Field = require('../../shared/YoythStyledComponents.js').YoythField
const Content = require('../../shared/YoythStyledComponents.js').YoythBrickContent
const DropDownMenu = require('../../shared/YoythStyledComponents.js').YoythDropDown

/*
 * Content
 * ==================================== */

export default connect(
  {
    popup: state`yoyth.popup`,
    yourresponse: state`yoyth.yourresponse`,
    response: state`yoyth.response`,
    wallInFocus: state`yoyth.wallInFocus`,
    yourbricks: state`yoyth.yourbricks`,
    contextMenu: state`yoyth.contextMenu`,
    objectEdited: state`yoyth.objectEdited`,
    identity: state`yoyth.identity`,
    language: state`yoyth.language`,
    createYourObject: signal`createYourObject`,
    setState: signal`setState`,
    dbSearch: signal`dbSearch`,
    openModal: signal`openModal`
  },
  class YoythList extends Component {
    constructor (props) {
      super(props)
      this.state = {
        dataFetched: false,
        data: null,
        yAttr: {},
        version: 0
      }
      this.menuDisplayed = false
    }
    
    cntryIncluded (id, ctry) {
      if (!ctry) return id
      return id + ctry
    }

    renderField (field, ix) {
      if (!field.attribute) {
        return null
      }
      let value = this.currentContent[field.attribute]
      if (this.props.language && this.currentContent[field.attribute + this.props.language]) {
        value = this.currentContent[field.attribute + this.props.language]
      }
      return (
        <Field key={field.attribute} {...field.fieldprops}>{value}</Field>
      )
    }
    renderRow (element, ix) {
      this.currentContent = element.yItem.yContent
      return (
        _.map(this.state.brick.fields, this.renderField, this)
      )
    }

    renderList () {
      return (
        <List {...this.state.brick.listprops}>
          {_.map(this.state.data, this.renderRow, this)}
        </List>
      )
    }

    getData () {
      let reqId = uuid.v1()
      this.setState({
        requestId: reqId,
        collection: this.state.brick.collection,
        data: null
      })
      let searchString = { 
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
        version: this.props.objectEdited ? this.props.objectEdited.version : 0,
        dataFetched: false
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

    setData () {
      if (this.props.response && this.state.requestId && 
        this.props.yourresponse && this.props.yourresponse[this.state.requestId]) {
        this.setState({
          dataFetched: true,
          data: this.props.yourresponse[this.state.requestId]
          }
        )
      }
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
      if (!this.state.dataFetched && !this.state.requestId && this.state.brick.collection && !this.state.data) {
        this.getData()
        return null
      }
      if (!this.state.data) {
        this.setData()
        return null
      }

      return (
        <Content key='listcontent' style={this.state.brick && this.state.brick.style ? JSON.parse(this.state.brick.style) : null}>
          {this.renderList()}
          {this.props.contextMenu && this.props.contextMenu.id === this.state.brickId && !this.menuDisplayed ?
            this.displayContextMenu()
            : this.resetContextMenu()
          }
        </Content>
      )
    }
  }

)
