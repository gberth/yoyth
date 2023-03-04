import uuid from 'uuid'
export default function createYourObject ({ yName, yDescription, yType, yOwner, yContent }) {
  return ({
    yItem: {
      yMetaData: {
        yId: uuid.v1(),
        yName: yName,
        yDescription: yDescription,
        yType: yType,
        yOwner: yOwner,
        yVersion: 0
      },
      yContent: yContent
    }
  })
}
