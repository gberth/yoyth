export default function closeModal ({ props, state }) {
  console.log('close modal')
  state.unset(['yoyth', 'modalSemaphore'], [props.objectId])
  state.splice(['yoyth', 'modals'], props.modalIndex, 1)
};
