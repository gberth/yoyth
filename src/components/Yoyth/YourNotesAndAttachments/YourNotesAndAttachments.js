import React from 'react';
import ModuleHeader from '../ModuleHeader/ModuleHeader'
import styles from './styles.css'
import {connect} from '@cerebral/react'

export default connect({

},

class YourNotesAndAttachments extends React.Component {

  render () {
    return (
      <span className={styles.yourNotesAndAttachemts}>
        <ModuleHeader yourWsModule='Na' />
        <span>
          <p>Notes and attachment arera</p>
        </span>
      </span>
    )
  }
}
)
