export default function clearRequest ({ props, state }) {
  state.unset(['yoyth', 'yourresponse'], [props.requestId])
};
