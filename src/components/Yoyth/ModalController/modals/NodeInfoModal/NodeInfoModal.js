import React from 'react'
import YoythModal from '../../YoythModal.js'
import {connect} from '@cerebral/react'
import {state, signal} from 'cerebral/tags'
import icons from './icons'
import style from 'styled-components'

const IconButton = style.button`
  /* Adapt the colours based on primary prop */
  background: ${props => props.primary ? 'palevioletred' : 'white'};
  color: ${props => props.primary ? 'white' : 'palevioletred'};
`

const IconList = style.div`
  overflow-y: scroll;
  width: 500px;
`

const Icon = style.div`
  width: 500px;
`

export default connect({
  modals: state`yoyth.modals`,
  yoyth: state`yoyth`,
  yourmapnodes: state`yoyth.yourmapnodes`,
  closeModal: signal`closeModal`,
  saveInfoAndCloseModal: signal`saveInfoAndCloseModal`
},

class EditWallInfoModal extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      yItem: this.props.modalPayload.yItem,
      mapdata: this.props.mapdata,
      name: this.props.modalPayload.yItem.yMetaData.yName,
      desc: this.props.modalPayload.yItem.yMetaData.yDescription,
      image: this.props.modalPayload.yItem.yMetaData.yImg,
      _id: this.props.modalPayload._id,
      showModal: true,
      showIcons: false
    }
    this.saveobjects = {}
    this.handleOpenModal = this.handleOpenModal.bind(this)
    this.handleCancel = this.handleCancel.bind(this)
    this.handleSave = this.handleSave.bind(this)
    this.showIcons = this.showIcons.bind(this)
    this.displayIcon = this.displayIcon.bind(this)
  }

  handleOpenModal () {
    this.setState({ showModal: true })
  }

  showIcons (show) {
    this.setState({ showIcons: show })
  }

  handleCancel () {
    this.setState({ showModal: false })
    this.props.closeModal({modalIndex: this.props.index})
  }

  handleSave () {
    this.setState({ showModal: false })
    this.props.saveInfoAndCloseModal({
      yItem: this.state.yItem,
      mapdata: this.state.mapdata,
      modalIndex: this.props.index,
      name: this.state.name,
      desc: this.state.desc,
      image: this.state.image,
      _id: this.state._id
    })
  }

  setName (event) {
    this.setState({ name: event.target.value })
  };

  setDescription (event) {
    this.setState({ desc: event.target.value })
  };
  setIcon (icon) {
    this.setState({ image: icon })
  };

  displayIcon(icon) {
    return (
      <Icon onClick={() => {this.setIcon(icon); this.showIcons(false)}}>
        <i className='material-icons'>{icon}</i>
        <span>
         {icon}
        </span>
      </Icon>
    )
  }


  render () {
    return (
      <div>
        <YoythModal
          isOpen={this.state.showModal}
          disableKeyMove
          onRequestClose={this.handleCancel}>
          <h4 id='heading'>{'Edit info for node'}</h4>
          <div id='input'>
            <input
              type='text'
              value={this.state.name}
              onChange={this.setName.bind(this)}
            />
            <br />
            <input
              type='text'
              value={this.state.desc}
              onChange={this.setDescription.bind(this)}
            />
            <br />
            <br />
            <IconButton onClick={() => this.showIcons(true)}>
              <span>
                <i className='material-icons'>{this.state.image}
                </i>
              </span>
            </IconButton>
            <span>
              {this.state.image}
            <br />
            </span>

          </div>
          {this.state.showIcons ? 
              <IconList>
                {icons.map((icon, i) => {return this.displayIcon(icon)})}
              </IconList>
              :
              null
            }        
        <button id='cancel-node-info' onClick={() => this.handleCancel()}>
          cancel
        </button>
        <button id='save-node-info' onClick={() => this.handleSave()}>
          save
        </button>
        </YoythModal>
      </div>
    )
  }}
)
