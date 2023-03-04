export default function changeWindowSizes ({ props, state }) {
  const sizeType = 'size' + props.window
  const smallerType = 'smaller' + props.window
  const greaterType = 'greater' + props.window
  let currentSize = state.get(['yoyth', sizeType])
  props.change === 'smaller' ? currentSize = currentSize - 5 : currentSize = currentSize + 5
  state.set(['yoyth', sizeType], currentSize)
  currentSize <= state.get(['yoyth', 'minSize']) ? state.set(['yoyth', smallerType], false) : state.set(['yoyth', smallerType], true)
  currentSize >= state.get(['yoyth', 'maxSize']) ? state.set(['yoyth', greaterType], false) : state.set(['yoyth', greaterType], true)
};
