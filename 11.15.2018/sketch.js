const canvasSketch = require('canvas-sketch');

// Ensure ThreeJS is in global scope for the 'examples/'
global.THREE = require('three');

// Include any additional ThreeJS examples below
require('three/examples/js/controls/OrbitControls')

import eases from 'eases'

const settings = {
  // Make the loop animated
  animate: true,
  fps: 30,
  duration: 4,
  // Get a WebGL canvas rather than 2D
  context: 'webgl',
  // Turn on MSAA
  attributes: { antialias: true }
};


//boxes

//box y goes up at a certain ease

//box x goes a direction based on sin

//

const sketch = ({ context }) => {
  // Create a renderer
  const renderer = new THREE.WebGLRenderer({
    context
  });

  // WebGL background color
  renderer.setClearColor('#000', 1);

  // Setup a camera
  const camera = new THREE.PerspectiveCamera(45, 1, 0.01, 100);
  camera.position.set(2, 2, -4);
  camera.lookAt(new THREE.Vector3());

  // Setup camera controller
  const controls = new THREE.OrbitControls(camera);

  // Setup your scene
  const scene = new THREE.Scene();

  // const mesh = new THREE.Mesh(
  //   new THREE.BoxGeometry(1, 1, 1),
  //   new THREE.MeshPhysicalMaterial({
  //     color: 'white',
  //     roughness: 0.75,
  //     flatShading: true
  //   })
  // );
  // scene.add(mesh)


  const numOfBoxes = 5
  const boxes = [...Array(numOfBoxes)].map((_, i) => {
    const mesh = new THREE.Mesh(
      new THREE.BoxGeometry(1, 1, 1),
      new THREE.MeshPhysicalMaterial({
        color: 'white',
        roughness: 0.75,
        flatShading: true
      })
    )
    scene.add(mesh)

    return mesh

  })


  // Specify an ambient/unlit colour
  scene.add(new THREE.AmbientLight('#59314f'));

  // Add some light
  const light = new THREE.PointLight('#45caf7', 1, 15.5);
  light.position.set(2, 2, -4).multiplyScalar(1.5);
  scene.add(light);

  // draw each frame
  return {
    // Handle resize events here
    resize ({ pixelRatio, viewportWidth, viewportHeight }) {
      renderer.setPixelRatio(pixelRatio);
      renderer.setSize(viewportWidth, viewportHeight);
      camera.aspect = viewportWidth / viewportHeight;
      camera.updateProjectionMatrix()
    },
    // Update & render your scene here
    render ({ time, playhead }) {
      // mesh.rotation.y = time * (10 * Math.PI / 180)


      boxes.map((mesh, i) => {

        const scale = 0.3

        const flameHeight = 2
        const flameWidth = 0.5

        const boxDistanceFromCenter = flameWidth * Math.sin(eases.sineOut(playhead) * Math.PI)

        const calcAngleFromCenter = (index, totalNum) => {
          return index * (360 / totalNum)
        }

        const calcXOnCircle = (originX, circleRadius, angleFromCenter) => {
          return originX + circleRadius * Math.cos(
              -angleFromCenter * Math.PI/180
            )
        }

        const calcYOnCircle = (originY, circleRadius, angleFromCenter) => {
          return originY + circleRadius * Math.sin(-angleFromCenter*Math.PI/180)
        }

        mesh.scale.set(scale, scale, scale)

        mesh.position.y = flameHeight * eases.sineInOut(playhead)
        mesh.position.x = calcXOnCircle(0, boxDistanceFromCenter, calcAngleFromCenter(i, numOfBoxes))
        mesh.position.z = calcYOnCircle(0, boxDistanceFromCenter, calcAngleFromCenter(i, numOfBoxes))

      })





      controls.update();
      renderer.render(scene, camera);
    },
    // Dispose of events & renderer for cleaner hot-reloading
    unload () {
      controls.dispose();
      renderer.dispose();
    }
  };
};

canvasSketch(sketch, settings);
