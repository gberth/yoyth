import React from 'react';
import style from 'styled-components'
import {connect} from '@cerebral/react'
import {state, signal} from 'cerebral/tags'
import Logo from '../YoythLogo'
import posed from 'react-pose'
import { tween } from 'popmotion'
                       
const RollingBox = posed.div({
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1, 
    transition: props => tween({ ...props, duration: 1000 }) },
  }
)              

const RollingText = style(RollingBox)`
  position: fixed;
  top: 55px;
  left: 15px;
  color: red;
  font-size: 18px;
`

const Header = style.div`
  display: flex;
  justify-content: space-between;
  background-color: var(--yoyth-menu-background-color);
  min-height: var(--yoyth-header-height); 
  color: white;
  position: fixed;
  width: 100%;
  top: 0px;
  right: 0px;
  left: 8px;
  right: 8px;
`

const Language = style.div`
  margin-right: 30px;
  margin-top: 20px;
  font-family: 'montserrat';
  font-size: 24px;
  color: 'white';
`

const txts = [
  'Under Construction',
  'Under utvikling',
  'Call to action: Make YOYTH happen'
]

export default connect({
  language: state`yoyth.language`,
  toggleWindow: signal`toggleWindow`,
  setState: signal`setState`,
  displayMap: state`yoyth.displayMap`,
  //logout: signal`logout`
},
class YoythHeader extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      txtIx: 0,
      visible: true
    }
  }

  _shuffle () {
    if (this.state.visible) {
      this.setState({ visible: false});
    } else {
      let ix = this.state.txtIx >= txts.length - 1 ? 0 : this.state.txtIx + 1
      this.setState({ txtIx: ix, visible: true});
    }
  };

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  componentDidMount() {
    this.interval = setInterval(this._shuffle.bind(this), 2000);
  }
  toggleLanguage () {
    this.props.setState({stateVar: 'yoyth.language', stateVal: this.props.language ? null : '_en'})
  }

  icon (matIcon) {
    if (matIcon) {
      return <i style={{cursor: 'pointer', marginTop: '15px', fontSize: '40px'}} className='material-icons material-icons--outline' onClick={() => this.props.toggleWindow({window: 'Map'})}>{matIcon}</i>
    }
    return null
  }
  render () {
    return (
      <span>
      <Header>
        {this.props.displayMap ? <Logo logo='mediumRectangle' text='YOYTH' />: null}
        {this.icon('menu')}
        {!this.props.displayMap ? <Logo logo='mediumRectangle' text='YOYTH' />: null}
        <Language style={{cursor: 'pointer'}} onClick={() => this.toggleLanguage()}>{!this.props.language ? 'English' : 'Norsk'}</Language>
      </Header>
      <RollingText pose={this.state.visible ? 'visible' : 'hidden'}>{txts[this.state.txtIx]}</RollingText>
      </span>
    )
  }
})
