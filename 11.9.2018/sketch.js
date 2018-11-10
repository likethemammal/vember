const canvasSketch = require('canvas-sketch');

import Two from 'two.js'
import Matter from 'matter-js'

const debugMatter = false

import gradient_color from 'gradient-color'

const settings = {
  dimensions: [ 1024, 1024 ],
  animate: true,
  fps: 30,
  duration: 8,
  canvas: debugMatter ? false : null,
  parent: debugMatter ? document.body : null
};

const colors = gradient_color([
  'white', 'white', 'white', 'white',
  'white', 'white', 'white', 'white',
  'orange', 'green', 'blue', 'purple', 'red',
], 100)


const sketch = ({ canvas, width, height, pixelRatio }) => {

  const getBox = (x, y, width, height, props, fill = 'brown') => {

    const initialX = (width/2) + x
    const initialY = (height/2) + y

    const body = Matter.Bodies.rectangle(initialX, initialY, width, height, {
      ...props
    })

    const shape = new Two.Rectangle(initialX, initialY, width, height);
    shape.noStroke()

    shape.fill = fill
    return {
      initialPosition: {
        x: initialX,
        y: initialY,
        angle: props.angle || 0,
      },
      body,
      shape,
    }
  }

  const engine = Matter.Engine.create()


  // engine.world.gravity = 0

  let objects

  const recreateWorld = () => {

    // const boxPosition = [
    //   [width + 50, 0, 0.09],
    //   [width + 50, 50, 0.003],
    //   [width + 50, 400, 0.04],
    //   [width + 50, 300, 0.04],
    //   [width + 50, 170, 0.005],
    //   [width + 50, 170, 0.005],
    //   [width + 50, 170, 0.005],
    //   [width + 50, 170, 0.005],
    //   [width + 50, 170, 0.005],
    // ]

    const boxPosition = [...Array(200)].map(() => {
      return [Math.random() * width + width, -height*1.5 + (Math.random() * height *2), Math.random() * 0.1]
    })

    const getLeaf = (array) => {

      const size = Math.random()


      return getBox(array[0], array[1], 100 * size, 50 * size, {
        frictionAir: array[2],
        restitution: 0.00000000001,
        collisionFilter: {
          category: 'blue'
        }
      }, 'rgba(0, 180, 0, 0.6)')
    }

    const boxes = boxPosition.map(getLeaf)



    // const ground = getBox(width / 2, height / 2, 100, 100, {
    //   isStatic: true,
    //   angle: Math.PI + 40,
    //   restitution: 0.002,
    // }, 'red')
    //
    // const ground2 = getBox(width / 4, height - 500, 100, 100, {
    //   isStatic: true,
    //   angle: Math.PI + 40,
    //   restitution: 0.002,
    // }, 'red')

    // objects = [...boxes, ground, ground2]

    objects = [...boxes]
    Matter.World.add(engine.world, objects.map(({body}) => body))


  }

  recreateWorld()




  if (debugMatter) {
    const render = Matter.Render.create({
      element: document.body,
      engine,
      options: {
        width,
        height,
      }
    })

    Matter.Render.run(render)

    // create runner
    const runner = Matter.Runner.create();

    Matter.Events.on(runner, 'afterUpdate', () => {
      console.log(objects[0].body)
    })

    Matter.Runner.run(runner, engine);



    return {render: ()=> {}}
  }

  const two = new Two({
    width: width,
    height: height,
    // Pass the canvas-sketch domElement into Two
    domElement: canvas,
    ratio: pixelRatio
  });

  const background = new Two.Rectangle(width/2, height/2, two.width, two.height);
  background.noStroke();
  background.fill = new Two.RadialGradient(0, 0, two.height / 2, [
    new Two.Stop(0, 'white'),
    new Two.Stop(1, 'white')
  ]);
  two.add(background)

  two.add(objects.map(({shape}) => shape))
  // two.scene.translation.set(two.width / 2, two.height / 2);


  //
  // const ground = new Two.Rectangle(0, two.height - 50, two.width, two.height);
  // ground.noStroke()
  //
  // ground.fill = 'brown'
  //

  //
  //
  // const leaf = new Two.Rectangle(0, 0, 50, 100);
  // leaf.noStroke();
  //
  // leaf.fill = 'green'
  //

  Matter.Engine.run(engine)

  return {
    render: ({ context, width, height, deltaTime, playhead, time }) => {
      Matter.Engine.update(engine, deltaTime);
      context.clearRect(0, 0, width, height)


      const timeIsh = Math.min(Math.max(2, time), 6)

      objects.map(({ body, shape }, i) => {

        shape.translation.set(body.position.x, body.position.y)
        shape.rotation = body.angle


        Matter.Body.applyForce(body, { x: width/2, y: height/2 }, {
          y: -0.00,
          x: -Math.sin(timeIsh) * 0.0025,
        })

      })

      // leaf.translation.set(box.position.x, box.position.y)

      two.render();


    },
    end: (width, height) => {

      two.remove(objects.map(({shape}) => shape))
      Matter.World.remove(engine.world, objects.map(({ body }) => body))
      recreateWorld()
      two.add(objects.map(({shape}) => shape))

      // engine.timing.timestamp = 0

      // Matter.Body.set(box, 'position', { x:0, y:0, })

      // objects.map(({ body, shape, initialPosition }, i) => {
      //
      //   // console.log(body.position.y, i)
      //
      //   const { angle, x, y, } = initialPosition
      //
      //   console.log(angle, x, y)
      //
      //   // Matter.Body.setAngle(body, Math.PI / 2)
      //   //
      //   Matter.Body.set(body, {
      //     position: {
      //       x, y,
      //     },
      //     angle,
      //   })
      //
      //   Matter.Body.setInertia(body, 0)
      //   // Matter.Body.setVelocity(body, 0)
      //
      //   // console.log(shape.rotation = 0.6)
      // })

      // const box = Matter.Bodies.rectangle(0, 0, 50, 100)
      //
      // Matter.World.add(engine.world, [box])

    }
  }
};

canvasSketch(sketch, settings);
