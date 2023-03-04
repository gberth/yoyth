import uuid from 'uuid'
export default function createYourObject ({ props, state }) {
  let obj = {yMetaData: props.yMetaData, yContent: props.yContent}
  if (!obj.yMetaData.yId) {
    obj.yMetaData.yId = uuid.v1()
  }
  obj.yMetaData.yOwner = obj.yMetaData.yOwner || state.get('yoyth.identity.yItem.yMetaData.yId')
  obj.yMetaData.yVersion = 0

  return (
    { saveObjects: [ 
      {
        yItem: obj
      }
    ]
  })
}
