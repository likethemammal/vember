const canvasSketch = require('canvas-sketch');

import color_gradient from 'gradient-color'

const DURATION = 10

const settings = {
  dimensions: [ 512, 512 ],

  loop: true,
  animate: true,
  duration: DURATION,
  // timeScale: 1,
  // totalFrames: 15,
  fps: 30,
}

let currentBox = 1


const BOX_MAX_NUMBER = 60
const BOX_SIZE = 60


const _nextX = (width) => Math.floor(Math.random() * (width - BOX_SIZE))
const _nextColor = () => `hsl(${Math.floor(350 * Math.random())}, 65%, 80%)`

let nextX = 512 / 2
let nextColor = _nextColor()
let lastColor = _nextColor()


const getColors = () => color_gradient([lastColor, nextColor], BOX_MAX_NUMBER)
let colors = getColors()

const sketch = () => {


  return {
    render: ({context, width, height, playhead}) => {



      const playheadMutiplied = playhead * DURATION
      const _relativePlayhead = (playheadMutiplied) % 1
      const relativePlayhead = parseFloat(_relativePlayhead.toFixed(2))


      const safeHeight = (height + BOX_SIZE + BOX_SIZE)
      const playheadOffset = relativePlayhead * safeHeight
      const nextY = playheadOffset - BOX_SIZE

      const colorNumber = relativePlayhead >= 1 ? BOX_MAX_NUMBER - 1 : Math.floor(
        relativePlayhead * BOX_MAX_NUMBER
      )

      const backgroundColor = colors[
        colorNumber
      ]

      context.fillStyle = backgroundColor + ''

      context.fillRect(0, 0, width, height)

      context.fillStyle = 'white'


      if (currentBox % 2 === 0) {
        context.beginPath();

        context.arc(nextX, nextY, BOX_SIZE / 2, 0, 2*Math.PI)

        context.fill()
      } else {
        context.fillRect(nextX, nextY, BOX_SIZE, BOX_SIZE)
      }


      if (Math.floor(playheadMutiplied) >= currentBox) {

        lastColor = nextColor + ''
        nextX = _nextX(width) + ''
        nextColor = _nextColor() + ''

        colors = getColors()

        if (currentBox >= DURATION) {
          currentBox = 0
        }

        currentBox++
        // context.fillRect(0, 0, width, height)
      }
    },
    begin() {
      // First frame of loop
    },
    end({ context, width, height, playhead }) {
      // Last frame of loop

      // lastColor = nextColor + ''
      // nextX = _nextX(width)
      // nextColor = _nextColor()
      // currentBox = 0

      currentBox = 1
      lastColor = nextColor + ''
      nextX = _nextX(width) + ''
      nextColor = _nextColor() + ''

      colors = getColors()
    }
  }
}

canvasSketch(sketch, settings)
