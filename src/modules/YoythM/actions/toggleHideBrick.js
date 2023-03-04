import merge from 'deepmerge'
export default function toggleHideBrick ({ props, state }) {
  let wall = merge(state.get(['yoyth', 'yourwalls', props.wall]), {}, { clone: true })
  if (!wall.yItem.yContent.hiddenBricks) {
    wall.yItem.yContent.hiddenBricks = []
  }
  let ix = -1
  for (let index = 0; index < wall.yItem.yContent.hiddenBricks.length; index++) {
    if (wall.yItem.yContent.hiddenBricks[index].brickId === props.brick.brickId) {
      ix = index
      break
    }
  }
  if (ix >= 0) {
    wall.yItem.yContent.hiddenBricks.splice(ix, 1)
  } else {
    wall.yItem.yContent.hiddenBricks.push(props.brick)
  }
  state.set(['yoyth', 'yourwalls', props.wall], wall)
}
