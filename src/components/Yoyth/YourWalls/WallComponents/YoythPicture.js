// @flow
import React, { Component } from 'react'
import { connect } from '@cerebral/react'
import { state, signal } from 'cerebral/tags'
import style from 'styled-components'
const DropDownMenu = require('../../shared/YoythStyledComponents.js').YoythDropDown
const FigCaption = require('../../shared/YoythStyledComponents.js').YoythFigCaption


/*
 * Presentational
 * ==================================== */     
const Picture = style.div`
  display: block;
  margin-left: auto;
  margin-right: auto;
  width: ${props => props.brickwidth || '80%'};
    > img {
      max-width: 100%;
    }
`;

export default connect(
  {
    popup: state`yoyth.popup`,
    wallInFocus: state`yoyth.wallInFocus`,
    yourbricks: state`yoyth.yourbricks`,
    contextMenu: state`yoyth.contextMenu`,
    objectEdited: state`yoyth.objectEdited`,
    language: state`yoyth.language`,
    openModal: signal`openModal`,
    setState: signal`setState`
  },
  class YoythPicture extends Component {
    constructor (props) {
      super(props)
      this.state = {
        hidden: true
      }
      this.menuDisplayed = false
    }
    cntryIncluded (id, ctry) {
      if (!ctry) return id
      return id + ctry
    }
    creditTxt (cr) {
      if (!cr.byname && !cr.onname) {
        return null
      }
      return (
        <FigCaption>
          {cr.byprefix}
          <a href={cr.byref} target='_blank'>{cr.byname}</a>
          {cr.onprefix}
          <a href={cr.onref} target='_blank'>{cr.onname}</a>
        </FigCaption>
      )
    }

    setBrickData () {
      let brickId = this.props.brickId
      let address = null
      let alt = null
      let credtxt = null

      let br = this.props.yourbricks[brickId] ? this.props.yourbricks[brickId].yItem.yContent.brick : null
      if (br) {
        address = !this.props.language ? br.address : (br['address' + this.props.language] || br.address)
        alt = br.alt
        credtxt = this.creditTxt({
          byprefix: br.byprefix,
          byname: br.byname,
          byref: br.byref,
          onprefix: br.onprefix,
          onname: br.onname,
          onref: br.onref})
      }

      this.setState({
        brickId: brickId,
        brick: br,
        address: address,
        alt: alt,
        credtxt: credtxt,
        version: this.props.objectEdited ? this.props.objectEdited.version : 0,
        language: this.props.language
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
    render () {
      if (!this.state.brickId || this.props.language !== this.state.language ||
        (this.state.brickId !== this.props.brickId &&
          this.state.brickId !== this.cntryIncluded(this.props.brickId, this.props.language)) ||
        (this.props.objectEdited && this.props.objectEdited.objectId &&
        (this.props.objectEdited.objectId === this.state.brickId && this.props.objectEdited.version !== this.state.version))) {
        this.setBrickData()
        return null
      }
      return (
        <Picture brickwidth={this.state.brick.brickwidth} style={this.state.brick && this.state.brick.style ? JSON.parse(this.state.brick.style) : null}>
          <img src={this.state.address} width={this.state.brick.picWidth} height={this.state.brick.picHeight}
            alt={this.state.alt} />
          {this.state.credtxt}
          {this.props.contextMenu && this.props.contextMenu.id === this.state.brickId && !this.menuDisplayed ?
            this.displayContextMenu()
            : this.resetContextMenu()}
        </Picture>
      )
    }
  }
)
