import React from 'react'
import YoythModal from '../../YoythModal.js'
import {connect} from '@cerebral/react'
import {state, signal} from 'cerebral/tags'
import style from 'styled-components'
import AceEditor from 'react-ace';

import 'brace/mode/json';
import 'brace/theme/github';

export default connect({
  modals: state`yoyth.modals`,
  yoyth: state`yoyth`,
  yourbricks: state`yoyth.yourbricks`,
  yourwalls: state`yoyth.yourwalls`,
  closeModal: signal`closeModal`,
  applyContent: signal`applyContent`,
  setContent: signal`setContent`,
  setState: signal`setState`
},

class EditJsonObject extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      yId: this.props.yId,
      yType: this.props.yType,
      restoreData: JSON.stringify(this.props[props.yType][props.yId].yItem.yContent),
      content: JSON.stringify(this.props[props.yType][props.yId].yItem.yContent, null, 2),
      showModal: true,
      contentUpdated: false,
      errorMsg: null
    }
    this.handleOpenModal = this.handleOpenModal.bind(this)
    this.handleCancel = this.handleCancel.bind(this)
    this.handleSave = this.handleSave.bind(this)
    this.handleApply = this.handleApply.bind(this)
    this.version = 0
    this.props.setState({stateVar: 'yoyth.contextMenu', stateVal: {id: this.props.yId, reset: true}})
  }

  handleOpenModal () {
    this.setState({ showModal: true })
  }

  handleCancel () {
    this.setState({ showModal: false })
    if (this.state.contentUpdated) {
      this.props.applyContent({itemType: this.state.yType, id: this.state.yId, content: JSON.parse(this.state.restoreData)})
    }
    this.props.closeModal({modalIndex: this.props.index})
  }

  handleApply () {
    try {
      this.props.applyContent({itemType: this.state.yType, id: this.state.yId, content: JSON.parse(this.state.content)})
      this.version++
      this.props.setState({stateVar: 'yoyth.objectEdited', stateVal: {objectId: this.state.yId, objectType: this.state.yType, version: this.version}})
      this.setState({errorMsg: null, contentUpdated: true})
    } catch (error) {
      console.log('errororororo')
      console.dir(error)
      this.setState({errorMsg: error})
    }
  }

  handleSave () {
    try {
      this.props.setContent({itemType: this.state.yType, id: this.state.yId, content: JSON.parse(this.state.content)})
      this.version++
      this.props.setState({stateVar: 'yoyth.objectEdited', stateVal: {objectId: this.state.yId, objectType: this.state.yType, version: this.version}})
      this.props.closeModal({modalIndex: this.props.index})
    } catch (error) {
      console.log('errororororo2')
      console.dir(error)
      this.setState({errorMsg: error})
    }
  }
  onChange (newValue) {
    this.setState({content: newValue});
  }
  doNothing () {
  }

  render () {
    return (
      <div>
        <YoythModal
          isOpen={this.state.showModal}
          disableKeyMove
          onRequestClose={this.handleCancel}
          onRequestMinimise={this.doNothing}
          initHeight='800'
          top='50px'
          left='50px'
        >
          <h4 id='heading'>Edit json, and apply, save or cancel</h4>
          {this.state.errorMsg ?
            <p style={{color: 'red'}}>{this.state.errorMsg.message}</p>
            :
            null}
          <AceEditor
            mode='json'
            theme='github'
            value={this.state.content}
            onChange={this.onChange.bind(this)}
            name='EDIT_JSON:OBJECT'
            width='700px'
            wrapEnabled
            fontSize={16}
            showPrintMargin={false}
            editorProps={{$blockScrolling: true}}
          />
          <button id='cancel-content' onClick={() => this.handleCancel()}>
            cancel
          </button>
          <button id='apply-content' onClick={() => this.handleApply()}>
            apply
          </button>
          <button id='save-content' onClick={() => this.handleSave()}>
            save
          </button>
        </YoythModal>
      </div>
    )
  }}
)
