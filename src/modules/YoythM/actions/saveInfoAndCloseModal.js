import merge from 'deepmerge'
export default function saveInfoAndCloseModal ({ props, state, path }) {
  var newItem = merge(props.yItem, {}, { clone: true })
  newItem.yMetaData.yDescription = props.desc
  newItem.yMetaData.yName = props.name
  newItem.yMetaData.yImg = props.image
  state.set(['yoyth', newItem.yMetaData.yType, newItem.yMetaData.yId], {yItem: newItem, _id: props._id})
  state.unset('yoyth.modalSemaphore', [props.objectId])
  state.splice('yoyth.modals', props.modalIndex, 1)

  if (!newItem.yMetaData.yVersion) {
    return path.create({yItem: newItem})
  }
  return (path.continue({saveObjects: [{yItem: newItem, _id: props._id}]}))
};
