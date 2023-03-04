export default function openWall ({ props, state }) {
  // state.set(['yoyth', 'modalSemaphore', props.objectId], props.props);
  state.set('yoyth.wallInFocus', props.wallRef)
  state.set('yoyth.wallInFocusUpdCt', 0)
};
