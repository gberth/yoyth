import React from 'react'
import YoythModal from '../../YoythModal.js'
import {connect} from '@cerebral/react'
import {state, signal} from 'cerebral/tags'
import createYourObject from '../../../../../shared/createYourObject.js'
import brickDetails from './../brickDetails.js'

import merge from 'deepmerge'
const inputOnChange = require('../../../shared/htmlHelpers.js').inputOnChange
const textInput = require('../../../shared/htmlHelpers.js').textInput
const List = require('../../../shared/YoythStyledComponents.js').YoythList
const Button = require('../../../shared/YoythStyledComponents.js').YoythButton

export default connect({
  modals: state`yoyth.modals`,
  yoyth: state`yoyth`,
  yourmaps: state`yoyth.yourmaps`, 
  yourmapnodes: state`yoyth.yourmapnodes`,
  yourwalls: state`yoyth.yourwalls`,
  identity: state`yoyth.identity`,
  closeModal: signal`closeModal`,
  saveWallInfoAndNode: signal`saveWallInfoAndNode`
},

class EditWallInfoModal extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      nodeId: this.props.nodeId,
      nodeType: this.props.nodeType,
      wallId: (this.props.wallId && this.props.yourwalls[this.props.wallId] ? this.props.wallId : null),
      wall: (this.props.wallId ? this.props.yourwalls[this.props.wallId] : null),
      wallAttr: {
        yName: (this.props.wallId && this.props.yourwalls[this.props.wallId] ? this.props.wallName : ''),
        yDescription: (this.props.wallId && this.props.yourwalls[this.props.wallId] ? this.props.wallDescription : ''),
        background: (this.props.wallId && this.props.yourwalls[this.props.wallId] ?
          this.props.yourwalls[this.props.wallId].yItem.yContent.background : '')
      },
      brickAttr: {
        col: 0,
        pos: 0
      },
      showModal: true,
      brickType: 'yoythHtml',
      brickColumns: null
    },
    this.brickdetails = brickDetails(this)
    this.saveobjects = {}
    this.handleOpenModal = this.handleOpenModal.bind(this)
    this.handleSave = this.handleSave.bind(this)
    this.handleCancel = this.handleCancel.bind(this)
    //this.getState = (br) => this.getStateX(br)
    //this.inputOnChange = (br, attr) => this.inputOnChangeX(br, attr)
    this.inputOnChange = inputOnChange(this)
    this.textInput = textInput(this)
  }

  handleOpenModal () {
    this.setState({ showModal: true })
  }

  handleCancel () {
    this.setState({ showModal: false })
  }

  handleSave () {
    this.setState({ showModal: false })
    let wall, brick, html
    if (!this.state.wallId) {
      wall = createYourObject({
        yType: 'yourwalls',
        yOwner: this.props.identity.yItem.yMetaData.yId,
        yContent: {
          rows:[{bricks:[]}]
        }
      })
    } else {
      wall = merge(this.props.yourwalls[this.state.wallId], {}, { clone: true })
    }
    wall.yItem.yMetaData.yName = this.state.wallAttr.yName
    wall.yItem.yMetaData.yDescription = this.state.wallAttr.yDescription
    if (this.state.wallAttr.background) {
      wall.yItem.yContent.background = this.state.wallAttr.background
    }     

    brick = createYourObject({
      yType: 'yourbricks',
      yName: this.state.brickAttr.name,
      yDescription: this.state.brickAttr.description,
      yOwner: this.props.identity.yItem.yMetaData.yId,
      yContent: { 
        brick: {
          component: this.brickdetails[this.state.brickType].component,
          cols: this.state.brickAttr.columns,
          ...this.brickdetails[this.state.brickType].obj()
        }
      }
    })

    if (this.state.brickType === 'yoythHtml') {
      html = createYourObject({
        yType: 'yourdocuments',
        iId: brick.yItem.yMetaData.yId,
        yName: this.state.brickAttr.name,
        yDescription: this.state.brickAttr.description,
        yOwner: this.props.identity.yItem.yMetaData.yId,
        yContent: {
          format: 'html',
          content: '<article></article>'
        }
      })
      html.yItem.yMetaData.yId = brick.yItem.yMetaData.yId  
    }
    let node
    this.state.nodeType === 'yourmapnodes' ?  
      node = merge(this.props.yourmapnodes[this.state.nodeId], {}, { clone: true }) : 
      node = merge(this.props.yourmaps[this.state.nodeId], {}, { clone: true })
    if (node.yItem.yMetaData.wallRef !== wall.yItem.yMetaData.yId) {
      node.yItem.yMetaData.wallRef = wall.yItem.yMetaData.yId
    } else {
      node = null
    }
    
    // put brick on walldef
    let rownum = parseInt(this.state.brickAttr.row)
    if (typeof rownum !== 'number' || isNaN(rownum)) {
      rownum = 1
    } 
    let newDef = {
      brickHeader: this.state.brickAttr.name,
      brickId: brick.yItem.yMetaData.yId
    } 

    let r = wall.yItem.yContent.rows
    let colarr
    if (rownum > r.length) {
      r.push({bricks: []})
      colarr = r[r.length - 1].bricks
    } else {
      colarr = r[rownum - 1].bricks
    }

    if (this.state.brickAttr.pos > colarr.length || this.state.brickAttr.pos === 0) {
      colarr.push(newDef)
    } else {
      colarr.splice(this.state.brickAttr.pos-1,0, newDef)
    }


    let savedata = {
      wall: wall,
      brick: brick
    }
    if (node) {
      savedata.node = node
    }
    if (html) {
      savedata.html = html
    }
    // create wall, create brick with defualt editor
    this.props.saveWallInfoAndNode(savedata)
  }

  setBrickTypeFromDom (name) {
    this.setState({brickType: document.getElementById('yoythinsertnewbrick').value})
  }

  brickOptions () {
    const brdetails = Object.keys(this.brickdetails)
    return brdetails.map((brkey) => {
      return (
        <option key={brkey} value={brkey}>{this.brickdetails[brkey].name}</option>
      )
    })
  }

  brickInfo () {
    return (
      <div>
        <div>
          <p>This wall has {this.state.wall ? this.state.wall.yItem.yContent.rows.length : 0} rows</p>
          <p>Insert new brick with Save and add Brick</p>
          <p />
          <List columns = "auto auto">
          {this.textInput('Brick name', 'brickAttr', 'name', '')}
          {this.textInput('Description', 'brickAttr', 'description', '')}
          {this.textInput('Add this brick in row', 'brickAttr', 'row', '', {type: 'number'})}
          {this.textInput('Add this brick before brick number', 'brickAttr', 'pos', '', {type: 'number'})}
          </List>
        </div>
        <p>Select brick type</p>
        <select onChange={this.setBrickTypeFromDom.bind(this)} id='yoythinsertnewbrick' defaultValue={this.state.brickType}>
          {this.brickOptions.bind(this)()} 
        </select>
        <p>Brick specific attributes</p>
        {this.state.brickType && this.brickdetails[this.state.brickType] ? this.brickdetails[this.state.brickType].element() : null}
        {this.textInput('Number of columns in wall (wall has 8 columns)', 'brickAttr', 'columns', '')}
        <br />
      </div>
    )
  }
  render () {
    return (
      <YoythModal
        isOpen={this.state.showModal}
        disableKeyMove
        initHeight='800'
        onRequestClose={this.handleCancel}>
        <h4 id='heading'>{'Edit wall parameters'}</h4>
        <List columns="auto auto">
          {this.textInput('Wall name', 'wallAttr', 'yName', '')}
          {this.textInput('Wall description', 'wallAttr', 'yDescription', '')}
          {this.textInput('Background', 'wallAttr', 'background', '')}
        </List>
        {this.brickInfo()}
        <Button onClick={this.handleCancel}>Cancel</Button>
        <Button onClick={this.handleSave}>Save</Button>
      </YoythModal>
    )
  }}
)
