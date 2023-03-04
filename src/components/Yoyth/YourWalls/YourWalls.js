import React, { Component } from 'react'
import { connect } from '@cerebral/react'
import { state, signal } from 'cerebral/tags'
import style from 'styled-components'
import YourBalanceGraph from './WallComponents/YourBalanceGraph'
import YourQuillEditor from './WallComponents/YourQuillEditor'
import YoythEntities from './WallComponents/YoythEntities'
import YoythHtmlArticle from './WallComponents/YoythHtmlArticle'
import YoythPicture from './WallComponents/YoythPicture'
import YoythVideo from './WallComponents/YoythVideo'
import YoythHtml from './WallComponents/YoythHtml'
import YoythDivCols from './WallComponents/YoythDivCols'
import YoythForm from './WallComponents/YoythForm'
import YoythAdvancedForm from './WallComponents/YoythAdvancedForm'
import YoythList from './WallComponents/YoythList'
import YoythPictures from './WallComponents/YoythPictures'
import YoythSlides from './WallComponents/YoythSlides'
import YoythSpeech from './WallComponents/YoythSpeech'
const StoryNav = require('../shared/YoythStyledComponents.js').YoythStoryNav
const _ = require('underscore')

const WallDiv = style.div`
  width: 100%;
  background-image: url(${props => props.background ? props.background : null});
  background-repeat: no-repeat;
  background-size: 1200px 800px;
  min-height: 1000px;
`

const RowDiv = style.div`
  display: grid;
  grid-gap: var(--yoyth-row-grid-gap);
  grid-template-columns: var(--yoyth-grid-wall-template-columns);
  grid-template-rows: var(--yoyth-grid-template-rows);
`

const BrickDiv = style.div`
  min-width: 0;
  grid-area: span 1 / span ${props => props.cols};
  &:hover {
    display: block;
    border: ${props => props.write ? '1px solid black' : 'none'};
    border-radius: 5px;
  }
`;

const BrickInfo = style.div`
  display: none;
  ${BrickDiv}:hover & {
    text-align: right;
    display: grid;
    grid-template-columns: auto auto auto
    border: 1px solid black;
    height: 25px;
  }
`
const BrickInfoOff = style.div`
  display: grid;
  grid-template-columns: auto auto auto
  height: 28px;
  ${BrickDiv}:hover & {
    display: none;
  }
`

