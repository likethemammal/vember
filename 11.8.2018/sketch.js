const canvasSketch = require('canvas-sketch');

import Two from 'two.js'

import gradient_color from 'gradient-color'


const settings = {
  dimensions: [ 1024, 1024 ],
  animate: true,
  duration: 4,
  fps: 30,
};

const sketch = ({ canvas, width, height, pixelRatio }) => {

  const two = new Two({
    width: width,
    height: height,
    // Pass the canvas-sketch domElement into Two
    domElement: canvas,
    ratio: pixelRatio
  });

  // const colors = gradient_color(['red', 'white'], 100)
  const colors = gradient_color([
    'white', 'white', 'white', 'white',
    'white', 'white', 'white', 'white',
    'orange', 'green', 'blue', 'purple', 'red',
  ], 100)
  // const colors = gradient_color([
  //   'white', 'white', 'white', 'white',
  //   '#FFDEE4', '#FFDEE4',
  // ], 100)

  const background = new Two.Rectangle(0, 0, two.width, two.height);
  background.noStroke();

  // background.fill = new Two.RadialGradient(0, 0, two.height / 2, [
  //   new Two.Stop(0, 'tomato'),
  //   new Two.Stop(1, 'rgb(255, 50, 50)')
  // ]);

  background.fill = new Two.RadialGradient(0, 0, two.height / 2, [
    // new Two.Stop(0, '#fff0f0'),
    new Two.Stop(0, 'white'),
    new Two.Stop(1, 'white')
  ]);

  const getPawCoords = (x, y) => {
    return [
      [x + 0, y + 120],
      [x + 150, y + 0],
    ]
  }

  const getTrail = (x = 0, y = 0) => {
    return [
      getPawCoords(x, y + -50),
      getPawCoords(x, y + 200),
      getPawCoords(x, y + 450),
      getPawCoords(x, y + 700),
      getPawCoords(x, y + 950),
    ].reverse()
  }

  // const pawCoordSets = getTrail(600, 50)
  const pawCoordSets = getTrail(300, -50)

  two.add(background)

  let pawCounter = 0


  const getPaw = function() {

    const OVAL_WIDTH = 70
    const OVAL_HEIGHT = 45

    const pawIndex = pawCounter + 0

    const oval1 = new Two.Ellipse(0, 0, OVAL_WIDTH, OVAL_HEIGHT);
    oval1.noStroke();

    const oval2 = new Two.Ellipse(110, 0, OVAL_WIDTH, OVAL_HEIGHT);
    oval2.noStroke();

    const oval3 = new Two.Ellipse(195, 100, OVAL_WIDTH -10, OVAL_HEIGHT - 5);
    oval3.noStroke();

    const oval4 = new Two.Ellipse(-80, 100, OVAL_WIDTH -10, OVAL_HEIGHT - 5);
    oval4.noStroke();

    oval1.rotation = 1.45
    oval2.rotation = 1.55
    oval3.rotation = 1.7
    oval4.rotation = 1.4

    const circle1 = new Two.Ellipse(60, 165, 70, 70);
    circle1.noStroke();
    const circle2 = new Two.Ellipse(25, 205, 70, 60);
    circle2.noStroke();
    const circle3 = new Two.Ellipse(95, 205, 70, 60);
    circle3.noStroke();

    const group = new Two.Group();
    const groupContainer = new Two.Group();
    const groupContainer2 = new Two.Group();

    group.add(oval1, oval2, oval3, oval4, circle1, circle2, circle3)

    group.fill = 'pink'

    group.translation.set(-50, -90);
    groupContainer.add(group)

    groupContainer.translation.set(-two.width/2, -two.width/2);

    groupContainer2.add(groupContainer)

    pawCounter++

    return {
      setScale: (scale) => {
        groupContainer.scale = scale
      },
      group: groupContainer2,
      getVisible: (playhead) => {
        const currentIndex = pawIndex + 1
        const totalIndexes = (pawCoordSets.length * 2) * 4

        const percentCompleteRequired = currentIndex / totalIndexes

        if (playhead > percentCompleteRequired) {
          return 1 - (playhead - percentCompleteRequired)
        }

        return 0
      }
    }
  }

  const pawSets = pawCoordSets.map((pawCoords, pawSetIndex) => {
    const paws = pawCoords.map((_, i) => {
      return getPaw(pawSetIndex, i)
    })

    return paws.map((paw, i) => {
      const coords = pawCoords[i]

      const { group, setScale } = paw

      group.translation.set(coords[0], coords[1])

      setScale(0.2)

      two.add(group)

      return paw

    })
  })

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
    render: ({ context, width, height, deltaTime, playhead }) => {

      pawSets.map((pawSet) => {

        pawSet.map(({group, getVisible}, pawIndex) => {

          const colorIndex = Math.floor(getVisible(playhead) * 100)

          group.fill = colors[colorIndex]
        })
      })

      two.render();

    }

  };
};

canvasSketch(sketch, settings);
