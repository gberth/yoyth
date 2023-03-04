const yObject = require('./yObject')
class yBrick extends yObject {
  constructor (objMap) {
    super(objMap)
    this.yBrick = objMap.yItem.yItem.yContent
  }
}

module.exports = yBrick
