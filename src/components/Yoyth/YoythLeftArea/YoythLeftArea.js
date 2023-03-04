import React from 'react';
import style from 'styled-components'
import {connect} from '@cerebral/react'
import {state, signal} from 'cerebral/tags'
import Logo from '../YoythLogo'
import YourMaps from '../YourMaps'
import YoythLogin from '../YoythLogin'



const Left = style.div`
  background-color: var(--yoyth-menu-background-color);
  grid-column: auto / auto;
  min-width: var(--yoyth-menu-min-width);
  min-height: var(--yoyth-menu-min-height);

`
const Avatar = style.div`
  margin-left: 20px;
  height: 100%;
  color: white;
`

const AvatarAndName = style.div`
  display: block;
  width: 100%;
  min-width: var(--yoyth-menu-min-width);
  min-height: 65px;
`
const Name = style.div`
  margin-top: 90px;
  text-align: center;
  color: white;
  min-height: 65px;
  height: 65px;
`
export default connect({
  profile: state`yoyth.yourprofile`,
  identity: state`yoyth.identity`,
  loggedIn: state`yoyth.loggedIn`,
  wsstate: state`yoyth.wsstate`
  //logout: signal`logout`
},
class YoythLeftArea extends React.Component {
  constructor (props) {
    super(props)
  }

  render () {
    let name = ''

    if (this.props.profile) {
      name = this.props.profile[this.props.identity.yItem.yMetaData.yId].yItem.yContent.name
    }
    return (
      <Left>
        <AvatarAndName>
          <Avatar>
          </Avatar>
          <Name>{name}</Name>
        </AvatarAndName>
        { !this.props.loggedIn && this.props.wsstate === 'connected' ?
          <YoythLogin />
          :
          null
        }
        <YourMaps />
      </Left>
    )
  }
})
