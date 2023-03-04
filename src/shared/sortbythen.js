var getval = function (obj, path) {
  if (path) {
    path = path.split('.')
    for (var i = 0, len = path.length - 1; i < len; i++) {
      obj = obj[path[i]]
    };
    return obj[path[len]]
  }
}

var setval = function (obj, path, val) {
  if (path) {
    path = path.split('.')
    for (var i = 0, len = path.length - 1; i < len; i++) {
      obj = obj[path[i]]
    };
    obj[path[len]] = val
  }
}

var sortbythen = function (path, reverse, primer, then) {
  var prime = function (obj) {
    return primer ? primer(getval(obj, path)) : getval(obj, path)
  }
  return function (a, b) {
    var A = prime(a),
      B = prime(b)
      // console.log('A ' + A + ' B ' + B)
    return (
      (A < B) ? -1 :
      (A > B) ? 1 :
      (typeof then === 'function') ? then(a, b) : 0
      ) * [1, -1][+!!reverse]
  }
}

module.exports.sortbythen = sortbythen
module.exports.getval = getval
module.exports.setval = setval
