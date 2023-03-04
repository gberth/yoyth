export default function setContent ({ props, state }) {
  const updateState = (path, content) => {
    state.set(path, content)
  }
  console.log('applying')
  console.dir(props)
  updateState(['yoyth', props.itemType, props.id, 'yItem', 'yContent'], props.content)
};
