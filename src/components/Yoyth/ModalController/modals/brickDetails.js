import React from 'react'
import style from 'styled-components'
const _ = require('underscore')
const textInputx = require('../../shared/htmlHelpers.js').textInput
const checkBoxx = require('../../shared/htmlHelpers.js').checkBox
const List = require('../../shared/YoythStyledComponents.js').YoythList

export default function (_this) {

  const textInput = textInputx(_this)
  const checkBox = checkBoxx(_this)
  const returnAttributes = (stateGroup) => {
    return _this.state[stateGroup] ? {..._this.state[stateGroup]} : {}
  }

  return {
    yoythPicture: {
      // <picture>
      //  <source media="(min-width: 650px)" srcset="img_pink_flowers.jpg">
      //  <source media="(min-width: 465px)" srcset="img_white_flower.jpg">
      //  <img src="img_orange_flowers.jpg" alt="Flowers" style="width:auto;">
      // </picture>
      name: 'Bilde',
      name_en: 'Picture',
      component: 'YoythPicture', 
      element: () => {
        return (
          <List columns="50% 50%">
            {textInput('Picture url', 'yoythPicture', 'address', 'picture url')}
            {textInput('alt text', 'yoythPicture', 'alt', 'alt')}
            {textInput('Photo by prefix', 'yoythPicture', 'byprefix', 'byprefix')}
            {textInput('Photo by name', 'yoythPicture', 'byname', 'byname')}
            {textInput('Photo by ref', 'yoythPicture', 'byref', 'byref')}
            {textInput('On prefix', 'yoythPicture', 'onprefix', 'onprefix')}
            {textInput('On Name', 'yoythPicture', 'onname', 'onname')}
            {textInput('On ref', 'yoythPicture', 'onref', 'onref')}
          </List>
        )
      },
      obj: () => {
        return returnAttributes('yoythPicture')
      }
    },
    yoythVideo: {
      name: 'Video',
      component: 'YoythVideo', 
      element: () => {
        return (
          <div>
            {textInput('Video url', 'yoythVideo', 'address', 'picture url')}
            {checkBox('Frameborder?', 'yoythVideo', 'frameborder')}
          </div>
        )
      },
      obj: () => {
        return returnAttributes('yoythVideo')
      }      
    },
    yoythForm: {
      name: 'Input Form',
      component: 'YoythForm', 
      element: () => {
        return (
          <div>
            {textInput('Collection', 'yoythForm', 'collection', 'Database Collection Name')}
            {textInput('Style', 'yoythForm', 'style', 'Style in json format')}
            <p>Buttons</p>
            {checkBox('Previous', 'yoythForm', 'btn.Previous')}
            {checkBox('Next', 'yoythForm', 'btn.Next')}
            {checkBox('Save', 'yoythForm', 'btn.Save')}
            {checkBox('Update', 'yoythForm', 'btn.Update')}
            {checkBox('Cancel', 'yoythForm', 'btn.Cancel')}
            {checkBox('Search', 'yoythForm', 'btn.Search')}
          </div>
        )
      },
      obj: () => {
        let values = _this.state['yoythForm']
        let brickObj = {buttons: []}
        const keys = Object.keys(values)
        keys.forEach((key) => {
          let el = values[key]
          if (key.startsWith('btn.')) {
            if (el) {
              let b = key.substring(4)
              brickObj.buttons.push({name: b, function: b.substr(0,1).toLowerCase() + b.substring(1)})
            }
          } else {
            brickObj[key] = el
          }
        })
        return brickObj
      }
    },
    yoythHtml: {
      name: 'Html',
      component: 'YoythHtml', 
      element: () => {
        return (
          <div>
            <p>Ingen parametre til Html enda</p>
          </div>
        )
      },
      obj: () => {
        return returnAttributes('yoythHtml')
      }           
    }
  }
}
