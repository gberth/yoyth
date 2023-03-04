import React from 'react'
import style from 'styled-components'

const BrickContent = style.div`
    min-width: 0;
    > img {
      max-width: 100%;
    }
`

const DropDownMenu = style.div`
    width: 200px;
    position: fixed;
    display: block;
    opacity: 1;
    z-index: 100;
    > a {
      background-color: #eee;
      color: black;
      display: block;
      padding: 12px;
      text-decoration: none;
    }
    > a:hover {
      background-color: #ccc;
    }
  `
const FormButton = style.button`
  color: #2D8E5B;
  font-size: 1em;
  padding: 0.25em 1em;
  border: 2px solid #2D8E5B;
  border-radius: 5px;
  flex-grow: 1;
  cursor: pointer;
`
const Select = style.select`
  color: #2D8E5B;
  font-size: 1em;
  padding: 0.25em 1em;
  border: 2px solid #2D8E5B;
  border-radius: 5px;
  flex-grow: 1;
`
const FormButtons = style.div`
  display flex;
  width: 100%
  height: 50px;
`
const Line = style.div`
  width: 100%
`
const List = style.div`
  display: grid;
  width: 100%
  grid-gap: var(--yoyth-row-grid-gap);
  grid-template-columns: ${props => props.columns};
  grid-template-rows: var(--yoyth-grid-template-rows);
`
const StoryNav = style.div`
  display: block;
  position: fixed;
  left: ${props => props.x}px;
  top: ${props => props.y}px;
  width: ${props => props.width}px;
  height: ${props => props.width}px;
  background: rgba(76, 175, 80, 0.1);
  color: #2ABBC1;
  > img {
    background: rgba(42, 187, 193, 0.1);
  }
  &:hover {
    background: rgba(42, 187, 193, 0.7);
    > img {
      background: rgba(42, 187, 193, 0.7);
    }
  }
`
const Field = style.div`
  display block;
  > a {
    background-color: #eee;
    color: black;
    display: block;
    padding: 12px;
    text-decoration: none;
  }  
`
const FigCaption = style.div`
  display block;
  text-align: center;
  font-size: 12px;
`

const PictureList = style.div`
  display: grid;
  grid-gap: ${props => props.gridgap ? props.gridgap : 5}px;
  grid-template-columns: repeat(auto-fit, minmax(${props => props.minmax ? props.minmax : 100}px, 1fr));
  grid-auto-rows: ${props => props.autorows ? props.autorows : 75}px;
`

export const YoythDropDown = (props) => <DropDownMenu {...props} />
export const YoythButton = (props) => <FormButton {...props} />
export const YoythButtons = (props) => <FormButtons {...props} />
export const YoythLine = (props) => <Line {...props} />
export const YoythField = (props) => <Field {...props} />
export const YoythBrickContent = (props) => <BrickContent {...props} />
export const YoythList = (props) => <List {...props} />
export const YoythFigCaption = (props) => <FigCaption {...props} />
export const YoythPictureList = (props) => <PictureList {...props} />
export const YoythSelect = (props) => <Select {...props} />
export const YoythStoryNav = (props) => <StoryNav {...props} />
