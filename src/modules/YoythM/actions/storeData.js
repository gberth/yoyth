import uuid from 'uuid'
export default function storeData ({ props, state, websocket, path }) {
  //TODO what if user is creating comment whn logged in?
  if (props.saveObjects.length > 0) {
    var msg = {message_data: {
      message_id: uuid.v1(),
      type: 'yoyth.db.update',
      reqest_data: {
        server: "yoythtestserver"
      }

    },
    identity_data: {
      identity: state.get('yoyth.identity') ? state.get('yoyth.identity.yItem.yMetaData.yId') : null,
      yOwner: props.yMetaData && props.yMetaData.yOwner ? props.yMetaData.yOwner : null
    },
    payload: props.saveObjects
    }
    websocket.send(state.get('yoyth.wsid'), JSON.stringify(msg))
  }
}
