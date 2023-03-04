import { Provider } from 'cerebral'
import { mergeWith } from './utils'
import DEFAULT_SOCKET_OPTIONS from './DEFAULT_SOCKET_OPTIONS'

export default function WebSocketProviderFactory(passedOptions) {
  let moduleOptions = mergeWith({}, DEFAULT_SOCKET_OPTIONS)
  if (typeof passedOptions === 'function') {
    moduleOptions = passedOptions(moduleOptions)
  } else if (passedOptions) {
    moduleOptions = mergeWith(passedOptions, DEFAULT_SOCKET_OPTIONS)
  }

  var websockets = {}
  var requests = {}

  function createAbortablePromise(msgid, cb) {
    return new Promise(function (resolve, reject) {
      var resolveIt = function (payload) {
        delete requests[msgid]
        resolve(payload)
      }

      var rejectIt = function (error) {
        delete requests[msgid]
        reject(error)
      }

      requests[msgid] = {
        resolve: resolveIt,
        reject: rejectIt,
        xhr: cb(resolveIt, rejectIt)
      }
    })
  }

  function openws(options, cb) {
    var xhr = new WebSocket(options.url)
    xhr.onopen = cb
    xhr.onclose = moduleOptions.onclose
    xhr.onmessage = moduleOptions.onmessage(options.receiveSignal)
    xhr.onerror = moduleOptions.onerror
    options.ws = xhr
    websockets[options.wsid] = options
    if (options.ping) {
      let pingmsg = JSON.stringify(options.ping.msg)
      setInterval(() => {
        console.dir('pppppppiiiiiiiiiiiiiiiinnnnnnnnnnnngggggggggg')
        console.log('readystate', websockets[options.wsid].ws.readyState)
        websockets[options.wsid].ws.send(pingmsg)
      }, options.ping.interval)
    }
    return xhr
  }

  function communicate(options, cb) {
    cb(options.body)
    /* TODO update stat, ,log */
  }

  function sendOnSocket(options, resolve, reject) {
    return function (body) {
      websockets[options.wsid].ws.send(body)
    }
  }

  function onopen(options, resolve, reject) {
    return function () {
      options.ws.onopen = options.onopen
      options.status = 'open'
      options.opents = 'ts opened'
      options.lastts = 'ts opened'
      options.successct = 0
      options.receivect = 0
      options.sendct = 0
      options.setWebSocketStatus({ stateVar: 'yoyth.wsstate', stateVal: 'connected' })
      websockets[options.wsid] = options
      if (options.ping) {
        let pingmsg = JSON.stringify(options.ping.msg)
        websockets[options.wsid].ws.send(pingmsg)
      }
      if (options.default_login) {
        let msg = JSON.stringify(options.default_login.msg)
        websockets[options.wsid].ws.send(msg)

      }
      resolve({
        status: 'open',
        result: 'open',
        wsid: options.wsid
      })
    }
  }

  function sendService(options) {
    return createAbortablePromise(options.msgid, function (resolve, reject) {
      return communicate(options, sendOnSocket(options, resolve, reject))
    })
  }
  function resolveOpen(res) {
    console.dir(res)
  }
  function rejectOpen(res) {
    console.dir(res)
  }

  return Provider({
    request: sendService,
    open: function (wsid, url, options) {
      options = options || {}
      options.wsid = wsid
      options.url = url
      options.method = 'OPEN'
      return openws(options, onopen(options, resolveOpen, rejectOpen))
    },

    send: function (wsid, body, ioptions) {
      ioptions = ioptions ? mergeWith(ioptions, websockets[wsid]) : websockets[wsid]
      ioptions.method = 'SEND'
      ioptions.body = body
      return sendService(ioptions)
    },

    updateOptions: function (newOptions) {
      moduleOptions = mergeWith(newOptions, moduleOptions)
    },

    abort: function (regexp) {
      console.log('aaabbbbboooorrrtttt' + regexp)
      var matchingUrls = Object.keys(requests).filter(function (url) {
        return Boolean(url.match(new RegExp(regexp)))
      })

      matchingUrls.forEach(function (url) {
        requests[url].xhr.abort()
      })
    }
  })
}
