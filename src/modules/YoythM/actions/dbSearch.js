import uuid from 'uuid'
export default function dbSearch ({ props, state, websocket, path }) {
  console.dir(this.props)
  var msg = {message_data: {
    message_id: uuid.v1(),
    type: 'yoyth.db.search',
    reqest_data: {
      server: "yoythtestserver"
    }

  },
  identity_data: {
    identity: (props.identity ? props.identity : state.get('yoyth.identity.yItem.yMetaData.yId')),
    yOwner: (props.yOwner || null),
    requestId: props.requestId
  },
  payload: props.queryData
  }
  websocket.send(state.get('yoyth.wsid'), JSON.stringify(msg))
};
