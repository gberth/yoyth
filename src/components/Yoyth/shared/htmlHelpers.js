import React from 'react'

export const getStateX = (_this) => {
  return (brick) => {
    let newState = {}
    if (_this.state[brick]) {
      newState[brick] = Object.assign({}, _this.state[brick])

    } else {
      newState[brick] = {}
    }
    return newState
  }
}

export const inputOnChange = (_this) => {
  const getState = getStateX(_this)
    return (brick, attr) => {
      return (event) => {
        let newState = getState(brick)
        newState[brick][attr] = event.target.value
      _this.setState(newState)
    }
  }
}

export const setStateFromDom = (_this) => {
  const getState = getStateX(_this)
  return (brick, attr) => {
    return (val) => {
      let newState = getState(brick)
      newState[brick][attr] = document.getElementById(attr).value
      _this.setState(newState)
    }
  }
}
export const setCheckStateFromDom = (_this) => {
  const getState = getStateX(_this)
  return (brick, attr) => {
    return (val) => {
      let newState = getState(brick)
      newState[brick][attr] = document.getElementById(attr).checked
      _this.setState(newState)
    }
  }
}

export const checkBox = (_this) => {
  const setCheckStateFromDomV = setCheckStateFromDom(_this)
  return (text, stateGroup, attr) => {
    return (
      <div>
        <a>{text}</a>
        <input type='checkbox' name={attr} id={attr}
        value={_this.state[stateGroup] && _this.state[stateGroup][attr] ? _this.state[stateGroup][attr] : ''} 
        onChange={setCheckStateFromDomV(stateGroup ,attr).bind(_this)} />
      </div>
    )
  }
}

export const textInput = (_this) => {
  const inputOnChangeV = inputOnChange(_this)
  return (text, stateGroup, attr, placeholder = '', options) => {
    return (
      <span>
        <div><a>{text}</a></div>
        <div>
        <input type={options && options.type ? options.type : 'text'} 
        name={attr} id={attr} placeholder={placeholder}
        value={_this.state[stateGroup] && _this.state[stateGroup][attr] ? _this.state[stateGroup][attr] : ''} 
        onChange={inputOnChangeV(stateGroup, attr).bind(_this)} />
        </div>
      </span>
    )
  }
}
