import saveInfoAndCloseModal from '../actions/saveInfoAndCloseModal'
import storeData from '../actions/storeData'
import updateData from '../actions/updateData'
import putNodeInMap from '../actions/putNodeInMap'
export default [
  saveInfoAndCloseModal, {
    create: [putNodeInMap],
    continue: []
  },
  updateData,
  storeData
]
