import React from 'react';
import WallSettingsMenu from './settingMenus/WallSettingsMenu/WallSettingsMenu'
import {connect} from '@cerebral/react'
import {state} from 'cerebral/tags'

const menus = {
  Wall: WallSettingsMenu
}

export default connect({
  allmenus: state`yoyth.settingsMenus`
},
class SettingsMenuController extends React.Component {
  renderMenu (menuObj, index) {
    const MenuComponent = menus[menuObj]
    return <MenuComponent menuObj={menuObj} key={'menu' + index} index={index} />
  }

  render () {
    return (
      <div>
        {this.props.allmenus.map((menu, index) => this.renderMenu(menu, index))}
      </div>
    )
  }
}
)
