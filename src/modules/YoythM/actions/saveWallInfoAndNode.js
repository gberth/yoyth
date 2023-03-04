export default function createWallInfoAndNode ({ props, state, path }) {
  let saveObjects = []
  if (props.node) {
    saveObjects.push(props.node)
  }
  if (props.wall) {
    saveObjects.push(props.wall)
  }
  if (props.brick) {
    saveObjects.push(props.brick)
  }  
  if (props.html) {
    saveObjects.push(props.html)
  }

  return {saveObjects: saveObjects}
}
