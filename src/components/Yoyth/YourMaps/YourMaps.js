import React from 'react'
import { state, signal } from 'cerebral/tags'
import { connect } from '@cerebral/react'
import style from 'styled-components'

const _ = require('underscore')

const MenuDiv = style.div`
  width: 100%;
`

const DropDownMenu = style.div`
  width: 200px;
  position: fixed;
  display: block;
  opacity: 1;
  z-index: 100;
  > a {
    background-color: #eee;
    color: black;
    display: block;
    padding: 12px;
    text-decoration: none;
  }
  > a:hover {
    background-color: #ccc;
  }
`

const MenuNode = style.div`
  font-family: "montserrat";
  height: 40px;
  font-size: 20px;
  text-align: left;
  color: white;
  white-space: nowrap;
  overflow: hidden;
  padding-left: ${props => props.level * 20}px;
  background-color: rgb(42, ${props => (props.level - 1) * 7 + 187}, ${props => (props.level - 1) * 7 + 193});
  border-style: ${props => props.selected ? 'solid' : null}
  border-width: ${props => props.selected ? '1px 0px 1px 0px' : null}
`

const menuDef = [
  {
    key: 'xcopy',
    title: 'Copy',
    addMarked: true,
    relative: true,
    mapAccess: 'all'
  },
  {
    key: 'cwall',
    title: 'Config Wall',
    addMarked: false,
    relative: false,
    mapAccess: 'all'
  },
  {
    key: 'jwall',
    title: 'Edit Wall Json',
    addMarked: false,
    relative: false,
    mapAccess: 'all'
  },
  {
    key: 'owall',
    title: 'Open Wall',
    addMarked: false,
    relative: false,
    mapAccess: 'all'
  },
  {
    key: 'xmove',
    title: 'Move',
    addMarked: true,
    relative: true,
    mapAccess: 'all'
  },
  {
    key: 'xcreate',
    title: 'Create Node',
    addMarked: false,
    relative: true,
    mapAccess: 'all'
  },
  {
    key: 'edit',
    title: 'Edit Node',
    addMarked: false,
    relative: false,
    mapAccess: 'all'
  },
  {
    key: 'copy',
    title: 'Copy',
    addMarked: false,
    relative: false,
    mapAccess: 'all',
    node: true
  },
  {
    key: 'move',
    title: 'Move',
    addMarked: false,
    relative: false,
    mapAccess: 'all',
    node: true
  },
  {
    key: 'mark',
    title: 'Mark',
    addMarked: false,
    relative: false,
    mapAccess: 'all',
    node: true
  },
  {
    key: 'delete',
    title: 'Delete',
    addMarked: false,
    relative: false,
    mapAccess: 'all',
    node: true
  }
]

