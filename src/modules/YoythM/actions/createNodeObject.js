import uuid from 'uuid'
export default function createNodeObject ({ props, state }) {
  const newId = uuid.v1()
  return ({
    props: props.props,
    yObject: {
      yItem: {
        yMetaData: {
          yId: newId,
          yName: 'New Node',
          yDescription: '',
          yType: 'yourmapnodes',
          yVersion: 0,
          yOwner: state.get('yoyth.identity').yItem.yMetaData.yId
        },
        yContent: {
          expanded: true
        }
      }
    }
  })
};
