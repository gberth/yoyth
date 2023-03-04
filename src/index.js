import React from 'react'
import { render } from 'react-dom'
import Yoyth from './components/Yoyth'
import { Container } from '@cerebral/react'
import controller from './controller'

render(
  <Container controller={controller}>
    <Yoyth />
  </Container>,
  document.getElementById('root')
)
