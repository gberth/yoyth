export default function openModal ({ props, state }) {
  // state.set(['yoyth', 'modalSemaphore', props.objectId], props.props);
  state.push('yoyth.modals', props)
};
