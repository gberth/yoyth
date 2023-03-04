export default function toggleExpanded ({ props, state }) {
  const findNodeAndToggle = (nodeArr, id) => {
    let found = false
    for (var node of nodeArr) {
      if (node.nodeId === id) {
        node.expanded = typeof node.expanded !== 'undefined' ? !node.expanded : false
        found = true
        break
      }
      if (!found && node.mapNodes && node.mapNodes.length > 0) {
        findNodeAndToggle(node.mapNodes, id)
      }
      if (found) {
        break
      }
    }
  }
  // search for node with id, and toggle expanded
  if (props.map === props.id) {
    let element = state.get(['yoyth', 'yourmaps', props.map])
    state.set(['yoyth', 'yourmaps', props.map, 'yItem', 'yContent', 'expanded'],
    !element.yItem.yContent.expanded)
  } else {
    let element = JSON.parse(JSON.stringify(state.get(['yoyth', 'yourmaps', props.map])))
    findNodeAndToggle(element.yItem.yContent.mapNodes, props.id)
    state.set(['yoyth', 'yourmaps', props.map], element)
  }
};
