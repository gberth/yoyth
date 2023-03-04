const _ = require('underscore')

function ScanTree (arrayAttribute, searchAttributes) {
  this.arrayAttribute = arrayAttribute
  this.searchAttributes = searchAttributes
  this.searchFor = null
  this.elementRef = []
  this.searchStart = null
}

module.exports = ScanTree

ScanTree.prototype.findEqual = function findEqual (accumulator, element, index, tree) {
  let includeThis = false

  if (typeof this.searchAttributes === 'string') {
    if (element[this.searchAttributes] === this.searchFor) {
      includeThis = true
    } else {
                // or check on attributes
    }
  }
  const retval = {}

  if (includeThis) {
    retval.inTree = tree
    retval.indexPtr = index
    retval.elementRef = this.elementRef.length > 0 ? this.elementRef[0] : tree
    retval.searchStart = this.searchStart
    accumulator.push(retval)
  }

  if (Array.isArray(element[this.arrayAttribute])) {
    this.elementRef.unshift(element)
    _.reduce(element[this.arrayAttribute], this.findEqual, accumulator, this)
    this.elementRef.shift(element)
  }

  return accumulator
}

ScanTree.prototype.findAll = function findAll (reducer, element, searchFor) {
  this.searchFor = searchFor
  this.elementRef = []
  this.searchStart = element
  const reduce = reducer.bind(this)

  let returns = reduce([], element, 0, null)


  //if (Array.isArray(element[this.arrayAttribute])) {
  //  this.elementRef.unshift(element)
  //  returns = _.reduce(element[this.arrayAttribute], reducer, [], this)
  //  this.elementRef.shift(element)
  //}

  return returns
}

ScanTree.prototype.insert = function insert (element, inElementsTree, atIndex, relative) {
  switch (relative) {
    case 'before': {
      inElementsTree.splice(atIndex, 0, element)
      break
    }

    case 'after': {
      const indx = atIndex + 1
      inElementsTree.splice(indx, 0, element)
      break
    }

    case 'asChild': {
      const thisElement = Array.isArray(inElementsTree) ? inElementsTree[atIndex] : inElementsTree 

      if (!Array.isArray(thisElement[this.arrayAttribute])) {
        thisElement[this.arrayAttribute] = []
      }

      thisElement[this.arrayAttribute].push(element)
      break
    }

    default: {
      break
    }
  }
}
