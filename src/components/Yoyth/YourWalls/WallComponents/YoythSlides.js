// @flow
import React, { Component } from 'react'
import { connect } from '@cerebral/react'
import { state, signal } from 'cerebral/tags'
import style from 'styled-components'
import posed from 'react-pose'
import { tween } from 'popmotion'
const _ = require('underscore')
/*
 * Presentational - list pictures small or given size
 * ==================================== */
const DropDownMenu = require('../../shared/YoythStyledComponents.js').YoythDropDown
const FigCaption = require('../../shared/YoythStyledComponents.js').YoythFigCaption
const PictureList = require('../../shared/YoythStyledComponents.js').YoythPictureList

const RollingBox = posed.div({
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: props => tween({ ...props, duration: 1000 }) }
})

const Picture = style(RollingBox)`
    min-width: 0;
    > img {
      max-width: 100%;
    }
`

export default connect(
  {
    popup: state`yoyth.popup`,
    wallInFocus: state`yoyth.wallInFocus`,
    yourbricks: state`yoyth.yourbricks`,
    contextMenu: state`yoyth.contextMenu`,
    objectEdited: state`yoyth.objectEdited`,
    openModal: signal`openModal`,
    setState: signal`setState`
  },
  class YoythSlides extends Component {
    constructor (props) {
      super(props)
      this.state = {
        visible: true,
        pictureIx: 0,
        pictures: []
      }
      this.menuDisplayed = false
      this.mountedOk = false
    }

    _shuffle () {
      if (this.state.visible) {
        this.setState({ visible: false })
      } else {
        let ix = this.state.pictureIx < (this.state.pictures.length - 1) ? (this.state.pictureIx + 1) : 0
        this.setState({ pictureIx: ix, visible: true })
      }
    }

    componentDidMount () {
      this.mountedOk = true
      this.interval = setInterval(this._shuffle.bind(this), 1000);
    }
    componentWillUnmount () {
      this.mountedOk = false
      clearInterval(this.interval);
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
      let br = this.props.yourbricks[brickId] ? this.props.yourbricks[brickId].yItem.yContent.brick : null
      let time = br && br.imageTime ? br.imageTime : 4000
      this.setState({
        brickId: brickId,
        brick: br,
        pictures: br.pictures,
        height: br.height,
        width: br.width,
        pictureIx: 0,
        pictureTime: time,
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
    renderPicture (picture) {
      return (
        <Picture pose={this.state.visible ? 'visible' : 'hidden'} key={'slides'}>
          <a target='blank' href={picture.ref}>
            <img src={picture.address} title={picture.title} height={picture.height || this.state.height} width={picture.width || this.state.width}
              alt={picture.alt} />
            {this.creditTxt(picture)}
          </a>
        </Picture>
      )
    }
    render () {
      if (!this.state.brickId || this.state.brickId !== this.props.brickId ||
        (this.props.objectEdited && this.props.objectEdited.objectId &&
        (this.props.objectEdited.objectId === this.state.brickId && this.props.objectEdited.version !== this.state.version))) {
        this.setBrickData()
        return null
      }
      return (
        <PictureList {...this.state.brick.listoptions}>
          {this.renderPicture.bind(this)(this.state.brick.pictures[this.state.pictureIx])}
          {this.props.contextMenu && this.props.contextMenu.id === this.state.brickId && !this.menuDisplayed ?
            this.displayContextMenu()
            : this.resetContextMenu()}
        </PictureList>
      )
    }
  }
)
