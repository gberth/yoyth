import uuid from "uuid";
export default function dbSearch({ props, state, websocket, path }) {
  var msg = {
    message_data: {
      message_id: uuid.v1(),
      type: "yoyth.login",
      request_data: {
        server: "yoythtestserver",
      },
    },
    identity_data: {
      identity: props.identity,
      verify: props.verify,
      fixmelater: true,
    },
    payload: {},
  };
  websocket.send(state.get("yoyth.wsid"), JSON.stringify(msg));
}
