// @flow
import React, { Component } from 'react'
import { connect } from '@cerebral/react'
import { state, signal } from 'cerebral/tags'
import style from 'styled-components'

export type YoythEntityId = string
export type YoythEntityType = string

export type YoythEntity = {
  id: YoythEntityId,
  type: YoythEntityType,
  width: number,
  height: number,
  border: boolean,
  x: number,
  y: number,
  name: string,
  mouseOver?: Object
}

export type YoythEntities = Array<YoythEntities>;

export type YoythStreamProps = {
  entity: YoythEntity,
  sources: YoythEntities,
  sinks: YoythEntities,
  links: YoythEntities
}

export type YoythStreams = Array<YoythStreamProps>;

export type YoythComponentProps = {
  entity: YoythEntity,
  streams: YoythStreams
}

export type YoythComponents = Array<YoythComponentProps>;

const YoythComponents = [
  {
    entity: {
     id: 'config1',
     type: 'Config',
     width: 1600,
     height: 1600,
     border: false,
     x: 0,
     y: 0,
     name: 'WebServer'
    },
    streamdefs: []
  }
]              
const EntityDiv = style.div.attrs({
  style: props => {
    const defaultStyles = {
      left: `${props.entity.x}px`,
      top: `${props.entity.y}px`,
      width: `${props.entity.width}px`,
      height: `${props.entity.height}px`,
      border: `${props.border}`,
      borderRadius: "7px",
      wordWrap: "break-word",
    }
    return defaultStyles; 
  },
})`
  position: absolute;
  background-color: #eee;
  overflow: hidden;
`;

const SvgLand = style.svg`
  position: absolute;
  top: 0;
  left: 0;
`;

const Entity = style.div`
  position: relative;
  top: 0;
  left: 0;
`;


/*
 * Presentational
 * ==================================== */     
const Box = style.div`
    width: 1200px;
    position: absolute;
    border: 25px solid green;
    padding: 25px;
    margin: 25px;
`;                
const ComponentConfig = (props: YoythComponentProps) => {
  return (
    <EntityDiv border={'none'} entity={props.config.entity}>
      {props.config.streamdefs.map(streamdef => { return(<StreamDef config={streamdef} />)})}   
    </EntityDiv>
  )
}

const StreamDef = (props: YoythStreamProps) => {
  let txt = (props.config.sources.length === 0 && 
    props.config.links.length === 0 && 
    props.config.sinks.length === 0 ? props.config.stream.entity.mouseOver : '') 
    
  return (
    <EntityDiv border={'none'} entity={props.config.entity}>
      <Entity title={props.config.entity.mouseOver}>{}</Entity>
      <Stream config={props.config.stream} txt={txt}/>
      {props.config.sources.map(source => { return(<Source config={source} />)})}   
      {props.config.sinks.map(sink => { return(<Sink config={sink} />)})}   
      {props.config.links.map(link => { return(<Link config={link} />)})}   

    </EntityDiv>
  )
}

const Stream = (props: YoythStreamProps) => {
  return (
    <EntityDiv border={'2px solid red'} entity={props.config.entity}>
      <Entity title={props.config.entity.mouseOver}>{props.config.entity.id} {props.txt}</Entity>
    </EntityDiv>
  )
}
const Source = (props: YoythStreamProps) => {
  return (
    <EntityDiv border={'2px solid green'} entity={props.config.entity}>
      <Entity title={props.config.entity.id}>{props.config.entity.type} {props.config.entity.id}</Entity>
    </EntityDiv>
  )
}

const Sink = (props: YoythStreamProps) => {
  return (
    <EntityDiv border={'2px solid blue'} entity={props.config.entity}>
      <Entity title={props.config.entity.id}>{props.config.entity.type} {props.config.entity.id}</Entity>
    </EntityDiv>
  )
}

const Link = (props: YoythStreamProps) => {
  return (
    <EntityDiv border={'1px solid black'} entity={props.config.entity}>
      <Entity title={props.config.entity.id}></Entity>
    </EntityDiv>
  )
}
export default connect(
  {
    wallInFocus: state`yoyth.wallInFocus`,
    yourdocumentation: state`yoyth.yourdocumentation`
  },
  class YoythEntities extends Component {
    constructor (props) {
      super(props)
      this.state = {
        hidden: true,
      }
    }
    handleOpenCloseNav() {
      this.setState({
        hidden: !this.state.hidden,
      })
    }
    
    render () {
      if (this.props.yourdocumentation && this.props.yourdocumentation[this.props.wallInFocus]) {
        YoythComponents[0].streamdefs = this.props.yourdocumentation[this.props.wallInFocus].yItem.yContent.streamDoc
      } else {
        if (this.props.yourdocumentation) {
          YoythComponents[0].streamdefs = this.props.yourdocumentation[Object.keys(this.props.yourdocumentation)[0]].yItem.yContent.streamDoc
        }
      }
      return (
        <Entity>
      <ComponentConfig config={YoythComponents[0]} />
      </Entity>
      )
    }
  }
)
