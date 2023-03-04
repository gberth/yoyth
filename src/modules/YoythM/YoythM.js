import { Module } from 'cerebral'
import Useragent from '@cerebral/useragent'
import WebSocketsProvider from './../WebSocketsModule'
import applyContent from './signals/applyContent'
import changeWindowSizes from './signals/changeWindowSizes'
import clearRequest from './signals/clearRequest'
import closeModal from './signals/closeModal'
import confirmDeleteNode from './signals/confirmDeleteNode'
import connectYourWebSocket from './signals/connectYourWebSocket'
import copyNode from './signals/copyNode'
import createYourObject from './signals/createYourObject'
import dbSearch from './signals/dbSearch'
import deleteNode from './signals/deleteNode'
import login from './signals/login'
import moveNode from './signals/moveNode'
import newMapNode from './signals/newMapNode'
import openModal from './signals/openModal'
import openNodeInfoModal from './signals/openNodeInfoModal'
import openWall from './signals/openWall'
import receiveData from './signals/receiveData'
import resizeModule from './signals/resizeModule'
import saveInfoAndCloseModal from './signals/saveInfoAndCloseModal'
import saveWallInfoAndNode from './signals/saveWallInfoAndNode'
import setContent from './signals/setContent'
import setMarkedNode from './signals/setMarkedNode'
import setPopup from './signals/setPopup'
import setState from './signals/setState'
import settingsMenu from './signals/settingsMenu'
import setWebSocketStatus from './signals/setWebSocketStatus'
import signalElement from './signals/signalElement'
import toggleExpanded from './signals/toggleExpanded'
import toggleHideBrick from './signals/toggleHideBrick'
import toggleWindow from './signals/toggleWindow'

const websocket = WebSocketsProvider({})

export default Module({
  state: {
    yoyth: {
      displayMap: (window.innerWidth > 500),
      displayNa: false,
      displayWall: true,
      displayLog: false,
      sizeMap: 20,
      sizeNa: 20,
      sizeLog: 20,
      increment: 5,
      minSize: 10,
      maxSize: 50,
      greaterMap: true,
      smallerMap: true,
      greaterLog: true,
      smallerLog: true,
      greaterNa: true,
      smallerNa: true,
      language: null,
      maximized: false,
      maximizedModule: '',
      markedNode: null,
      popup: null,
      content: '',
      wallInFocus: null,
      modals: [],
      settingsMenus: [],
      yourmapmaps: {},
      yourmapnodes: {},
      yourmaps: {},
      yourwalls: {},
      yournodes: {},
      yourlogs: {},
      yourattachments: {},
      yourframes: {},
      yourbricks: {},
      yournotes: {},
      yourmessages: {},
      yourdevices: {},
      identity: { yItem: { yMetaData: {yId: null} } },
      identities: {},
      brickEdited: {},
      loggedIn: false
    }
  },
  signals: {
    applyContent: applyContent,
    changeWindowSizes: changeWindowSizes,
    clearRequest: clearRequest,
    closeModal: closeModal,
    confirmDeleteNode: confirmDeleteNode,
    connectYourWebSocket: connectYourWebSocket,
    copyNode: copyNode,
    createYourObject: createYourObject,
    dbSearch: dbSearch,
    deleteNode: deleteNode,
    login: login,
    moveNode: moveNode,
    newMapNode: newMapNode,
    openModal: openModal,
    openNodeInfoModal: openNodeInfoModal,
    openWall: openWall,
    receiveData: receiveData,
    resizeModule: resizeModule,
    saveInfoAndCloseModal: saveInfoAndCloseModal,
    saveWallInfoAndNode: saveWallInfoAndNode,
    setContent: setContent,
    setMarkedNode: setMarkedNode,
    setPopup: setPopup,
    setState: setState,
    settingsMenu: settingsMenu,
    setWebSocketStatus: setWebSocketStatus,
    signalElement: signalElement,
    toggleExpanded: toggleExpanded,
    toggleHideBrick: toggleHideBrick,
    toggleWindow: toggleWindow

  },
  providers: {
    websocket
  },
  modules: {
    useragent: Useragent({
    // Use CSS media queries to determine
    // custom sizes available in your model.
    // They will be toggle between true/false in your
    // model
      media: {
        small: '(min-width: 600px)',
        medium: '(min-width: 1024px)',
        large: '(min-width: 1440px)',
        portrait: '(orientation: portrait)'
      },

      // store all feature tests in model
      feature: true,

      parse: {
      // parse useragent.browser from ua string
        browser: true,
        // parse useragent.device from ua string
        device: true
      },

      // check the docs at: https://github.com/HubSpot/offline#advanced
      offline: {
        checkOnLoad: false,
        interceptRequests: true,
        reconnect: {
          initialDelay: 3,
          delay: 1.5
        },
        requests: false
      },

      // update window size on resize
      window: true
    })
  }
})
