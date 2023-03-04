import React from 'react'
import YoythModal from '../../YoythModal.js'
import {connect} from '@cerebral/react'
import {state, signal} from 'cerebral/tags'

export default connect({
  modals: state`yoyth.modals`,
  yoyth: state`yoyth`,
  yourmapnodes: state`yoyth.yourmapnodes`,
  closeModal: signal`closeModal`,
  deleteNode: signal`deleteNode`
},

class ConfirmDeleteNodeModal extends React.Component {
  constructor (props) {
    super(props)
    const nodeItem = this.props.yourmapnodes[this.props.modalPayload.nodeId]
    this.state = {
      item: nodeItem,
      name: nodeItem.yItem.yMetaData.yName,
      desc: nodeItem.yItem.yMetaData.yDescription,
      showModal: true
    }
    this.handleOpenModal = this.handleOpenModal.bind(this)
    this.handleConfirm = this.handleConfirm.bind(this)
    this.handleCancel = this.handleCancel.bind(this)
  }

  handleOpenModal () {
    this.setState({ showModal: true })
  }

  handleCancel () {
    this.setState({ showModal: false })
  }

  handleConfirm (deleteObj) {
    this.setState({ showModal: false })
    this.props.deleteNode(deleteObj)
  }

  render () {
    return (
      <YoythModal
        isOpen={this.state.showModal}
        disableKeyMove={true}
        onRequestClose={this.handleCancel}>
        <h4 id="heading">{'Confirm delete of ""' + this.state.name + '"" and sub-nodes'}</h4>
        <div id="full_description">
          <p>{this.state.desc}</p>
        </div>
        >
          <button onClick={this.handleCancel}>Cancel</button>
          <button onClick={() => this.handleConfirm({
            delete: {...this.props.modalPayload}
          })}>Confirm</button>
      </YoythModal>
    );
  }}
)
