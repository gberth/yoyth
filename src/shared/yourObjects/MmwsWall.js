const yObject = require('./yObject')
class yWall extends yObject {
  constructor (objMap) {
    super(objMap)
    this.yWall = objMap.yItem.yItem.yContent
  }
}

module.exports = yWall
