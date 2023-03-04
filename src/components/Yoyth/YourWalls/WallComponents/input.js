import React from 'react'
import DatePicker from 'react-datepicker'
import style from 'styled-components'
import 'react-datepicker/dist/react-datepicker.css'
const moment = require('moment')
const _ = require('underscore')

const Textarea = style.textarea`
  color: green;
`

export default function (_this) {
  const setState = (val) => {
    val.formChanged = true
    _this.setState(val)
  }

  const inputOnChange = (attr) => {
    const id = 'yAttr'+attr
    return (event) => {
      let ret = {}
      ret[id] = event.target.value
      setState(ret)
    }
  }

  const setDateValue = (name) => {
    const id = 'yAttr'+name
    return (val) => {
      const newState = {}
      newState[id] = val
      setState(newState)
    }
  }
  const setStateFromDom = (name) => {
    const id = 'yAttr'+name
    return (val) => {
      const newState = {}
      newState[id] = document.getElementById(name).value
      setState(newState)
    }
  }
  return {
    input: (inputAttr, value) => {
      return (
        <input type={inputAttr.type} name={inputAttr.name} placeholder={inputAttr.placeholder}
          value={value ? value : ''} onChange={inputOnChange(inputAttr.attribute).bind(_this)} />
      )
    },
    p: (inputAttr) => {
      return (
        <p>{inputAttr.text}</p>
      )
    },
    h1: (inputAttr) => {
      return (
        <h1 style={inputAttr.style}>{inputAttr.text}</h1>
      )
    },
    textarea: (inputAttr, value) => {
      return (
        <Textarea onChange={inputOnChange(inputAttr.attribute).bind(_this)}
          value={value ? value : ''} rows={inputAttr.rows} cols={inputAttr.cols} placeholder={inputAttr.placeholder} />
      )
    },
    datepicker: (inputAttr, value) => {
      // moment("2013-01-02", "YYYY-MM-DD", true)
      const val = moment.isMoment(value) ? value : (value ? moment(value, 'DD-MM-YYYY') : moment())
      return (
        <DatePicker
          dateFormat='DD-MM-YYYY'
          selected={val}
          onChange={setDateValue(inputAttr.attribute)}
        />
      )
    },
    selection: (inputAttr, value) => {
      return (
        <select style={inputAttr.style} onChange={setStateFromDom(inputAttr.attribute)} id={inputAttr.attribute}>
          {<option value={null}>-</option>}
          {_.map(inputAttr.selections, (opt) => {
            if (opt !== value) {
              return (
                <option key={opt} value={opt}>{opt}</option>
              )
            } else {
              return (
                <option value={opt} selected>{opt}</option>
              )
            }
          })}
        </select>
      )
    },
    search: (inputAttr) => {
      return (
        <i style={inputAttr.style} className='material-icons material-icons--outline' onClick={() => setState({search: inputAttr.search})}/>
      )
    }
  }  
}
