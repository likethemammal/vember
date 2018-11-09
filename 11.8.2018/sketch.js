const canvasSketch = require('canvas-sketch');

import Two from 'two.js'


const settings = {
  dimensions: [ 1024, 1024 ],
  animate: true,
  duration: 4,
};

const sketch = ({ canvas, width, height, pixelRatio }) => {

  const two = new Two({
    width: width,
    height: height,
    // Pass the canvas-sketch domElement into Two
    domElement: canvas,
    ratio: pixelRatio
  });


  const background = new Two.Rectangle(0, 0, two.width, two.height);
  background.noStroke();
  // Radial Gradient has origin x, y a radius then an array of color stops
  // Each stop requires an offset value (0 - 1) and a CSS compatible color
  background.fill = new Two.RadialGradient(0, 0, two.height / 2, [
    new Two.Stop(0, 'tomato'),
    new Two.Stop(1, 'rgb(255, 50, 50)')
  ]);

  const OVAL_WIDTH = 70
  const OVAL_HEIGHT = 45

  // Create the subject of the visual output
  const rectangle = new Two.Ellipse(0, 0, OVAL_WIDTH, OVAL_HEIGHT);
  rectangle.noStroke();

  const oval2 = new Two.Ellipse(110, 0, OVAL_WIDTH, OVAL_HEIGHT);
  oval2.noStroke();

  const oval3 = new Two.Ellipse(195, 100, OVAL_WIDTH, OVAL_HEIGHT);
  oval3.noStroke();

  const oval4 = new Two.Ellipse(-80, 100, OVAL_WIDTH, OVAL_HEIGHT);
  oval4.noStroke();

  rectangle.rotation = 1.45
  oval2.rotation = 1.6
  oval3.rotation = 1.7
  oval4.rotation = 1.4


  const circle = new Two.Ellipse(60, 165, 70, 70);
  circle.noStroke();
  const circle2 = new Two.Ellipse(25, 205, 70, 60);
  circle2.noStroke();
  const circle3 = new Two.Ellipse(95, 205, 70, 60);
  circle3.noStroke();


  var group = new Two.Group();

  group.add(rectangle, oval2, oval3, oval4, circle, circle2, circle3)


  // Add both the background and rectangle to the scene
  // Order matters here:
  two.add(background, group);

  // Orient the scene to make 0, 0 the center of the canvas
  two.scene.translation.set(two.width / 2, two.height / 2);



  return {

    resize ({ pixelRatio, viewportWidth, viewportHeight }) {

      // Update width and height of Two.js scene based on
      // canvas-sketch auto changing viewport parameters
      two.width = viewportWidth;
      two.height = viewportHeight;
      two.ratio = pixelRatio;

      // This needs to be passed down to the renderer's width and height as well
      two.renderer.width = two.width;
      two.renderer.height = two.height;

      // Reorient the scene to the center of the new canvas dimensions
      two.scene.translation.set(two.width / 2, two.height / 2);

      // Update the background's width and height to adhere
      // to the bounds of the canvas.
      background.width = two.width;
      background.height = two.height;

    },
    render: ({ context, width, height, deltaTime }) => {

      // group.rotation += 2 * deltaTime
      // rectangle.rotation += 2 * deltaTime;
      // Update two.js via the `render` method — *not* the `update` method.
      two.render();

    }

  };
};

canvasSketch(sketch, settings);
