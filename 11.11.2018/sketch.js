const canvasSketch = require('canvas-sketch');

// Ensure ThreeJS is in global scope for the 'examples/'
global.THREE = require('three');

// Include any additional ThreeJS examples below
require('three/examples/js/controls/OrbitControls');
import { triggerAnimations } from '../section-animator'

import eases from 'eases'

import gradient_color from 'gradient-color'

const settings = {
  // Make the loop animated
  animate: true,
  fps: 30,
  duration: 6,
  dimensions: [1024, 1024],
  // Get a WebGL canvas rather than 2D
  context: 'webgl',
  // Turn on MSAA
  attributes: { antialias: true }
};

const sketch = ({ context }) => {
  // Create a renderer
  const renderer = new THREE.WebGLRenderer({
    context
  });

  // WebGL background color
  // renderer.setClearColor('#efefef', 1)
  renderer.setClearColor('#000', 1)
  renderer.shadowMap.enabled = true;

  // Setup a camera
  const camera = new THREE.PerspectiveCamera(45, 1, 0.01, 100);
  camera.position.set(0.4, 3, 1.15);
  camera.lookAt(new THREE.Vector3())

  window.getCamera = () => camera.position

  // Setup camera controller
  const controls = new THREE.OrbitControls(camera);

  // Setup your scene
  const scene = new THREE.Scene()

  const numOfSheets = 7

  const colors = gradient_color(
    [
      'hsla(240, 80%, 66%, 1)',
      'hsl(0, 85%, 58%)',
      'hsla(59, 50%, 48%, 1)',
      'hsla(120, 80%, 60%, 1)',
    ],
    numOfSheets
  )

  const firstSheets = [...Array(numOfSheets)].map((_, i) => {

    const index = numOfSheets - i
    const meshSize = (index * 0.2) + 2

    const mesh = new THREE.Mesh(
      new THREE.BoxGeometry(meshSize, 0.15, meshSize),
      new THREE.MeshPhysicalMaterial({
        color: colors[i],
        roughness: 0.75,
        flatShading: true
      })
    )

    mesh.position.set(i, 0.2 * i, 0)
    mesh.castShadow = true
    mesh.receiveShadow = true

    scene.add(mesh)

    return mesh

  })

  // const sizeAfterSheets = numOfSheets * (0.2)
  //
  // const numOfSheets2 = 4
  // const secondSheets = [...Array(numOfSheets2)].map((_, i) => {
  //
  //   const index = numOfSheets2 - i
  //   const meshSize = (index * 0.2) + 2
  //
  //   const mesh = new THREE.Mesh(
  //     new THREE.BoxGeometry(meshSize, 0.15, meshSize),
  //     new THREE.MeshPhysicalMaterial({
  //       color: 'lightgreen',
  //       roughness: 0.75,
  //       flatShading: true
  //     })
  //   )
  //
  //   mesh.position.set(2, (0.2 * i) + sizeAfterSheets, -2)
  //   mesh.rotation.set(0, Math.PI / 4, 0)
  //   mesh.castShadow = true
  //   mesh.receiveShadow = true
  //
  //   scene.add(mesh)
  //
  //   return mesh
  //
  // })



  // Specify an ambient/unlit colour
  scene.add(new THREE.AmbientLight('#59314f'));

  // Add some light
  const light = new THREE.PointLight('white', 1, 15)
  light.position.set(0.2, 3, -0.2)
  light.castShadow = true
  scene.add(light)

  // Add some light
  const light3 = new THREE.PointLight('white', 1, 8)
  light3.position.set(-2, 3, .8)
  light3.castShadow = true
  scene.add(light3)

  const light2 = new THREE.PointLight('#45caf7', 1, 5)
  light2.position.set(-2, 2, 2)
  light2.castShadow = true
  scene.add(light2)

  const lightHelper = new THREE.PointLightHelper(light)
  const lightHelper2 = new THREE.PointLightHelper(light2)
  const lightHelper3 = new THREE.PointLightHelper(light3)

  scene.add(lightHelper, lightHelper2, lightHelper3)

  // draw each frame
  return {
    // Handle resize events here
    resize ({ pixelRatio, viewportWidth, viewportHeight }) {
      renderer.setPixelRatio(pixelRatio);
      renderer.setSize(viewportWidth, viewportHeight);
      camera.aspect = viewportWidth / viewportHeight;
      camera.updateProjectionMatrix();
    },
    // Update & render your scene here
    render ({ time, playhead }) {

      const animations = [
        {
          startFloat: 0,
          endFloat: 1,
          animationCallback: (animationPlayhead, infinitePlayheadOffset) => {

            const waveOffset = -0.32
            const waveMagnitude = 0.1
            const waveLength = (waveOffset + (infinitePlayheadOffset) * waveMagnitude)

            firstSheets.map((sheet, i) => {
              const y = 0.2 * i
              const z = waveLength * i

              sheet.position.set(
                0,
                y,
                z,
              )
            })

          }
        },
        {
          startFloat: 0.3,
          endFloat: 0.5,
          animationCallback: (animationPlayhead, infinitePlayheadOffset) => {



            // const waveOffset = -0.3
            // const waveMagnitude = 0.7
            // const waveLength = (waveOffset + eases.elasticOut(animationPlayhead) * .2) * waveMagnitude
            //
            // secondSheets.map((sheet, i) => {
            //   const y = (0.2 * i) + sizeAfterSheets
            //   const startingZOffset = -2
            //   const startingXOffset = 2
            //   const x = startingXOffset - (waveLength * i)
            //   const z = startingZOffset + (waveLength * i)
            //
            //   sheet.position.set(
            //     x,
            //     y,
            //     z,
            //   )
            // })

              // const sheet = secondSheets[0]
              //
              // const startingZOffset = -2
              // const startingXOffset = 2
              //
              // const distanceX = 1
              // const distanceZ = 1.2
              //
              // const easedPlayhead = eases.sineIn(animationPlayhead)
              //
              // sheet.position.set(
              //   startingXOffset - (easedPlayhead * distanceX),
              //   (0.2 * i) + sizeAfterSheets,
              //   startingZOffset + (easedPlayhead * distanceZ),
              // )
          }
        }
      ]

      triggerAnimations(animations, playhead)

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
