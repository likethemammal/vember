import canvasSketch from 'canvas-sketch'
import { lerp } from 'canvas-sketch-util/math'

const settings = {
  // Enable an animation loop
  animate: true,
  // Set loop duration to 3 seconds
  duration: 4,
  // Use a small size for our GIF output
  dimensions: [ 512, 512 ],
  // Optionally specify an export frame rate, defaults to 30
  fps: 24
};

const numBars = 15
const bars = [...Array(numBars)]


// Start the sketch
canvasSketch(() => {
  return ({ context, width, height, playhead }) => {

    const margin = 1/4

    // Off-white background
    context.fillStyle = 'hsl(0, 0%, 98%)';
    context.fillRect(0, 0, width, height);

    // Gradient foreground
    const fill = context.createLinearGradient(0, 0, width, height);
    fill.addColorStop(0, `hsl(${350 * playhead}, 60%, 50%)`);
    fill.addColorStop(1, `hsl(${1/350 * playhead}, 60%, 50%)`);

    // Fill rectangle
    context.fillStyle = fill;
    context.fillRect(margin, margin, width - margin * 2, height - margin * 2);
    context.fillStyle = 'transparent';

    bars.map((_, i) => {
      // Get a seamless 0..1 value for our loop
      const t = Math.sin(playhead * Math.PI);

      // Rotate with PI to create a seamless animation
      const rotation = (playhead * (Math.PI / 2 * (1 / (i))));

      // Draw a rotating white rectangle around the center
      const cx = width / 2;
      const cy = height / 2;

      const side = width/2
      const sideSquared = Math.pow(side, 2)

      const innerBoxLength = Math.sqrt(
        sideSquared + sideSquared,
      )

      const thickness = innerBoxLength
      const length = innerBoxLength

      context.fillStyle = `rgba(255,255,255, ${(1/( i / 2.5)) - playhead - .25})`;

      context.save();

      context.translate(cx, cy);
      context.rotate(rotation * (4));
      context.fillRect(-thickness / 2, -length / 2, thickness, length);

      context.restore();

    })

  };
}, settings);