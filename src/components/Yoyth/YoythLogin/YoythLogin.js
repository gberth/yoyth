import React from 'react';
import {connect} from '@cerebral/react'
import {state, signal} from 'cerebral/tags'
const Button = require('../shared/YoythStyledComponents.js').YoythButton

export default connect({
  loggedIn: state`yoyth.loggedIn`,
  login: signal`login`,
  wsstate: state`yoyth.wsstate`
},
class YoythLogin extends React.Component {
  setUserid (event) {
    this.setState({ identity: event.target.value })
  }

  setPassword (event) {
    this.setState({ verify: event.target.value })
  }

  handleLogin (event) {
    if (this.state && this.state.identity) {
      this.props.login({identity: this.state.identity, verify: this.state.verify})
    }
  }

  render () {
    return (
      this.props.wsstate === 'connected' ? 
      <div style={{color: 'white', fontFamily: 'montserrat', fontSize: '20px', marginLeft: '15px'}}>
      Userid     :
      <br />
      <input
        type='text'
        onChange={this.setUserid.bind(this)}
      />
      <br />
      Password   : 
      <br />
      <input
        type='password'
        onChange={this.setPassword.bind(this)}
      />
      <br />
      <br />
      <Button onClick={this.handleLogin.bind(this)}>Login</Button>
      <br />
      <br />
      </div>
      :
      null)
  }
})
