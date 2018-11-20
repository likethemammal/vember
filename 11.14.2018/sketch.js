const canvasSketch = require('canvas-sketch');

// Ensure ThreeJS is in global scope for the 'examples/'
global.THREE = require('three');

// Include any additional ThreeJS examples below
require('three/examples/js/controls/OrbitControls');
import { triggerAnimations } from '../section-animator'

import gradient_color from 'gradient-color'

import eases from 'eases'

const settings = {
  // Make the loop animated
  animate: true,
  duration: 6,
  fps: 30,
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
  renderer.setClearColor('#6635dc', 1)
  renderer.shadowMap.enabled = true

  // Setup a camera
  const camera = new THREE.PerspectiveCamera(45, 1, 0.01, 100);
  camera.position.set(2, 5, -3);
  camera.lookAt(new THREE.Vector3());

  // Setup camera controller
  const controls = new THREE.OrbitControls(camera);

  // Setup your scene
  const scene = new THREE.Scene();



  // const mesh = new THREE.LineSegments(
  //   new THREE.EdgesGeometry(
  //     new THREE.BoxGeometry(0.2, 0.04, 0.2)
  //   ),
  //   new THREE.LineBasicMaterial({
  //     color: 'white',
  //     linewidth: 1,
  //     linecap: 'round', //ignored by WebGLRenderer
  //     linejoin:  'round' //ignored by WebGLRenderer
  //   })
  // )
  // scene.add(mesh)

  const numCols = 50
  const numRows = 50

  const colors = gradient_color(['white', 'white'], numCols * numRows)

  let tempGrid = []

  ;[...Array(numCols)].map((_, c) => {
    [...Array(numRows)].map((_, r) => {

      const offset = 0.18
      const size = 0.3

      const lengthAndOffset = size + offset

      const totalLength = (lengthAndOffset * numCols) / 2

      const mesh = new THREE.LineSegments(
        new THREE.EdgesGeometry(
          new THREE.BoxGeometry(size, 0.1, size)
        ),
        new THREE.LineBasicMaterial({
          color: colors[c * r],
          linewidth: 1,
          linecap: 'round', //ignored by WebGLRenderer
          linejoin:  'round' //ignored by WebGLRenderer
        })
      )

      const amplitude = 0.2
      const x = c * lengthAndOffset - totalLength
      const y = r * lengthAndOffset - totalLength
      const z = Math.sin(c * r / 30) * amplitude

      mesh.position.set(
        x,
        // z,
        0,
        y
      )

      scene.add(mesh)

      tempGrid.push({
        r,
        c,
        mesh,
      })
    })
  })

  const grid = [...tempGrid]

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
      camera.updateProjectionMatrix();
    },
    // Update & render your scene here
    render ({ time, playhead }) {
      // mesh.rotation.y = time * (10 * Math.PI / 180)

      const animations = [
        {
          startFloat: 0,
          endFloat: 0.2,
          animationCallback: () => {

          },
        },
        {
          startFloat: 0,
          endFloat: 1,
          animationCallback: (animationPlayhead, infinitePlayheadOffset) => {

            // console.log(grid)

            // const easedPlayhead = eases.sineIn(animationPlayhead)

            function stdNormalDistribution (x) {
              return Math.pow(Math.E,-Math.pow(x,2)/2)/Math.sqrt(2*Math.PI)
            }

            function plotOnBell(x,scale){
              //This is the real workhorse of this algorithm. It returns values along a bell curve from 0 - 1 - 0 with an input of 0 - 1.
              scale = scale || false;
              var stdD = .125
              var mean = .5
              if(scale){
                return  1 / (( 1/( stdD * Math.sqrt(2 * Math.PI) ) ) * Math.pow(Math.E , -1 * Math.pow(x - mean, 2) / (2 * Math.pow(stdD,2))));
              }else{
                return (( 1/( stdD * Math.sqrt(2 * Math.PI) ) ) * Math.pow(Math.E , -1 * Math.pow(x - mean, 2) / (2 * Math.pow(stdD,2)))) * plotOnBell(.5,true);
              }
            }

            // const pointInWave = plotOnBell(animationPlayhead) / 3

            const pointInWave = plotOnBell(animationPlayhead)

            grid.map(({ mesh, r, c }) => {

              const waveSize = 1

              mesh.rotation.z = pointInWave * c / (Math.PI * 1.2 )
              const z = (Math.sin(c * r / 30) * infinitePlayheadOffset) / 60

              // mesh.position.y = z

              // mesh.scale.y = c * pointInWave / 20 + 1
            })


          },
        },
        {
          startFloat: 0.8,
          endFloat: 1,
          animationCallback: () => {

          },
        },

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
