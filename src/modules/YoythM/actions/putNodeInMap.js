import ScanTree from '../../../shared/ScanTree.js'
import merge from 'deepmerge'
export default function putNodeInMap ({ props, state }) {
  //let map = JSON.parse(JSON.stringify(state.get(['yoyth', 'yourmaps', props.mapdata.nodeMapId])))
  let map = merge(state.get(['yoyth', 'yourmaps', props.mapdata.nodeMapId]), {}, { clone: true })
  const scan = new ScanTree('mapNodes', 'nodeId')
  const found = scan.findAll(scan.findEqual, map.yItem.yContent, props.mapdata.nodeId)
  const newNode = {
    nodeId: props.yItem.yMetaData.yId,
    mapNodes: []
  }

  scan.insert(newNode, found[0].inTree || found[0].searchStart, found[0].indexPtr, props.mapdata.relative)
  return ({
    saveObjects: [{yItem: props.yItem}, map]
  })
};
