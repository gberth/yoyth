import React from 'react'
import ws from 'ws'
import {connect} from '@cerebral/react'
import {state, signal} from 'cerebral/tags'

export default connect({
  yourWsUrl: state`yourwsurs`,
  yourWsIn: state`yourwsin`,
  yourWsOut: state`yourwsout`,
  yourWsIdentity: state`yourwsidentity`
},
class YourWsConnection extends React.Component {

  render () {
    console.log('YourWsConnection', this.props.signals)
    return
  }
}
)
