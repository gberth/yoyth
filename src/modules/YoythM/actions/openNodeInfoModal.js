export default function openNodeInfoModal ({ props }) {
  return ({ modal: 'nodeInfoModal',
    modalPayload: props.yObject
  })
};
