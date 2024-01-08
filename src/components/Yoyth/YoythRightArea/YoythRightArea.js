import React from 'react';
import style from 'styled-components'
import { connect } from '@cerebral/react'
import { state, signal } from 'cerebral/tags'
import YourWalls from '../YourWalls'
import Logo from '../YoythLogo'

const RightArea = style.div`
  background-color: var(--yoyth-wall-background-color);
`

const Header = style.div`
  display: flex;
  justify-content: space-between;
  background-color: var(--yoyth-menu-background-color);
  min-height: var(--yoyth-header-height); 
  color: white;
`
const Footer = style.div`
  background-color: var(--yoyth-menu-background-color);
  height: var(--yoyth-header-height);
  text-align: center;
`
const Language = style.div`
  margin-right: 30px;
  margin-top: 20px;
  font-family: 'montserrat';
  font-size: 24px;
  color: 'white';
`
export default connect({
  profile: state`yoyth.yourprofile`,
  identity: state`yoyth.identity`,
  loggedIn: state`yoyth.loggedIn`,
  wsstate: state`yoyth.wsstate`,
  dbSearch: signal`dbSearch`,
  language: state`yoyth.language`,
  toggleWindow: signal`toggleWindow`,
  setState: signal`setState`,
  displayMap: state`yoyth.displayMap`,
  //logout: signal`logout`
},
  class YoythRightArea extends React.Component {
    render() {
      return (
        <RightArea>
          <YourWalls />
          <Footer>
            <br />
          Yoyth is a startup, and currently in development
          <br />
           © 2023 Yoyth - all rights reserved -Org.nr. 921010923
        </Footer>
        </RightArea>
      )
    }
  })
