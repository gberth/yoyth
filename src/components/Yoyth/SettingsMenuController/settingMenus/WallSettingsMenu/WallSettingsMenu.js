import React from 'react'
import styles from './styles.css'
import {connect} from '@cerebral/react'
import {state} from 'cerebral/tags'
const ReactMenuAim = require('react-menu-aim')

const options = [
  'save',
  'cancel'
]
export default connect({
  markedNode: state`yoyth.markedNode`
},
class WallSettingsMenu extends React.Component {

  constructor (props) {
    super(props)
    this.state = { subMenuDirection: 'left', activeMenuIndex: 0 }
  }

  componentWillMount () {
    ReactMenuAim.initMenuAim({
      submenuDirection: this.props.submenuDirection,
      menuSelector: '.menu',
      delay: 300,
      tolerance: 75
    })
  }

  handleSwitchMenuIndex (index) {
    this.setState({
      activeMenuIndex: index
    })
  }

  render () {
    var self = this
    var containerClassName = 'menu-container ' + this.props.submenuDirection

    var subMenuStyle = {}
    if (this.props.submenuDirection === 'below') {
      subMenuStyle.left = this.state.activeMenuIndex * 140
    }

    return (
      <div className={containerClassName}>
        <ul className='menu' onMouseLeave={this.handleMouseLeaveMenu}>
          {this.props.menuData.map(function (menu, index) {
            var className = 'menu-item'
            if (index === self.state.activeMenuIndex) {
              className += ' active'
            }

            return (
              <li className={className} key={index}
                onMouseEnter={function () {
                  self.handleMouseEnterRow.call(self, index, self.handleSwitchMenuIndex)
                }}>
                {menu.name}
              </li>
            )
          })}
        </ul>
        <ul className='sub-menu' style={subMenuStyle}>
          {this.props.menuData[this.state.activeMenuIndex].subMenu.map(function (subMenu, index) {
            return (
              <li className='sub-menu-item' key={index}>{subMenu}</li>
            )
          })}
        </ul>
      </div>
    )
  }
}
)
