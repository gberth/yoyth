import uuid from 'uuid'
import ScanTree from '../../../shared/ScanTree.js'
import merge from 'deepmerge'
import _ from 'underscore'
export default function cloneMapAndNode ({ props, state }) {
  const cloneNodes = (accum, node) => {
    const nodeItem = state.get(['yoyth', 'yourmapnodes', node.nodeId])
    let newNodeItem = cloneNodeItem(nodeItem)
    node.nodeId = newNodeItem.yItem.yMetaData.yId
    if (node.mapNodes && node.mapNodes[0]) {
      _.reduce(node.mapNodes, cloneNodes, accum, this)
    }
    accum.push(newNodeItem)
    return accum
  }
  const cloneNodeItem = (nodeItem) => {
    var newNodeItem = merge(nodeItem, {}, {clone: true})
    newNodeItem.yItem.yMetaData.yId = uuid.v1()
    newNodeItem.yItem.yMetaData.yVersion = 0
    return newNodeItem
  }

  const fromMap = state.get(['yoyth', 'yourmaps', props.fromKey.nodeMapId])
  const scan = new ScanTree('mapNodes', 'nodeId')
  const found = scan.findAll(scan.findEqual, fromMap.yItem.yContent, props.fromKey.nodeId)
  let newNode = merge(found[0].inTree[found[0].indexPtr], {}, {clone: true})
  const newItems = cloneNodes([], newNode)

  const toMap = state.get(['yoyth', 'yourmaps', props.toKey.nodeMapId])
  let newToMap = JSON.parse(JSON.stringify(toMap))
  const foundTo = scan.findAll(scan.findEqual, newToMap.yItem.yContent, props.toKey.nodeId)
  newItems.push(newToMap)
  scan.insert(newNode, foundTo[0].inTree, foundTo[0].indexPtr, props.toKey.relative)
  return { saveObjects: newItems }
};
