import React from 'react'
import PropTypes from 'prop-types'
import style from 'styled-components'
import ModalController from './ModalController'
import YoythLeftArea from './YoythLeftArea'
import YoythRightArea from './YoythRightArea'
import YoythHeader from './YoythHeader'
import { connect } from '@cerebral/react'
import { state, signal } from 'cerebral/tags'
const YoythCss = style.div`
--red: #ff6f69;
--beige: #ffeead;
--yellow: #ffcc5c;
--webkit-transition: all 0.3s ease-out;
--moz-transition: all 0.3s ease-out;
--ms-transition: all 0.3s ease-out;
--o-transition: all 0.3s ease-out;
--transition: all 0.3s ease-out;
--yoyth-grid-gap: 0px;
--yoyth-row-grid-gap: 20px;
--yoyth-grid-template-columns: ${props => props.map ? 'auto auto' : 'auto'};
--yoyth-grid-wall-template-columns: repeat(8, 1fr);
--yoyth-grid-template-rows: auto;
--yoyth-menu-background-color: #2ABBC1;
--yoyth-wall-background-color: #FFFFFF;
--yoyth-menu-min-width: 250px !important;
--yoyth-header-height: 70px;
--yoyth-menu-min-height: 800px;
  @media (max-width: 700px) {
    --yoyth-grid-wall-template-columns: repeat(4, 1fr);
  }
  @media (min-width: 700px) {
    --yoyth-grid-template-columns: ${props => props.map ? '30% auto' : 'auto'};
  }
  @media (min-width: 1000px) {
    --yoyth-grid-template-columns: ${props => props.map ? '25% auto' : 'auto'};
  }
  @media (min-width: 1500px) {
    --yoyth-grid-template-columns: ${props => props.map ? '20% auto' : 'auto'};
  }
`
const YoythDiv = style.div`
  display: grid;
  grid-gap: var(--yoyth-grid-gap);
  grid-template-columns: var(--yoyth-grid-template-columns);
  grid-template-rows: var(--yoyth-grid-template-rows);
  margin-top: var(--yoyth-header-height)
`


export default connect({
  wallInFocus: state`yoyth.wallInFocus`,
  yourmaps: state`yoyth.yourmaps`,
  yourwalls: state`yoyth.yourwalls`,
  yourmapnodes: state`yoyth.yourmapnodes`,
  wsstate: state`yoyth.wsstate`,
  displayMap: state`yoyth.displayMap`,
  displayNa: state`yoyth.displayNa`,
  displayWall: state`yoyth.displayWall`,
  displayLog: state`yoyth.displayLog`,
  sizeMap: state`yoyth.sizeMap`,
  sizeNa: state`yoyth.sizeNa`,
  sizeLog: state`yoyth.sizeLog`,
  increment: state`yoyth.increment`,
  minSize: state`yoyth.minSize`,
  maxSize: state`yoyth.maxSize`,
  greaterMap: state`yoyth.greaterMap`,
  smallerMap: state`yoyth.smallerMap`,
  greaterLog: state`yoyth.greaterLog`,
  smallerLog: state`yoyth.smallerLog`,
  greaterNa: state`yoyth.greaterNa`,
  smallerNa: state`yoyth.smallerNa`,
  maximized: state`yoyth.maximized`,
  modals: state`yoyth.modals`,
  settingsMenus: state`yoyth.settingsMenus`,
  maximizedModule: state`yoyth.maximizedModule`,
  loggedIn: state`yoyth.loggedIn`,
  initialData: state`yoyth.initialData`,
  receiveData: signal`receiveData`,
  connectYourWebSocket: signal`connectYourWebSocket`,
  setPopup: signal`setPopup`,
  dbSearch: signal`dbSearch`,
  setState: signal`setState`
},
  class Yoyth extends React.Component {

    componentDidMount() {
      this.props.connectYourWebSocket()
    }
    clearPopup() {
      this.props.setPopup({ id: '', prefix: '', x: null, y: null })
    }

    loginOrRegister() {
      return (
        <YoythDiv>
          {this.props.displayMap ? <YoythLeftArea /> : null}
          <YoythRightArea />
        </YoythDiv>
      )

    }

    setFirstWall() {
      if (this.props.yourmaps) {
        // if not identity logged in use first
        const mapkeys = Object.keys(this.props.yourmaps)
        if (mapkeys.length === 0) return false
        let wall
        mapkeys.forEach((key) => {
          const map = this.props.yourmaps[key]
          if (!wall) {
            wall = this.props.yourmapnodes[map.yItem.yContent.nodeId].yItem.yMetaData.wallRef
          }
        })
        this.props.setState({ stateVar: 'yoyth.wallInFocus', stateVal: wall })
        return true
      }
    }

    getInitialData() {
      console.log('get initial data')
      this.props.dbSearch({ queryData: { collections: ['identity', 'yourmaps', 'yourmapnodes', 'yourwalls', 'yourbricks', 'yourdocuments'] } })
      this.props.setState({ stateVar: 'yoyth.initialData', stateVal: true })
      //this.props.dbSearch({yOwner: 'yoyth', queryData: {collections: ['yourdocumentation']}})
    }

    yourYoyth() {
      return (
        <YoythDiv>
          {this.props.displayMap ? <YoythLeftArea /> : null}
          <YoythRightArea />
        </YoythDiv>
      )
    }

    render() {
      console.dir(this.props)
      if (this.props.wsstate === 'connected' && this.props.loggedIn && !this.props.initialData) {
        this.getInitialData()
      }
      if (this.props.yourwalls && !this.props.wallInFocus) {
        if (this.setFirstWall()) return null
      }
      return (
        <YoythCss map={this.props.displayMap}>
          <span onClick={() => this.clearPopup()}>
            <div>
              <YoythHeader />
              <ModalController />
              {
                this.props.loggedIn && this.props.wsstate === 'connected' ?
                  this.yourYoyth()
                  :
                  this.loginOrRegister()
              }
            </div>
          </span>
        </YoythCss>
      )
    }
  }
)
