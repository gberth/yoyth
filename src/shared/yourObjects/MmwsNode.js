const yObject = require('./yObject')
class yNode extends yObject {
  constructor (objMap) {
    super(objMap)
    this.yNode = objMap.yItem.yItem.yContent
    this.expanded = objMap.yItem.yItem.yContent.expnded
  }
}

module.exports = yNode
