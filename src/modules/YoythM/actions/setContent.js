export default function setContent ({ props, state }) {
  const updateState = (path, content) => {
    state.set(path, content)
  }
  console.dir(props)
  updateState(['yoyth', props.itemType, props.id, 'yItem', 'yContent'], props.content)
  return {saveObjects: [state.get(['yoyth', props.itemType, props.id]) ]}

};
