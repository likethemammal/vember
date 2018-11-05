/**
 * A Canvas2D example of a spiraling flower pattern,
 * which is set to the physical size of a typical business
 * card (3.5 x 2 inches with 1/8" bleed).
 * @author Matt DesLauriers (@mattdesl)
 */

const canvasSketch = require('canvas-sketch');

import gradient_color from 'gradient-color'


const settings = {
  animate: true,
  fps: 30,
  duration: 4,
  dimensions: [ 512, 512 ],

};

const NUM_STARS = 50
const MAX_TWINKLE_OFFSET = 10
const MAX_DELAY_SIZE = 4
const STAR_START_OFFSET = 15

const stars = [...Array(NUM_STARS)].map(() => {
  return {
    x: Math.random() * 512,
    y: Math.random() * 445,
    delay: Math.random() * MAX_DELAY_SIZE,
    offset: Math.random() * MAX_TWINKLE_OFFSET,
  }
})

const sketch = ({ }) => {
  return props => {
    const {
      context, exporting, bleed,
      width, height,
      trimWidth, trimHeight, playhead
    } = props

    const NUM_COLORS = 30 * 4

    const Black = 'hsla(282, 100%, 18%, 1)'

    // const bottomColors = gradient_color(["#8e5c1a","#630082","#630082","#8e5c1a"], NUM_COLORS)
    const middleColors = gradient_color([Black,"#3A0282","#3A0282",Black], NUM_COLORS)
    const bottomColors = gradient_color(["#630082","#3A0282","#3A0282","#630082"], NUM_COLORS)
    const currentMiddle = middleColors[Math.floor(NUM_COLORS * playhead)]
    const currentBottom = bottomColors[Math.floor(NUM_COLORS * playhead)]

    const fill = context.createLinearGradient(0,0,0, height)
    fill.addColorStop(0,"black")
    fill.addColorStop(0.3,"black")
    fill.addColorStop(0.8, currentMiddle)
    fill.addColorStop(1, currentBottom)

    context.fillStyle = fill
    context.fillRect(0, 0, 512, 512)

    stars.map(({ x, y, delay, offset }) => {

      const radius = 3 * Math.abs(
        Math.sin((playhead * Math.PI / 2 * MAX_DELAY_SIZE) + STAR_START_OFFSET + offset)
      )

      context.beginPath();
      context.arc(x, y, radius, 0, 2 * Math.PI, false);
      context.fillStyle = 'white';
      context.fill();

    })

  };
};

canvasSketch(sketch, settings);