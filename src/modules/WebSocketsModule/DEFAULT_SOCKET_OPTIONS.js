var uuid = require('uuid')
export default {
  message_idOnMessage: true,
  getMessageId: function (message) {
    return message.message_id
  },

  setMessageId: function (message) {
    message.message_id = uuid.v1()
    return message.message_id
  },

  getRequestId: function (message) {
    return message.requestId
  },

  getRequestStatus: function (message) {
    return message.requestStatus
  },

  onerror: function (ws) {
    return function (event) {
      console.log('WS error')
      console.dir(ws)
    }
  },

  onclose: function (ws, requests) {
    return function (event) {
         // reject all existing requests, run delete requests
      console.log('WS close')
      console.dir(ws)
      requests.map()
    }
  },

  onopen: function (event) {
     /* should never be called */

  },

  onmessage: function (receiveSignal) {
    return function (msg) {
      receiveSignal({msg: JSON.parse(msg.data)})
    }
  },

  onRequest: function (xhr, options) {
    if (options.withCredentials) {
      xhr.withCredentials = true
    }

    if (
      options.cors &&
      options.headers['Content-Type'] &&
      options.allowedContentTypes.indexOf(options.headers['Content-Type']) === -1
    ) {
      delete options.headers['Content-Type']
    }

    Object.keys(options.headers).forEach(function (key) {
      xhr.setRequestHeader(key, options.headers[key])
    })

    xhr.send(options.body)
  },

  onResponse: function (xhr, resolve, reject) {
    var result = xhr.responseText

    if (xhr.getResponseHeader('content-type').indexOf('application/json') >= 0) {
      result = JSON.parse(xhr.responseText)
    }

    if (xhr.status >= 200 && xhr.status < 300) {
      resolve({
        status: xhr.status,
        result: result
      })
    } else {
      reject({
        status: xhr.status,
        result: result
      })
    }
  }

}
