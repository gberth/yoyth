import React from 'react'
import NodeInfoModal from './modals/NodeInfoModal/NodeInfoModal'
import ConfirmDeleteNodeModal from './modals/ConfirmDeleteNodeModal'
import EditWallInfoModal from './modals/EditWallInfoModal'
import EditJsonObject from './modals/EditJsonObject'
import {connect} from '@cerebral/react'
import {state} from 'cerebral/tags'

const modals = {
  nodeInfoModal: NodeInfoModal,
  confirmDeleteNodeModal: ConfirmDeleteNodeModal,
  editWallInfoModal: EditWallInfoModal,
  editJsonObject: EditJsonObject
}

export default connect({
  allmodals: state`yoyth.modals`
},
class ModalsController extends React.Component {
  renderModal (modalObj, index) {
    const ModalComponent = modals[modalObj.modal]
    return <ModalComponent {...modalObj} key={'modal' + index} index={index} />
  }

  render () {
    return (
      <div>
        {this.props.allmodals.map((modal, index) => this.renderModal(modal, index))}
      </div>
    )
  }
}
)
