import { Controller } from 'cerebral'
import Devtools from 'cerebral/devtools'
import YoythM from './modules/YoythM'

let devtools = null

console.dir(process.env)

if (process.env && process.env.NODE_ENV && process.env.NODE_ENV === 'local') {
  devtools = Devtools({ host: "localhost:8787" })
}

export default Controller(YoythM, {
  devtools 
})
