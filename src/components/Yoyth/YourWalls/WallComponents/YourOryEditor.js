import React, { Component } from 'react'
import { connect } from '@cerebral/react'
import { state, signal } from 'cerebral/tags'
import style from 'styled-components'

// The editor core
import Editor, { Editable, createEmptyState } from 'ory-editor-core'
import 'ory-editor-core/lib/index.css' // we also want to load the stylesheets

// Require our ui components (optional). You can implement and use your own ui too!
import { Trash, DisplayModeToggle, Toolbar } from 'ory-editor-ui'
import 'ory-editor-ui/lib/index.css'

// Load some exemplary plugins:

import slate from 'ory-editor-plugins-slate' // The rich text area plugin
import 'ory-editor-plugins-slate/lib/index.css' // Stylesheets for the rich text area plugin
import image from 'ory-editor-plugins-image' // The rich text area plugin
import 'ory-editor-plugins-image/lib/index.css' // Stylesheets for the rich text area plugin
import video from 'ory-editor-plugins-video' // The rich text area plugin
import 'ory-editor-plugins-video/lib/index.css' // Stylesheets for the rich text area plugin
import spacer from 'ory-editor-plugins-spacer' // The rich text area plugin
import 'ory-editor-plugins-spacer/lib/index.css' // Stylesheets for the rich text area plugin
import divider from 'ory-editor-plugins-divider' // The rich text area plugin
import 'ory-editor-plugins-divider/lib/index.css' // Stylesheets for the rich text area plugin
import parallax from 'ory-editor-plugins-parallax-background' // A plugin for parallax background images
import 'ory-editor-plugins-parallax-background/lib/index.css' // Stylesheets for parallax background images

import native from 'ory-editor-plugins-default-native'

require('react-tap-event-plugin')() // react-tap-event-plugin is required by material-ui which is used by ory-editor-ui so we need to call it here
const merge = require('deepmerge')

const EditorDiv = style.div`
  grid-column: 2 / -1;
  margin-top: 25px;
`

// Define which plugins we want to use. We only have slate and parallax available, so load those.
const EditorPlugins = {
  content: [slate(), image, spacer, divider, video], // Define plugins for content cells. To import multiple plugins, use [slate(), image, spacer, divider]
  layout: [parallax({ defaultPlugin: slate()})], // Define plugins for layout cells
  native
}

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
  class YourOryEditor extends Component {
    constructor (props) {
      super(props)
      this.state = { document: null, content: null, editorContent: null }
      this.handleChange = this.handleChange.bind(this)
      this.handleSave = this.handleSave.bind(this)
    }

    componentWillMount() {
      if (this.props.yourdocuments && this.props.yourdocuments[this.props.brickId]) {
        this.setState({document: this.props.yourdocuments[this.props.brickId]})
        this.setState({editorContent: this.props.yourdocuments[this.props.brickId].yItem.yContent.content})
        this.editorContent = merge(this.props.yourdocuments[this.props.brickId].yItem.yContent.content, {}, { clone: true })
      } else {
        this.editorContent = createEmptyState()
      }
      this.editor = new Editor({ 
        plugins: EditorPlugins, 
        defaultPlugin: slate(), 
        editables: [this.editorContent] 
      })
    }

    handleChange (editable) {
      console.log('changing ..........................................')
      this.setState({ editorContent: editable })
    }

    handleSave () {
      if (!this.state.document) {
        this.props.createYourObject({yMetaData: {yId: this.props.brickId, yType: 'yourdocuments'}, yContent: {format: 'html', content: this.state.editorContent}})
  
      } else {
        this.props.setContent({id: this.props.brickId, itemType: 'yourdocuments', content: {format: 'ory', content: this.state.editorContent}})
      }
    }

    render () {
      return (
      <EditorDiv>
        <Editable editor={this.editor} id={this.editorContent.id} onChange={state => (this.handleChange(state))} />
        <button onClick={() => this.handleSave(this.editorState)}>Save</button>
        <Trash editor={this.editor}/>
        <DisplayModeToggle editor={this.editor}/>
        <Toolbar editor={this.editor}/>
      </EditorDiv>
      )
    }
  }
)
