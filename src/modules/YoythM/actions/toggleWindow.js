export default function toggleWindow ({ props, state }) {
  if (state.get(['yoyth', 'maximized'])) {
    state.set(['yoyth', 'maximized'], false)
    state.set(['yoyth', 'display' + props.window], true)
  } else {
    state.set(['yoyth', 'display' + props.window], !state.get(['yoyth', 'display' + props.window]))
  }
};
