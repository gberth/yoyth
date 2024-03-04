import uuid from "uuid";
export default function signalElement({ props, state, websocket, path }) {
  console.dir(props);
  var msg = {
    message_data: {
      message_id: uuid.v1(),
      type: props.signal.yoythCommand,
      reqest_data: {
        server: "yoythtestserver",
      },
    },
    identity_data: {
      identity: props.identity
        ? props.identity
        : state.get("yoyth.identity.yItem.yMetaData.yId"),
      yOwner: props.yOwner || null,
      requestId: props.requestId,
      fixmelater: true,
    },
    payload: {
      yoythServer: props.signal.yoythServer,
      type: props.signal.type,
      payload: JSON.parse(props.signal.json),
    },
  };
  console.dir(msg);
  websocket.send(state.get("yoyth.wsid"), JSON.stringify(msg));
}
