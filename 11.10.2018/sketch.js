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
  dimensions: [ 2048, 2048 ],
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

  const background = new Two.Rectangle(width/2, height/2, width, height);
  background.noStroke();
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





  return {
    render: ({ context, width, height, playhead }) => {

      if (stopRender) {
        return
      }


      //weird bug with canvas-sketch
      context.clearRect(0, 0, canvas.width, canvas.height)


      const animations = [
        {
          startFloat: 0,
          // endFloat: 1,
          animationCallback: (animationPlayhead) => {
            //fade background

            const infiniteCircle = Math.PI * 4
            const infinitePlayheadOffset = Math.sin(animationPlayhead * infiniteCircle)
            const backgroundCenterX = background.width / 2
            const backgroundCenterY = background.height / 2

            background.translation.set(
              backgroundCenterX +
              infinitePlayheadOffset * 100,
              backgroundCenterY
            )
          }
        },
        {
          startFloat: 0.2,
          endFloat: 0.4,
          animationCallback: (animationPlayhead) => {
            //move boxes up
          },
        }
      ]

      triggerAnimations(animations, playhead)
      two.render();

    },
  }
}

canvasSketch(sketch, settings)
