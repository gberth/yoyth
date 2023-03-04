import _ from 'underscore'
export default function receiveData ({ props, state }) {
  const wallInFocus = state.get('yoyth.wallInFocus')
  let wallInFocusUpdCt = state.get('yoyth.wallInFocusUpdCt')
  if (!wallInFocusUpdCt) {
    wallInFocusUpdCt = 0
  }
  const updateState = (path, item) => {
    state.set(path, item)
  }

  const handleItem = (item) => {
    console.log(item)
    if (!item.yItem) {
      return
    }
    if (item.yItem.yMetaData.wallRef && item.yItem.yMetaData.wallRef === wallInFocus) {
      wallInFocusUpdCt += 1
    }
    if (item.yItem.yMetaData.yType.indexOf('your') === 0) {
      updateState(['yoyth', item.yItem.yMetaData.yType, item.yItem.yMetaData.yId], item)
      if (item.yItem.yMetaData.yType === 'yourprofile') {
        updateState(['yoyth', 'identity'], item)
        updateState(['yoyth', 'loggedIn'], true)
        updateState(['yoyth', 'wallInFocus'], null)
      }
    } else {
      updateState(['yoyth', item.yItem.yMetaData.yType], item)
    }
  }
console.log('prrrrr', props)
  if (props.msg.message_data && props.msg.message_data.type === 'yoyth.distribute.toIdentity' &&
    props.msg.identity_data && props.msg.identity_data.requestId) {
    state.set('yoyth.yourresponse.' + props.msg.identity_data.requestId, props.msg.payload)
    state.set('yoyth.response', true)
  } else
  if (Array.isArray(props.msg.payload)) {
    _.map(props.msg.payload, handleItem)
  } else {
    if (props.msg.message_data && props.msg.message_data.type === 'yoyth.error.toIdentity') {
      updateState(['yoyth', 'error'], props.msg.payload.error)
    } else {
      handleItem(props.msg.payload)
      if (props.msg.message_data.type === 'yoyth.distribute.toIdentity') {
        if (Array.isArray(props.msg.payload.yItem.yContent)) {
          _.map(props.msg.payload.yItem.yContent, handleItem)
        }
      }
    }
  }
  if (wallInFocusUpdCt > 0) {
    state.set('yoyth.wallInFocusUpdCt', wallInFocusUpdCt)
  }
};