const BrickHeader = style.div`
  text-align: center;
  }
`
const brickComponents = {
  YourBalanceGraph: YourBalanceGraph,
  YourQuillEditor: YourQuillEditor,
  YoythEntities: YoythEntities,
  YoythPicture: YoythPicture,
  YoythPictures: YoythPictures,
  YoythSlides: YoythSlides,
  YoythVideo: YoythVideo,  
  YoythHtmlArticle: YoythHtmlArticle,
  YoythDivCols: YoythDivCols,
  YoythForm: YoythForm,
  YoythSpeech: YoythSpeech,
  YoythAdvancedForm: YoythAdvancedForm,
  YoythList: YoythList,
  YoythHtml: YoythHtml
}
export default connect(
  {
    identity: state`yoyth.identity`,
    popup: state`yoyth.popup`,
    language: state`yoyth.language`,
    setState: signal`setState`,
    wallInFocus: state`yoyth.wallInFocus`,
    yourwalls: state`yoyth.yourwalls`,
    yourbricks: state`yoyth.yourbricks`,
    contextMenu: state`yoyth.contextMenu`,
    toggleHideBrick: signal`toggleHideBrick`
  },

  class YourWalls extends Component {
    constructor (props) {
      super()
      this.menu = {}
      this.observeResize = false
      this.story = false
      this.onResize = () => this.onwallresize()
      this.state = {
        storyPtrUpdate: 0
      }
      this.storyPtr = 0
    }

    renderRow (row, ix) {
      this.rowIx = ix
      this.startCol = 1
      if (this.story && this.storyPtr !== ix) return null
      return (
        <RowDiv key={'row' + ix}>
          {_.map(row.bricks, this.renderComponent, this)}
        </RowDiv> 
      )
    }
    toggleBrick (matIcon, brick) {
      if (matIcon) {
        return <div title='Close brick' style={{cursor: 'pointer', textAlign: 'right'}}
          className='material-icons material-icons--outline'
          onClick={() => this.props.toggleHideBrick({wall: this.wall.yItem.yMetaData.yId, brick: brick})}>{matIcon}</div>
      }
      return null
    }

    doNavigate (way) {
      let stp = (way === 'forward' ? this.storyPtr + 1 : this.storyPtr - 1)
      if (stp < 0) {
        this.props.setState({stateVar: 'yoyth.wallInFocus', stateVal: this.previousWall.wallRef})
      } else
      if (stp >= this.wallRows) {
        this.props.setState({stateVar: 'yoyth.wallInFocus', stateVal: this.nextWall.wallRef})
      } else {
        this.storyPtr = stp
        this.setState({storyPtrUpdate: stp})
      }
    } 

    navigate (args) {
      let title
      if (args.title instanceof Object) {
        title = this.props.language ? args.title['title' + this.props.language] : args.title.title
      }
      return <img title={title || args.way} style={{cursor: 'pointer', opacity: '0.1'}} onClick={() => this.doNavigate.bind(this)(args.way)}
        src={'/' + args.way + '.svg'} width={'75px'} height={'75px'} alt={args.way} />
    }

    showcontextMenu (event, brick) {
      event.preventDefault()
      this.props.setState({stateVar: 'yoyth.contextMenu', stateVal: {
        component: 'yourbricks',
        id: brick.brickId,
        x: event.clientX,
        y: event.clientY,
        next: true
      }})
    }

    contextMenu (matIcon, brick) {
      if (matIcon) {
        return (
          <div id={brick.brickId} title='Menu' style={{cursor: 'pointer', textAlign: 'left'}}
            className='material-icons material-icons--outline'
            onClick={(event) => this.showcontextMenu(event, brick)}>{matIcon}
          </div>
        )
      }
      return null
    }
    renderComponent (brick, ix) {
      const brickProps = this.props.yourbricks[brick.brickId]
      const BrickComponent = brickComponents[brickProps.yItem.yContent.brick.component]
      const languageOnly = brickProps.yItem.yContent.brick.languageOnly
      const languageDefined = typeof languageOnly !== 'undefined'
      if (languageDefined) {
      }
      if (!this.hiddenBricks[brick.brickId]) {
        if ((!languageDefined) ||
          (languageOnly === this.props.language) || (languageOnly === '' && !this.props.language)) {
          return (
            <BrickDiv key={'br' + this.rowIx + 'c' + ix} write={this.wallAccess === 'CRUD'} cols={brickProps.yItem.yContent.brick.cols ? brickProps.yItem.yContent.brick.cols : 3}>
              {this.wallAccess === 'CRUD'
                ? <span>
                  <BrickInfo>
                    {this.contextMenu('menu', brick)}
                    <BrickHeader>{brick.brickHeader}</BrickHeader>
                    {this.toggleBrick('clear', brick)}
                  </BrickInfo>
                  <BrickInfoOff>
                    <BrickHeader />
                  </BrickInfoOff>
                </span>
                : null}
              <BrickComponent id={'r' + this.rowIx + 'c' + ix} 
                key={'kr' + this.rowIx + 'c' + ix}
                brickId={brick.brickId}
                {...brickProps.yItem.yContent.brick.props} />
            </BrickDiv>
          )
        }
      }
    }

    storyNav (args) {
      return (
        <StoryNav {...args}>
          {this.navigate.bind(this)(args)}
        </StoryNav>
      )
    }
    renderNavigation (story) {
      if (story) {
        let wall = document.getElementById('wallInFocus')
        if (!this.observeResize) {
          window.addEventListener('resize', this.onResize)
          this.observeResize = true
        }
        return (
          <div>
            {this.storyPtr > 0 || this.previousWall ?
              this.storyNav.bind(this)({
                x: wall.offsetLeft + 50,
                y: wall.offsetTop + 20,
                width: '75',
                way: 'back',
                title: (this.storyPtr === 0 && this.previousWall ? this.previousWall : 'back')}) : null}
            {this.storyPtr < this.wallRows - 1 || this.nextWall ? 
              this.storyNav.bind(this)({
                x: wall.offsetLeft + wall.offsetWidth - 50 - 75,
                y: wall.offsetTop + 20,
                width: '75',
                way: 'forward',
                title: (this.storyPtr >= this.wallRows - 1 && this.nextWall ? this.nextWall : 'forward')}) : null}
          </div>
        )
      } else {
        if (this.observeResize) {
          window.removeEventListener('resize', this.onResize)
          this.observeResize = false
        }
      }
    }

    onwallresize () {
      this.setState({resize: true})
    }

    render () {
      this.wall = this.props.yourwalls[this.props.wallInFocus]
      if (this.props.wallInFocus !== this.wallInFocus) {
        this.storyPtr = 0
      }
      if (this.wall) {
        this.wallInFocus = this.props.wallInFocus
      }
      this.hiddenBricks = {}
      if (this.wall && this.wall.yItem.yContent.hiddenBricks) {
        this.wall.yItem.yContent.hiddenBricks.forEach(brick => {
          this.hiddenBricks[brick.brickId] = true
        })
      }
      this.wallRows = this.wall ? this.wall.yItem.yContent.rows.length : 0
      this.story = this.wall ? this.wall.yItem.yContent.story : false
      if (this.story) {
        this.nextWall = this.wall.yItem.yContent.nextWall
        this.previousWall = this.wall.yItem.yContent.previousWall
      } else {
        this.previousWall = null
        this.nextWall = null
      }    
      this.wallAccess = 'R'
      if (this.wall && this.props.identity && this.wall.yItem.yMetaData.yOwner === this.props.identity.yItem.yMetaData.yId) {
        this.wallAccess = 'CRUD'
      }

      return (
        this.wall ? 
          <WallDiv id='wallInFocus' background={this.wall.yItem.yContent.background}>
            {this.wall ? _.map(this.wall.yItem.yContent.rows, this.renderRow, this) : <YoythEntities wall={this.props.wallInFocus} />}
            {this.wall ? this.renderNavigation(this.wall.yItem.yContent.story) : null}
          </WallDiv>
          : null
      )
    }
  }
)
