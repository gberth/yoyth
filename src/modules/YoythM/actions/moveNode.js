import ScanTree from '../../../shared/ScanTree.js'
export default function moveNode ({ props, state }) {
  let fromMap = JSON.parse(JSON.stringify(state.get(['yoyth', 'yourmaps', props.fromKey.nodeMapId])))
  const scan = new ScanTree('mapNodes', 'nodeId')
  const fromNode = scan.findAll(scan.findEqual, fromMap.yItem.yContent, props.fromKey.nodeId)
  let toMap = fromMap
  if (props.fromKey.nodeMapId !== props.toKey.nodeMapId) {
    toMap = JSON.parse(JSON.stringify(state.get(['yoyth', 'yourmaps', props.toKey.nodeMapId])))
  };

  let moveObj = fromNode[0].inTree[fromNode[0].indexPtr]
  fromNode[0].inTree.splice(fromNode[0].indexPtr, 1)

  const toNode = scan.findAll(scan.findEqual, toMap.yItem.yContent, props.toKey.nodeId)

  scan.insert(moveObj, toNode[0].inTree, toNode[0].indexPtr, props.toKey.relative)
  return ({ saveObjects: (toMap !== fromMap) ? [fromMap, toMap] : [fromMap] })
};
