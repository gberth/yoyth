import React from 'react';
import styles from './styles.css'
import {signal} from 'cerebral/tags'
import {connect} from '@cerebral/react'

export default connect({
  settingsMenu: signal`settingsMenu`,
  resizeModule: signal`resizeModule`
},

class ModuleHeader extends React.Component {

  render () {
    return (
      <div className={styles.header}>
        <ul>
          <li>
            <i className={styles.iconMaxMin + ' ' + styles.iconLink} onClick={() => this.props.resizeModule({ window: this.props.yourWsModule })} style={{ margin: 10 }} />
          </li>
          <li className={styles.search}>
            <i className={styles.iconSettings + ' ' + styles.iconLink} onClick={() => this.props.settingsMenu({ window: this.props.yourWsModule })} style={{ margin: 10 }} />
          </li>
        </ul>
      </div>
    )
  }
}
)
