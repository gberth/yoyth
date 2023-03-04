import React from 'react';
import style from 'styled-components'

const Logo = style.div`
  /* Comment */
  font-family: 'montserrat'
  color: black;
  background-color: ${props => props.background ? props.background : 'var(--yoyth-menu-background-color)'};
  margin-left: 0px;
  height: 44px;
  border: none;
  float: left;
  width: auto;
  display: block;
 ${props => {
    if (props.logo === 'largeRectangle') {
      return (
        `height: 100px; 
        font-size: 88px; 
        border: 3px solid white;
        min-width: var(--yoyth-menu-min-width);
        color: white;
          `
      ) 
    } else 
    if (props.logo === 'mediumRectangle') {
      return (
        `
        height: var(--yoyth-header-height); 
        min-height: var(--yoyth-header-height); 
        font-size: 60px; 
        min-width: var(--yoyth-menu-min-width);
        color: white;
          `
      ) 
    } else 
    if (props.logo === 'smallCircle') {
      return (
        `height: 60px; 
        font-size: 50px; 
        border: 2px solid white; 
        border-radius: 35px;
        color: white;
        `
      ) 
    } else {
      return (
        'font-size: 31px; border: 2px solid black; border-radius: 50px;'
      ) 
    }
  }
}
`

const Text = style.div`
  vertical-align: middle;
  margin-top: 5px;
  margin-left: 10px;
  ${props => {
    if (props.txtlen && props.txtlen < 2) {
      return (
        `
        margin-top: 5px;
        `
      )
    }
  }
}
`

const logotxt = (txt) => {
  const spct = '\xa0\xa0\xa0'
  let spc = txt.length > 4 ? spct.substr(0, ((txt.length - 2) * 4)) : '\xa0'
  return (
    <Text txtlen={txt.length}>
    {txt + spc}
    </Text>
  )
}

export default class YoythLogo extends React.Component {

  render () {
    const white = this.props.white || null
    return (
      <Logo logo={this.props.logo} background={white}>
      {logotxt(this.props.text)}
      </Logo>
    )
  }
}