export default connect(
  {
    yourmaps: state`yoyth.yourmaps`,
    identity: state`yoyth.identity`,
    yourmapnodes: state`yoyth.yourmapnodes`,
    yourwalls: state`yoyth.yourwalls`,
    markedNode: state`yoyth.markedNode`,
    popup: state`yoyth.popup`,
    language: state`yoyth.language`,
    wallInFocus: state`yoyth.wallInFocus`,    
    setPopup: signal`setPopup`,
    setMarkedNode: signal`setMarkedNode`,
    moveNode: signal`moveNode`,
    copyNode: signal`copyNode`,
    confirmDeleteNode: signal`confirmDeleteNode`,
    newMapNode: signal`newMapNode`,
    openWall: signal`openWall`,
    toggleExpanded: signal`toggleExpanded`,
    openNodeInfoModal: signal`openNodeInfoModal`,
    openModal: signal`openModal`,
    initialData: state`yoyth.initialData`
  },
  class YourMaps extends React.Component {
    constructor (props) {
      super(props)
      this.state = {
        openFirstWall: true,
      }
    }
    onMenuEnter (ev) {
      ev.event.stopPropagation()
      ev.event.preventDefault()
    }
    onMenuLeave (ev) {
      //console.log('on leave', ev)
    }

    onMenu (ev) {
      //console.log('on menu', ev)
    }
    onNodeClick (id) {
      let nodeRef = this.props.yourmapnodes[id]
      if (nodeRef && nodeRef.yItem.yMetaData.wallRef) {
        this.props.openWall({
          wallRef: nodeRef.yItem.yMetaData.wallRef
        })
      }
    }

    contextMenuListener (el) {
      if (this.props.identity && this.props.identity.yItem.yMetaData.yId === this.props.yourmaps[el.map].yItem.yMetaData.yOwner) {
        el.event.preventDefault()
        this.props.setPopup({
          component: 'yourmaps',
          id: el.id,
          prefix: el.prefix,
          map: el.map,
          x: el.event.clientX,
          y: el.event.clientY
        })
        this.setState({ menuOpen: true })
      }
    }

    handleSelection (data) {
      if (
        (data.action === 'copy' || data.action === 'move') &&
        data.nodeType !== 'yourmaps'
      ) {
        this.props.setMarkedNode({ todo: 'x' + data.key, ...data })
      }

      if (data.action === 'xmove') {
        this.props.moveNode({ fromKey: this.props.markedNode, toKey: data })
      }

      if (data.action === 'xcopy') {
        this.props.copyNode({ fromKey: this.props.markedNode, toKey: data })
      }

      if (data.action === 'xcreate') {
        this.props.newMapNode({ mapdata: data })
      }

      if (data.action === 'owall') {
        let node =
          data.nodeType === 'yourmapnodes'
            ? this.props.yourmapnodes[data.nodeId]
            : this.props.yourmaps[data.nodeId]
        let wall = node.yItem.yMetaData.wallRef
          ? this.props.yourwalls[node.yItem.yMetaData.wallRef]
          : null
        this.props.openWall({
          wallRef: wall ? wall.yItem.yMetaData.yId : node.yItem.yMetaData.yName
        })
      }

      if (data.action === 'edit') {
        this.props.openNodeInfoModal({
          yObject:
            data.nodeType === 'yourmapnodes'
              ? this.props.yourmapnodes[data.nodeId]
              : this.props.yourmaps[data.nodeId]
        })
      }

      if (data.action === 'cwall') {
        let node =
          data.nodeType === 'yourmapnodes'
            ? this.props.yourmapnodes[data.nodeId]
            : this.props.yourmaps[data.nodeId]
        let wall = node.yItem.yMetaData.wallRef
          ? this.props.yourwalls[node.yItem.yMetaData.wallRef]
          : null

        this.props.openModal({
          modal: 'editWallInfoModal',
          nodeId: data.nodeId,
          nodeType: data.nodeType,
          wallId: wall ? wall.yItem.yMetaData.yId : null,
          wallName: wall ? wall.yItem.yMetaData.yName : null,
          wallDescription: wall
            ? wall.yItem.yMetaData.yDescription
            : null
        })
      }
      if (data.action === 'jwall') {
        let node =
        data.nodeType === 'yourmapnodes'
          ? this.props.yourmapnodes[data.nodeId]
          : this.props.yourmaps[data.nodeId]
        this.props.openModal({
          modal: 'editJsonObject',
          yId: node.yItem.yMetaData.wallRef,
          yType: 'yourwalls'
        })
      }
      if (data.action === 'delete') {
        this.props.confirmDeleteNode({
          ...data
        })
      }
    }

    icon (matIcon) {
      if (matIcon) {
        return <i className='material-icons material-icons--outline'>{matIcon}</i>
      }
      return null
    }

    aWithClassIdAndValue (id, val, prefix, level, opened, map = false) {
      const obj = map ? this.props.yourmaps[id] : this.props.yourmapnodes[id]
      const mapid = this.currentMap
      let matIcon =
        obj && obj.yItem.yMetaData.yImg
          ? obj.yItem.yMetaData.yImg
          : null

      return (
        <MenuNode selected={obj && obj.yItem.yMetaData.wallRef && obj.yItem.yMetaData.wallRef === this.props.wallInFocus} level={level}>
          {opened !== null ? (opened ?
              <a style={{cursor: 'pointer'}} onClick={() => this.props.toggleExpanded({ map: mapid, id: id })}>&#9660;  </a>
            : <a style={{cursor: 'pointer'}} onClick={() => this.props.toggleExpanded({ map: mapid, id: id })}>&#9658;  </a>) : null
          }
          <a style={{cursor: 'pointer'}}
            onMouseOver={event => this.onMenuEnter({ event: event, id: id })}
            onMouseLeave={event => this.onMenuLeave({ event: event, id: id })}
            onClick={event => this.onNodeClick(id)}
            onContextMenu={event =>
              this.contextMenuListener({
                event: event,
                id: id,
                prefix: prefix,
                map: mapid
              })
            }
          >
            {this.icon(matIcon)}
            {' ' + val}
          </a>
        </MenuNode>
      )
    }
    renderMapElements (mapElement, prefix, level) {
      const node = this.props.yourmapnodes[mapElement.nodeId]

      let renderit = typeof mapElement.expanded === 'undefined' || mapElement.expanded ? true : false
      if (node.yItem.yMetaData.ownerOnly && !
        (this.props.identity && this.props.identity.yItem.yMetaData.yId === node.yItem.yMetaData.yOwner)) {
          return null
        }
      return (
        <div key={'D' + node.yItem.yMetaData.yId}>
          {this.aWithClassIdAndValue(
            node.yItem.yMetaData.yId,
            !this.props.language ? node.yItem.yMetaData.yName : node.yItem.yMetaData['yName'+this.props.language] || node.yItem.yMetaData.yName,
            prefix,
            level,
            typeof mapElement.expanded === 'undefined' || mapElement.expanded ? true : false,
            false
          )}
          {renderit ? 
            <div style={{ margin: 0 }}>
              {_.map(mapElement.mapNodes, this.renderElement, this)}
            </div>
            :
            null
          }
      </div>
      )
    }

    renderSingleElement (node, prefix, level) {
      const nodeObj = this.props.yourmapnodes[node.nodeId]
      if (nodeObj) {
        return (
          <div key={'D' + nodeObj.yItem.yMetaData.yId}>
            {this.aWithClassIdAndValue(
              nodeObj.yItem.yMetaData.yId,
              !this.props.language ? nodeObj.yItem.yMetaData.yName : nodeObj.yItem.yMetaData['yName'+this.props.language] || nodeObj.yItem.yMetaData.yName,
              prefix,
              level,
              null,
              false
            )}
          </div>
        )
      } else return null
    }

    initiateLevels (mapId) {
      this.mapLevel = 1
      this.prefix = {}
      this.ct = {}
      this.prefix[this.mapLevel] = mapId
      this.ct[this.mapLevel] = 0
    }

    nextPrefix () {
      this.ct[this.mapLevel] += 1
      return this.prefix[this.mapLevel] + '_' + this.ct[this.mapLevel]
    }

    incrementLevel () {
      this.mapLevel += 1
      this.ct[this.mapLevel] = 0
      this.prefix[this.mapLevel] =
        this.prefix[this.mapLevel - 1] + '_' + this.ct[this.mapLevel - 1]
    }

    decrementLevel () {
      this.mapLevel -= 1
    }

    renderElement (node) {
      let nodePrefix = this.nextPrefix()
      let retv = null
      if (node.mapNodes && node.mapNodes.length > 0) {
        this.incrementLevel()
        retv = this.renderMapElements(node, nodePrefix, this.mapLevel - 1)
        this.decrementLevel()
      } else {
        retv = this.renderSingleElement(node, nodePrefix, this.mapLevel)
      }
      return retv
    }

    renderMaps (map) {
      this.currentMap = map.yItem.yMetaData.yId
      this.initiateLevels(this.currentMap)

      return (
        <div key={'D' + map.yItem.yMetaData.yId}>
          <span key={'M' + map.yItem.yMetaData.yId}>
            {this.renderElement(map.yItem.yContent)}
          </span>
        </div>
      )
    }

    checkMenuItem (menuItem, element, currentMap, prefix) {
      let retv = []
      let stext = ''
      if (menuItem.addMarked && !this.props.markedNode) return false
      if (menuItem.addMarked && this.props.markedNode.todo !== menuItem.key) { return false }
      if (
        menuItem.key === 'xmove' &&
        prefix.startsWith(this.props.markedNode.nodePrefix)
      ) {
        return false
      }
      if (
        menuItem.node &&
        element.yItem.yMetaData.yType === 'yourmaps'
      ) {
        return false
      }
      if (menuItem.key === 'jwall') {
        console.dir(element)
      }

      if (menuItem.key === 'jwall' && !element.yItem.yMetaData.wallRef) {
        return false
      }

      if (menuItem.relative) {
        stext = menuItem.title // ++

        if (
          this.props.markedNode &&
          this.props.markedNode.todo === menuItem.key &&
          (this.props.markedNode.todo === 'xcopy' ||
            this.props.markedNode.todo === 'xmove')
        ) {
          stext = menuItem.title + ' "' + this.props.markedNode.nodeName + '"' // ++
        }

        let bef = {
          text: stext + ' before',
          map: currentMap,
          key: menuItem.key + '_bef',
          action: menuItem.key,
          relative: 'before'
        }

        let aft = {
          text: stext + ' after',
          map: currentMap,
          key: menuItem.key + '_aft',
          action: menuItem.key,
          relative: 'after'
        }

        let aschild = {
          text: stext + ' as child',
          map: currentMap,
          key: menuItem.key + '_aschild',
          action: menuItem.key,
          relative: 'asChild'
        }
        retv.push(bef)
        retv.push(aschild)
        retv.push(aft)
      } else {
        retv.push({
          text: menuItem.title,
          map: currentMap,
          key: menuItem.key,
          action: menuItem.key,
          relative: null
        })
      }
      return retv
    }

    nodeMenu (node, currentMap, prefix) {
      const nodeObj =
        node !== currentMap
          ? this.props.yourmapnodes[node]
          : this.props.yourmaps[node]
      return menuDef.map((menuItem, i) => {
        const showMenuItem = this.checkMenuItem(
          menuItem,
          nodeObj,
          currentMap,
          prefix
        )
        const retv = showMenuItem
          ? showMenuItem.map((item, j) => (
            <a key={item.key} style={{cursor: 'pointer'}}
              onClick={() =>
                this.handleSelection({
                  nodeId: nodeObj.yItem.yMetaData.yId,
                  nodeName: nodeObj.yItem.yMetaData.yName,
                  nodeType: nodeObj.yItem.yMetaData.yType,
                  nodePrefix: prefix,
                  nodeMapId: currentMap,
                  somethingArbitrary: 'arbitrary',
                  key: item.key,
                  action: item.action,
                  relative: item.relative
                })
              }
            >
              {item.text}
            </a>
          ))
          : null
        return retv
      })
    }

    displayContextMenu () {
      const el = this.props.popup
      return (
        <DropDownMenu key="drdc" style={{ top: el.y + 'px', left: el.x + 'px' }}>
            {this.nodeMenu(el.id, el.map, el.prefix)}
        </DropDownMenu>
      )
    }

    render () {
      return (
        <MenuDiv>
          <div>{_.map(this.props.yourmaps, this.renderMaps, this)}</div>
          {this.props.popup && this.props.popup.id !== '' && this.props.popup.component === 'yourmaps'
            ? this.displayContextMenu()
            : null}
        </MenuDiv>
      )
    }
  }
)
