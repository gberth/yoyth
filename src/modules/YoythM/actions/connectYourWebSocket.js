import uuid from 'uuid'
export default function connectYourWebSocket({ props, websocket, state, controller }) {
  console.log('connecting websockets')
  console.dir(websocket)
  console.dir(controller)
  var wsid = uuid.v1()
  state.set('yoyth.wsstatus', 'open')
  var result = websocket.open(wsid, 'wss:\\y0y7h.herokuapp.com', {
    receiveSignal: controller.getSignal('receiveData'),
    setWebSocketStatus: controller.getSignal('setWebSocketStatus'),
    ping: {
      msg: {
        message_data: {
          type: 'ping',
          request_data: {
            server: "yoythtestserver"
          }
        },
        identity_data: { identity: 'YoythUser' },
        payload: {}
      },
      interval: 30000
    },
    default_login: {
      msg: {
        message_data: {
          type: 'yoyth.db.search',
          request_data: {
            server: "yoythtestserver"
          }
        },
        identity_data: { identity: 'bd6b9d70-8504-11e8-9840-3b77b7062536', yoythInitial: true },
        payload: { collections: ['yourmaps', 'yourmapnodes', 'yourwalls', 'yourbricks', 'yourdocuments'] }
      }
    },
  })
  console.log('connected?' + result)
  state.set('yoyth.wsid', wsid)
};
