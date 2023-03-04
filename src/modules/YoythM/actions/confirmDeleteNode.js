export default function confirmDeleteMode ({ props }) {
  console.log('setNodeInfoModalOpened', props)
  return ({ modal: 'confirmDeleteNodeModal',
    modalPayload: {...props}
  })
};
