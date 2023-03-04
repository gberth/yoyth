import React, { Component, Fragment } from 'react'
import ReactDOM from 'react-dom'
import YoythResizer from './YoythResizer.js'
import { FaBars } from 'react-icons/fa'
import { CSSTransition } from 'react-transition-group'
import style from 'styled-components'

const FlexibleModal = style.div`
  position: fixed;
  z-index: 1000;
  border: 1px solid #ccc;
  background: white;
`
const FlexibleModalReboundBtn = style.div`
  display: ${props => props.hidden ? 'hidden' : 'block'};
  position: absolute;
  z-index: 1000;
  bottom: 0;
  width: 50px;
  height: 30px;
`
const FlexibleModalDragArea = style.div`
  background: rgba(45, 142, 91, 0.6);
  height: 50px;
  position:absolute;
  right:0;
  top:0;
  cursor:move;
`

const FlexibleModalDragAreaLeft = style.div`

`

const FlexibleModalDragAreaBottom = style.div`

`

const FlexibleModalDragAreaRight = style.div`

`

const FlexibleModalMask = style.div`
  position: fixed;
  height: 100%;
  background: rgba(55, 55, 55, 0.1);
  top:0;
  left:0;
  right:0;
  bottom:0;
`

class Modal extends Component {
  render () {
    const {
      isDragging,
      width,
      height,
      top,
      left,
      isOpen,
      isMinimised,
      onRequestRecover
    } = this.props
    if (isOpen) {
      return (
        <Fragment>
          <CSSTransition
            in={!isMinimised}
            timeout={300}
            classNames='minimise'
            unmountOnExit
          >
            <FlexibleModal ref={node => {
              this.node = node
            }}
            draggable={isDragging}
            style={{ width, height, top, left }}
            >
              {this.props.children}
            </FlexibleModal>
          </CSSTransition>
          {isMinimised &&
            <FlexibleModalReboundBtn
              onClick={onRequestRecover}
            >
              <FaBars />
            </FlexibleModalReboundBtn>}
        </Fragment>
      )
      // return (
      //   <div
      //     ref={node => {
      //       this.node = node;
      //     }}
      //     draggable={isDragging}
      //     style={{ width, height, top, left }}
      //     className={isMinimised ? "flexible-modal-hidden" : "flexible-modal"}
      //   >
      //     <div>
      //       {this.props.children}
      //     </div>
      //     <button
      //       className={
      //         isMinimised
      //           ? "flexible-modal-rebound-btn"
      //           : "flexible-modal-rebound-btn-hidden"
      //       }
      //       onClick={onRequestRecover}
      //     >
      //       <FontAwesome.FaBars />
      //     </button>
      //   </div>
      // );
    } else {
      return null
    }
  }
}

class YoythModal extends Component {
  constructor (props) {
    super(props)
    this.state = {
      isDragging: false,
      isResizing: false,
      top:
        this.props.top !== undefined
          ? this.props.top
          : this.props.initHeight
            ? window.innerHeight / 2 - this.props.initHeight / 2 - 50
            : window.innerHeight / 2 - 400 / 2 - 50,
      left:
        this.props.left !== undefined
          ? this.props.left
          : this.props.initWidth
            ? window.innerWidth / 2 - this.props.initWidth / 2 - 21
            : window.innerWidth / 2 - 800 / 2 - 21,
      width: this.props.initWidth ? this.props.initWidth : 800,
      height: this.props.initHeight ? this.props.initHeight : 400,
      rel: null
    }
    this.updateStateResizing = this.updateStateResizing.bind(this)
    this.funcResizing = this.funcResizing.bind(this)
    this.onMouseMoveX = (e) => this.onMouseMove(e)
    this.onMouseUpX = (e) => this.onMouseUp(e)
    this.pressKeyX = (e) => this.pressKey(e)
  }

  componentDidMount () {
    document.addEventListener('mousemove', this.onMouseMoveX)
    document.addEventListener('mouseup', this.onMouseUpX)
    document.addEventListener('keydown', this.pressKeyX)
  }

  componentWillUnmount () {
    document.removeEventListener('mousemove', this.onMouseMoveX)
    document.removeEventListener('mouseup', this.onMouseUpX)
    document.removeEventListener('keydown', this.pressKeyX)
  }

  componentDidUpdate (props, state) {
    if (!this.state.isDragging && state.isDragging) {
    }
  }

  onMouseDown (e) {
    // only left mouse button
    if (e.button !== 0) return
    var pos = ReactDOM.findDOMNode(this.node_modal)
    this.setState({
      isDragging: true,
      rel: {
        x: e.pageX - pos.offsetLeft,
        y: e.pageY - pos.offsetTop
      }
    })
    e.stopPropagation()
    e.preventDefault()
  }

  onMouseUp (e) {
    document.removeEventListener('mousemove', this.onMouseMove.bind(this))
    this.setState({ isDragging: false })
    this.setState({ isResizing: false })
    e.stopPropagation()
    e.preventDefault()
  }

