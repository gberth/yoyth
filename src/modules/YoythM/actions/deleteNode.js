import ScanTree from '../../../shared/ScanTree.js'
export default function deleteNode ({ props, state }) {
  let delObjs = []
  const getObjects = (yObj) => {
    let delObj = state.get(['yoyth', 'yourmapnodes', yObj.nodeId])
    delObj.yItem.yMetaData.yStatus = 'DELETE'
    delObjs.push(delObj)
    if (yObj.mapNodes && yObj.mapNodes[0]) {
      yObj.mapNodes.forEach(getObjects)
    }
  }

  let fromMap = JSON.parse(JSON.stringify(state.get(['yoyth', 'yourmaps', props.delete.nodeMapId])))
  const scan = new ScanTree('mapNodes', 'nodeId')
  const fromNode = scan.findAll(scan.findEqual, fromMap.yItem.yContent, props.delete.nodeId)

  let deleteObj = fromNode[0].inTree[fromNode[0].indexPtr]
  // then get all node objects in deleteObj for delete
  fromNode[0].inTree.splice(fromNode[0].indexPtr, 1)
  getObjects(deleteObj)
  delObjs.push(fromMap)

  //state.unset('yoyth.modalSemaphore', [props.objectId])
  //state.splice('yoyth.modals', props.modalIndex, 1)
  return ({ saveObjects: delObjs })

}
