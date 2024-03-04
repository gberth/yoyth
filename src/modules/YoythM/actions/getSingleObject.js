import uuid from "uuid";
export default function getSingleObject({ props, state, websocket, path }) {
  var msg = {
    message_data: {
      message_id: uuid.v1(),
      type: "yoyth.db.search",
      reqest_data: {
        server: "yoythtestserver",
      },
    },
    identity_data: {
      identity: props.identity
        ? props.identity
        : state.get("yoyth.identity.yItem.yMetaData.yId"),
      fixmelater: true,
    },
    payload: props.get,
  };
  websocket.send(state.get("yoyth.wsid"), JSON.stringify(msg));

  // output.success({ props: props.props })
  return path.success();
}
