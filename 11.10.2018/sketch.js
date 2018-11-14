const canvasSketch = require('canvas-sketch')

const shuffle = (array) => {
  let currentIndex = array.length;
  let temporaryValue;
  let randomIndex;
  const newArray = array.slice();
  // While there remains elements to shuffle...
  while (currentIndex) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    // Swap it with the current element.
    temporaryValue = newArray[currentIndex];
    newArray[currentIndex] = newArray[randomIndex];
    newArray[randomIndex] = temporaryValue;
  }
  return newArray;
}

import Two from 'two.js'

import { triggerAnimations } from '../section-animator'

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
  duration: 8,
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
    new Two.Stop(0, '#ff4355'),
    new Two.Stop(1, '#cc1022'),
  ], -100, -300)
  two.add(background)

  //todo take care of moving bottom teeth origin down

  const TOOTH_WIDTH = 340
  const numTeethInRowRaw = width / TOOTH_WIDTH
  const numTeeth = Math.ceil(numTeethInRowRaw) * 2
  const TOOTH_RADIUS = 40

  const TEETH_ORIGIN_X = numTeethInRowRaw % 1 < 0.5 ? TOOTH_WIDTH / 2 : TOOTH_WIDTH / 4
  const TOOTH_HEIGHT = height / 2

  const halfTeethIndex = Math.ceil(numTeeth / 2)

  const group = new Two.Group()

  group.add(
    // circle,
  )

  //locate the center of the circle

  //radius

  //(x - xorigin)2 + (y + yorigin)2 = radius

  //(x - origin) + (y - yorigin) = Math.sqrt(radius)

  const numCircles = 10
  const numFlowers = 13

  const flowers = shuffle(([...Array(numFlowers - 1)]).map((_, i) => {

    const flowerAngle = i * (360 / numFlowers)

    const flowersOriginX = width / 2
    const flowersOriginY = height / 2

    const flowerRadius = 700

    const xOrigin = flowersOriginX + flowerRadius * Math.cos(-flowerAngle*Math.PI/180)
    const yOrigin = flowersOriginY + flowerRadius * Math.sin(-flowerAngle*Math.PI/180)

    const circles = []

    ;([...Array(numCircles)]).map((_, j) => {
      // const x, y
      // const angle

      const circleAngle = j * (360 / numCircles)


      const radius = 200
      const circleRadius = 200

      const x = xOrigin + radius * Math.cos(-circleAngle*Math.PI/180)
      const y = yOrigin + radius * Math.sin(-circleAngle*Math.PI/180)

      const circle = new Two.Ellipse(x, y, circleRadius, circleRadius)

      circle.noStroke()

      circle.fill = 'transparent'

      circles.push(circle)

      two.add(circle)
    })

    return circles

  }))

  const middleCircles = ([...Array(numCircles)]).map((_, j) => {
    // const x, y;

    // const angle

    const circleAngle = j * (360 / numCircles)


    const radius = 200
    const circleRadius = 200

    const x = (width / 2) + radius * Math.cos(-circleAngle*Math.PI/180)
    const y = (height / 2) + radius * Math.sin(-circleAngle*Math.PI/180)

    const circle = new Two.Ellipse(x, y, circleRadius, circleRadius)

    circle.noStroke()

    circle.fill = 'transparent'
    two.add(circle)

    return circle
  })


  flowers.push(middleCircles)

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
      toothOffsetY = -500
    }

    const toothCenterX = toothWidth / 2
    const toothCenterY = toothHeight / 2
    const toothX = toothCenterX + toothOffsetX
    const toothY = toothCenterY + toothOffsetY

    const tooth = new Two.RoundedRectangle(toothX, toothY, toothWidth, toothHeight, TOOTH_RADIUS)

    tooth.noStroke()
    tooth.fill = 'transparent'

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
          startFloat: 0.1,
          endFloat: 0.6,
          animationCallback: (animationPlayhead) => {
            const filtered = flowers.filter((circles, i) => {
              return (i +1) / flowers.length <= animationPlayhead + 0.1
            })

            filtered.map((circles, i) => {
              circles.map((circle, j) => {
                circle.fill = 'white'
              })
            })

          }
        },
        {
          startFloat: 0.7,
          endFloat: 0.9,
          animationCallback: (animationPlayhead, infinitePlayheadOffset) => {

            flowers.map((circles) => {
              circles.map((circle, j) => {
                circle.fill = 'transparent'
              })
            })

            // console.log(animationPlayhead)
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
                toothOffsetY = (animationPlayhead * -(toothHeight + 500))
              }

              const toothX = toothCenterX + toothOffsetX
              const toothY = toothCenterY + toothOffsetY

              // tooth.noStroke()
              tooth.fill = 'white'
              // tooth.rotation = -infinitePlayheadOffset * 0.02 + (i / 100)

              tooth.translation.set(toothX, toothY)

            })
          },
        },
        {
          startFloat: 0.65,
          endFloat: 0.9,
          animationCallback: (animationPlayhead) => {

            // const infinitePlayheadOffset = Math.sin(animationPlayhead * infiniteCircle)
            // const backgroundCenterX = background.width / 2
            // const backgroundCenterY = background.height / 2

            const scaleSize = 1
            const scale = 1 + (animationPlayhead * scaleSize)
            background.scale = scale
          },
        },

      ]

      triggerAnimations(animations, playhead)
      two.render();

    },
    end: () => {
      background.scale = 2
      teeth.map((tooth) => {
        tooth.fill = 'white'
      })
    }
  }
}

canvasSketch(sketch, settings)
