// @flow
import React, { Component } from 'react'
import { connect } from '@cerebral/react'
import { state, signal } from 'cerebral/tags'
import ReactQuill from 'react-quill'
import style from 'styled-components'

//require('react-quill/dist/quill.bubble.css'); // CommonJS
import 'react-quill/dist/quill.bubble.css'
const Font = ReactQuill.Quill.import('formats/font'); // <<<< ReactQuill exports it
Font.whitelist = ['Ubuntu', 'Raleway', 'Roboto', 'Courier'] ; // allow ONLY these fonts and the default
ReactQuill.Quill.register(Font, true);

const EditorDiv = style.div`
  margin-top: 25px;
`

const modules = {
  toolbar: [
    [{ header: '1' }, { header: '2' }, { font: ['Ubuntu', 'Raleway', 'Roboto', 'Courier'] }],
    [{ size: [] }],
    ['bold', 'italic', 'underline', 'strike', 'blockquote'],
    [
      { list: 'ordered' },
      { list: 'bullet' },
      { indent: '-1' },
      { indent: '+1' },
      { align: '' },
      { align: 'center' },
      { align: 'right' }
    ],
    ['link', 'image', 'video'],
    ['clean']
  ],
  clipboard: {
    // toggle to add extra line breaks when pasting HTML:
    matchVisual: false
  }
}

const formats = [
  'header',
  'font',
  'size',
  'bold',
  'italic',
  'underline',
  'strike',
  'blockquote',
  'list',
  'bullet',
  'indent',
  'link',
  'image',
  'video'
]

export default connect(
  {
    yourresponse: state`yoyth.yourresponse`,
    yourdocuments: state`yoyth.yourdocuments`,
    yourbricks: state`yoyth.yourbricks`,
    wallInFocus: state`yoyth.wallInFocus`,
    response: state`yoyth.response`,
    getData: signal`getData`,
    clearRequest: signal`clearRequest`,
    setContent: signal`setContent`,
    createYourObject: signal`createYourObject`
  },
  class YourQuillEditor extends Component {
    constructor (props) {
      super(props)
      this.state = { theme: 'bubble', placeholder: 'YoYth your document' }
      this.handleChange = this.handleChange.bind(this)
      //this.handleSave = this.handleSave.bind(this)
    }

    handleChange (html) {
      this.setState({ editorContent: html })
    }

    handleSave () {
      if (!this.state.document) {
        this.props.createYourObject({yMetaData: {yId: this.props.brickId, yType: 'yourdocuments'}, yContent: {format: 'html', content: this.state.editorContent}})
      } else {
        this.props.setContent({id: this.props.brickId, itemType: 'yourdocuments', content: {format: 'html', content: this.state.editorContent}})
      }
    }

    handleThemeChange (newTheme) {
      if (newTheme === 'core') newTheme = null
      this.setState({ theme: newTheme })
    }

    setBrickData () {
      let stateChange = {
        brickId: this.props.brickId,
        brick: this.props.yourbricks[this.props.brickId]
      }
      if (this.props.yourdocuments) {
        stateChange.document = this.props.yourdocuments[this.props.brickId]
        if (stateChange.document) {
          stateChange.content = stateChange.document.yItem.yContent.content
        }
      }
      stateChange.editorContent = stateChange.content
      this.setState(stateChange)
    }


    render () {
      if (!this.state.brickId || this.state.brickId !== this.props.brickId) {
        this.setBrickData()
        return null
      }

      return (
        <EditorDiv>
          <ReactQuill
            theme={this.state.theme}
            onChange={this.handleChange}
            value={this.state.editorContent}
            modules={modules}
            formats={formats}
            bounds={'div#wallInFocus'}
            placeholder={this.state.placeholder}
          />
          <button type="button" onClick={() => this.handleSave()}>Save</button>
        </EditorDiv>
      )
    }
  }
)
