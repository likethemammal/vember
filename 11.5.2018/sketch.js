const canvasSketch = require('canvas-sketch');

import gradient_color from 'gradient-color'

// Ensure ThreeJS is in global scope for the 'examples/'
global.THREE = require('three');

// Include any additional ThreeJS examples below
require('three/examples/js/controls/OrbitControls');

const settings = {
  dimensions: [512, 512],
  // Make the loop animated
  animate: true,
  duration: 4,
  fps: 30,
  // Get a WebGL canvas rather than 2D
  context: 'webgl',
  // Turn on MSAA
  attributes: { antialias: true }
};

const NUM_COLUMNS = 20
const NUM_ROWS = 20

// const colors = gradient_color(['#77A1D3', '#79CBCA', '#79CBCA', '#E684AE', '#E684AE'], 100)
// const colors = gradient_color(['#2193b0', '#6dd5ed'], 100)
// const colors = gradient_color(['#acb6e5', '#86fde8', '#86fde8'], 100)
const colors = gradient_color(['#009FFF', '#009FFF', '#ec2f86'].reverse(), NUM_COLUMNS * NUM_ROWS)


const sketch = ({ context }) => {
  // Create a renderer
  const renderer = new THREE.WebGLRenderer({
    context
  });

  renderer.shadowMap.enabled = true;

  // WebGL background color
  renderer.setClearColor('#bbbbbb', 1);

  // Setup a camera
  const camera = new THREE.PerspectiveCamera(45, 1, 0.01, 100);
  camera.position.set(5, 4, -5);
  camera.lookAt(new THREE.Vector3(-5, 0, 5));

  // Setup camera controller
  // const controls = new THREE.OrbitControls(camera);

  // Setup your scene
  const scene = new THREE.Scene();
  const group = new THREE.Group()
  const MARGIN_SIZE = 0.1

  const planeWidth = (NUM_ROWS + (NUM_ROWS * MARGIN_SIZE)) * 5
  const planeHeight = (NUM_COLUMNS + (NUM_COLUMNS * MARGIN_SIZE)) * 5

  const plane = new THREE.Mesh(
    new THREE.PlaneGeometry(planeWidth, planeHeight, 1),
    new THREE.MeshPhysicalMaterial({
      color: 'white',
      roughness: 0.75,
      flatShading: true
    })
  )
  plane.position.y = 0

  plane.position.x = -5
  plane.position.z = 5

  plane.rotation.x = -90 * (Math.PI / 180)

  plane.receiveShadow = true

  group.add(plane)

  let boxes = [];

  let counter = 0;

  ([...Array(NUM_ROWS)]).map((_, r) => {
    ([...Array(NUM_COLUMNS)]).map((_, c) => {

      const geometry = new THREE.BoxGeometry(1, 1, 1)

      geometry.translate( 0, 0.5, 0 );

      const mesh = new THREE.Mesh(
        geometry,
        new THREE.MeshPhysicalMaterial({
          color: colors[(1 + r) * (1 + c) - 1],
          roughness: 0.75,
          flatShading: true
        })
      )
      counter++


      const x = r + (r * MARGIN_SIZE)
      const z = c + (c * MARGIN_SIZE)

      mesh.position.set(-x, 0, z)
      mesh.castShadow = true
      mesh.receiveShadow = false
      group.add(mesh);

      boxes.push({
        mesh,
        r,
        c,
      })
    })
  })

  scene.add(group)

  // group.position.set(1, 0, -1)

  var light = new THREE.PointLight( 0xffffff, 0.1, 100 );
  light.position.set(4, 2, 6);
  light.castShadow = true;            // default false
  scene.add( light );
  //
  // var pointLightHelper = new THREE.PointLightHelper( light, 1 );
  // scene.add( pointLightHelper );

  var light2 = new THREE.PointLight( 0xffffff, 0.2, 100 );
  light2.position.set(6, 10, 5);
  light2.castShadow = true;
  scene.add( light2 );


  // var pointLightHelper2 = new THREE.PointLightHelper( light2, 1 );
  // scene.add( pointLightHelper2 );

  // Specify an ambient/unlit colour
  scene.add(new THREE.AmbientLight('#eeeeee', 1.5));




  // Add some light
  // const light = new THREE.PointLight('#eeeeee', 1, 15.5);
  // light.position.set(2, 2, -4).multiplyScalar(1.5);
  //
  // light.castShadow = true
  // scene.add(light);
  //
  // // Add some light
  // const light2 = new THREE.PointLight('#eeeeee', 1, 15.5);
  // light2.position.set(2, 10, 0).multiplyScalar(1.5);
  // scene.add(light2);





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

      boxes.map(({
        mesh,
        r,
        c,
      }, i) => {

        const waveSize = 5
        const columnWaveSize = 1 / 10

        const y = Math.abs(
          Math.sin((playhead * Math.PI / 2 * 4) + r / waveSize) + c * columnWaveSize
        )

        mesh.scale.y = y


        // mesh.scale.y = Math.abs(y)

        // mesh.scale.y = playhead * (10 * Math.PI / 180)

        // mesh.scale.y = playhead * (10 * Math.PI / 180)
      })


      // boxes[0].mesh.scale.y = playhead

      // mesh.position.y = height * scale / 2

      // controls.update();
      renderer.render(scene, camera);
    },
    // Dispose of events & renderer for cleaner hot-reloading
    unload () {
      // controls.dispose();
      renderer.dispose();
    }
  };
};

canvasSketch(sketch, settings);
