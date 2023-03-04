export default function resizeModule ({ props, state }) {
  if (state.get(['yoyth', 'maximized'])) {
    state.set(['yoyth', 'maximized'], false)
    state.set(['yoyth', 'maximizedModule'], '')
  } else {
    state.set(['yoyth', 'maximized'], true)
    state.set(['yoyth', 'maximizedModule'], props.window)
  };
};
