import React from 'react';
import style from 'styled-components'
import { connect } from '@cerebral/react'
import { state, signal } from 'cerebral/tags'
import Logo from '../YoythLogo'

const FooterLogo = style.div`
  grid-column: 1 / -1;
  background-color: var(--yoyth-menu-background-color);
  height: 100%;
  margin-left: 20px;
`
const FooterTxt = style.div`
  background-color: var(--yoyth-menu-background-color);
  height: var(--yoyth-header-height);
  text-align: center;
`

export default connect({
  profile: state`yoyth.yourprofile`,
  identity: state`yoyth.identity`,
  loggedIn: state`yoyth.loggedIn`,
  wsstate: state`yoyth.wsstate`,
  dbSearch: signal`dbSearch`
  //logout: signal`logout`
},
  class YoythFooter extends React.Component {

    render() {
      return (
        <FooterTxt>
          <br />
          Yoyth is a startup, and currently in development
          <br />
           © 2024 Yoyth - all rights reserved - Org.nr. 921010923
        </FooterTxt>
      )
    }
  })