  onMouseMove (e) {
    const {
      disableMove,
      disableVerticalMove,
      disableHorizontalMove
    } = this.props
    if (this.state.isDragging) {
      if (disableMove) {
      } else if (disableVerticalMove && disableHorizontalMove) {
      } else if (!disableVerticalMove && disableHorizontalMove) {
        this.setState({
          top: e.pageY - this.state.rel.y
        })
      } else if (disableVerticalMove && !disableHorizontalMove) {
        this.setState({
          left: e.pageX - this.state.rel.x
        })
      } else if (!disableVerticalMove && !disableHorizontalMove) {
        this.setState({
          left: e.pageX - this.state.rel.x,
          top: e.pageY - this.state.rel.y
        })
      }
    } else if (this.state.isResizing) {
      this.funcResizing(e.clientX, e.clientY)
    } else {
      return
    }
    e.stopPropagation()
    e.preventDefault()
  }

  updateStateResizing (isResizing) {
    this.setState({ isResizing })
  }

  funcResizing (clientX, clientY) {
    const {
      minWidth: mWidth,
      minHeight: mHeight,
      disableVerticalResize,
      disableHorizontalResize
    } = this.props
    let node = ReactDOM.findDOMNode(this.node_modal)
    let minWidth = mWidth ? mWidth : 200
    let minHeight = mHeight ? mHeight : 100
    if (!disableHorizontalResize && clientX > node.offsetLeft + minWidth) {
      this.setState({
        width: clientX - node.offsetLeft + 16 / 2
      })
    }
    if (!disableVerticalResize && clientY > node.offsetTop + minHeight) {
      this.setState({
        height: clientY - node.offsetTop + 16 / 2
      })
    }
  }

  updateStateDragging (isDragging) {
    this.setState({ isDragging })
  }

  pressKey (e) {
    const {
      onRequestClose,
      disableResize,
      disableMove,
      disableVerticalMove,
      disableHorizontalMove,
      disableKeyMove
    } = this.props
    if (e.ctrlKey) {
      switch (e.keyCode) {
        case 37:
          !disableResize &&
            this.setState(prevState => ({ width: prevState.width - 20 }))
          break
        case 38:
          !disableResize &&
            this.setState(prevState => ({ height: prevState.height - 20 }))
          break
        case 39:
          !disableResize &&
            this.setState(prevState => ({ width: prevState.width + 20 }))
          break
        case 40:
          !disableResize &&
            this.setState(prevState => ({ height: prevState.height + 20 }))
          break
      }
    } else {
      if (!disableKeyMove) {}
      switch (e.keyCode) {
        case 27:
          onRequestClose()
          break
        case 37:
          if (!disableMove &&
            !disableHorizontalMove && !disableKeyMove) {
            this.setState(prevState => ({ left: prevState.left - 20 }))
          }
          break
        case 38:
          if (!disableMove &&
            !disableVerticalMove && !disableKeyMove) {
            this.setState(prevState => ({ top: prevState.top - 20 }))
          }
          break
        case 39:
          if (!disableMove &&
            !disableHorizontalMove && !disableKeyMove) {
            this.setState(prevState => ({ left: prevState.left + 20 }))
          }
          break
        case 40:
          if (!disableMove &&
            !disableVerticalMove && !disableKeyMove) {
            this.setState(prevState => ({ top: prevState.top + 20 }))
          }
          break
      }
    }
  }

  render () {
    const {
      isOpen,
      isMinimised,
      onRequestClose,
      onRequestMinimise,
      onRequestRecover,
      disableResize
    } = this.props
    return (
      <div>
        {/*this mask is a must*/}
        {isOpen &&
          !isMinimised &&
          <FlexibleModalMask
            onClick={onRequestMinimise || onRequestClose}
          />}
        <Modal
          width={this.state.width}
          height={this.state.height}
          top={this.state.top}
          left={this.state.left}
          isDragging={this.state.isDragging}
          onRequestRecover={onRequestRecover}
          isMinimised={isMinimised}
          isOpen={isOpen}
          updateStateDragging={this.updateStateDragging.bind(this)}
          transitionName='modal-anim'
          ref={node => {
            this.node_modal = node
          }}
        >
          {this.props.children}
          <FlexibleModalDragArea
            onMouseDown={this.onMouseDown.bind(this)}
            style={{
              width: this.state.width
            }}
            ref={dragArea => {
              this.dragArea = dragArea
            }}
          />
          <FlexibleModalDragAreaLeft
            onMouseDown={this.onMouseDown.bind(this)}
            style={{
              height: this.state.height
            }}
            ref={dragArea => {
              this.dragArea2 = dragArea
            }}
          />
          <FlexibleModalDragAreaBottom
            onMouseDown={this.onMouseDown.bind(this)}
            style={{
              width: this.state.width
            }}
            ref={dragArea => {
              this.dragArea3 = dragArea
            }}
          />
          <FlexibleModalDragAreaRight
            onMouseDown={this.onMouseDown.bind(this)}
            style={{
              height: this.state.height
            }}
            ref={dragArea => {
              this.dragArea4 = dragArea
            }}
          />
          {!disableResize &&
            <YoythResizer updateStateResizing={this.updateStateResizing} />}
        </Modal>
      </div>
    )
  }
}

export default YoythModal
