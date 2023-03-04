import _ from 'underscore'
export default function updateData ({ props, state }) {
  const updateState = (path, item) => {
    state.set(path, item)
  }

  const handleItem = (item) => {
    if (item.yItem.yMetaData.yType.indexOf('your') === 0) {
      updateState(['yoyth', item.yItem.yMetaData.yType, item.yItem.yMetaData.yId], item)
    } else {
      updateState(['yoyth', item.yItem.yMetaData.yType], item)
    }
  }

  _.map(props.saveObjects, handleItem)
  return
};
