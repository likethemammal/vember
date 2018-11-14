const canvasSketch = require('canvas-sketch')

import Two from 'two.js'

import { triggerAnimations } from './section-animator'

//defined sections

//each section has startFloat, endFloat, and animationCallback
//animationCallback is fed animationPlayhead
//animationPlayhead is playhead - startFloat

//loop over each section
//create if statements for startTime and endTime
//if no endTime just check startTime


let stopRender

const settings = {
  dimensions: [ 1024, 1024 ],
  animate: true,
  fps: 30,
  duration: 4,
}

const sketch = ({ width, height, canvas, pixelRatio }) => {

  canvas.onclick = function () {
    stopRender = !stopRender
  }

  const two = new Two({
    width,
    height,
    domElement: canvas,
    ratio: pixelRatio
  })

  const background = new Two.Rectangle(width/2, height/2, width, height)
  background.noStroke()
  background.fill = new Two.RadialGradient(0, 0, height / 2, [
    new Two.Stop(0, 'white'),
    new Two.Stop(1, 'hsl(211, 100%, 90%)')
  ])
  two.add(background)


  // const group = new Two.Group()
  //
  // group.add(background)

  // two.add(group)
  // two.scene.translation.set(width / 2, height / 2)



  //todo take care of moving bottom teeth origin down

  const TOOTH_WIDTH = 340
  const numTeethInRowRaw = width / TOOTH_WIDTH
  const numTeeth = Math.ceil(numTeethInRowRaw) * 2

  const TEETH_ORIGIN_X = numTeethInRowRaw % 1 < 0.5 ? TOOTH_WIDTH / 2 : TOOTH_WIDTH / 4
  const TOOTH_HEIGHT = height / 2

  const halfTeethIndex = Math.ceil(numTeeth / 2)
  const teeth = [...Array(numTeeth)].map((_, i) => {

    const index = numTeeth - 1 - i

    let toothHeight
    const toothWidth = TOOTH_WIDTH

    const isBottomRow = index >= halfTeethIndex

    let toothOffsetX
    let toothOffsetY

    if (isBottomRow) {
      toothHeight = TOOTH_HEIGHT
      toothOffsetX = ((index - halfTeethIndex) * toothWidth) - TEETH_ORIGIN_X
      toothOffsetY = toothHeight
    } else {
      toothHeight = TOOTH_HEIGHT + 40
      toothOffsetX = (index * toothWidth) - TEETH_ORIGIN_X
      toothOffsetY = 0
    }

    const toothCenterX = toothWidth / 2
    const toothCenterY = toothHeight / 2
    const toothX = toothCenterX + toothOffsetX
    const toothY = toothCenterY + toothOffsetY

    const tooth = new Two.RoundedRectangle(toothX, toothY, toothWidth, toothHeight, 15)

    // tooth.noStroke()
    tooth.fill = 'white'

    two.add(tooth)

    return tooth
  })





  return {
    render: ({ context, width, height, playhead }) => {

      if (stopRender) {
        return
      }


      //weird bug with canvas-sketch
      context.clearRect(0, 0, canvas.width, canvas.height)


      const animations = [
        {
          startFloat: 0.2,
          endFloat: 0.9,
          animationCallback: (animationPlayhead) => {

            // const infinitePlayheadOffset = Math.sin(animationPlayhead * infiniteCircle)
            // const backgroundCenterX = background.width / 2
            // const backgroundCenterY = background.height / 2

            const scaleSize = .5
            const scale = 1 + (animationPlayhead * scaleSize)
            background.scale = scale
          },
        },
        {
          startFloat: 0.2,
          endFloat: 0.9,
          animationCallback: (animationPlayhead, infinitePlayheadOffset) => {
            teeth.map((tooth, i) => {

              const index = numTeeth - 1 - i
              const isBottomRow = index >= halfTeethIndex
              const toothWidth = tooth.width
              const toothHeight = tooth.height
              const toothCenterX = toothWidth / 2
              const toothCenterY = toothHeight / 2

              let toothOffsetX
              let toothOffsetY

              if (isBottomRow) {
                toothOffsetX = ((index - halfTeethIndex) * toothWidth) - TEETH_ORIGIN_X
                toothOffsetY = (animationPlayhead * toothHeight + 40) + toothHeight
              } else {
                toothOffsetX = (index * toothWidth) - TEETH_ORIGIN_X
                toothOffsetY = (animationPlayhead * -(toothHeight + 40))
              }

              const toothX = toothCenterX + toothOffsetX
              const toothY = toothCenterY + toothOffsetY

              // tooth.noStroke()
              tooth.fill = 'white'
              // tooth.rotation = -infinitePlayheadOffset * 0.02 + (i / 100)

              tooth.translation.set(toothX, toothY)

            })

          },
        }
      ]

      triggerAnimations(animations, playhead)
      two.render();

    },
  }
}

canvasSketch(sketch, settings)
