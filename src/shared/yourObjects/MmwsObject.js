'use strict'
const yWall = require('./yWall')
const yBrick = require('./yBrick')

const yObjects = {
  yWall: yWall,
  yBrick: yBrick
}

class yObject {
  constructor (objMap) {
    console.dir(objMap)
    this.yId = objMap.yItem.yMetaData.yId
    this.yWid = objMap.yItem.yMetaData.yWid
    this.yDescription = objMap.yItem.yMetaData.yDescription
    this.yId = objMap.yItem.yMetaData.yId
    this.yType = objMap.yItem.yMetaData.yType
    this.yVersion = objMap.yItem.yMetaData.yVersion
    this.yOwner = objMap.yItem.yMetaData.yOwner
    this.yImg = objMap.yItem.yMetaData.yImg ? objMap.yItem.yMetaData.yImg : null
    this.yContent = objMap.yItem.yItem.yContent
  }
  id () {
    return this.yId
  };
  wId () {
    return this.yWId
  };
  description () {
    return this.yDescription
  };
  content () {
    return this.yContent
  };
}

module.exports = yObject
module.exports.createObject = function (objMapItem) {
  return yObjects[objMapItem.yItem.yMetaData.yType]
    ? new yObjects[objMapItem.yItem.yMetaData.yType](objMapItem)
    : new yObject(objMapItem)
}
