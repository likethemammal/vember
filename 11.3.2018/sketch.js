const canvasSketch = require('canvas-sketch');

// Ensure ThreeJS is in global scope for the 'examples/'
global.THREE = require('three');

// Include any additional ThreeJS examples below
require('three/examples/js/controls/OrbitControls');

const settings = {
  // Make the loop animated
  animate: true,
  duration: 1.7,
  dimensions: [512,512],
  fps: 30,
  // Get a WebGL canvas rather than 2D
  context: 'webgl',
  // Turn on MSAA
  attributes: { antialias: true }
};

const sketch = ({ context }) => {
  // Create a renderer
  const renderer = new THREE.WebGLRenderer({
    context,
    alpha: true,
  });

  const scene = new THREE.Scene();


  // WebGL background color
  renderer.setClearColor('#5b2d0c', 1);

  // Setup a camera
  const camera = new THREE.PerspectiveCamera(45, 1, 0.01, 100);
  camera.position.set(2, 0, -2);
  camera.lookAt(0,-0.5,0)
  //
  // scene.add(camera)

  // Setup camera controller
  // const controls = new THREE.OrbitControls(camera);

  // Setup your scene


  const COLOR_GREEN = 'green'
  const COLOR_BROWN = 'brown'
  const COLOR_ORANGE = 'hsl(19, 100%, 60%)'
  const materialOrange = new THREE.MeshPhysicalMaterial( {color: COLOR_ORANGE, flatShading: true, roughness: 1} );
  const materialBrown = new THREE.MeshPhysicalMaterial( {color: COLOR_BROWN, flatShading: true, roughness: 1} );
  const materialGreen = new THREE.MeshPhysicalMaterial( {color: COLOR_GREEN, flatShading: true, roughness: 0.7} );

  const carrots = [
      //diameter
      //height
      //positionY
      //material

    [0.24, 0.09, -0.31, materialOrange],
    [0.315, 0.09, -0.46, materialOrange],
    [0.32, 0.11, -0.61, materialOrange],
    [0.30, 0.11, -0.76, materialOrange],
    [0.27, 0.1, -0.9, materialOrange],
    [0.24, 0.1, -1.04, materialOrange],
    [0.205, 0.09, -1.18, materialOrange],
    [0.16, 0.08, -1.3, materialOrange],
    [0.12, 0.06, -1.41, materialOrange],

    [0.25, 0.07, 0, materialGreen],
    [0.2, 0.07, -0.1, materialGreen],
    [0.18, 0.05, 0.09, materialGreen],

    [0.07, 0.05, -0.2, materialBrown],

  ]

  const meshes = []

  const group = new THREE.Group();

  const cylinderOffset = 0.7
  const groupOffset = -0.5

  carrots.map((array) => {
    const geometry = new THREE.CylinderGeometry(
      array[0],
      array[0],
      array[1],
      32,
    )
    const cylinder = new THREE.Mesh( geometry, array[3])

    meshes.push(cylinder)

    group.add(cylinder)

    cylinder.position.set(0, array[2] + cylinderOffset, 0)
  })

  scene.add(group)

  group.position.set(0, groupOffset, 0)
  group.rotation.x = 10
  group.rotation.z = 10

  var geometry = new THREE.PlaneGeometry(10, 10, 32 )
  var material = new THREE.MeshBasicMaterial( {color: 'hsla(212, 80%, 55%, 1)', side: THREE.DoubleSide} )
  var plane = new THREE.Mesh( geometry, material )

  plane.rotation.y = 135 * (Math.PI / 180)
  plane.position.z = 1
  plane.position.x = -2

  scene.add( plane )

  // Specify an ambient/unlit colour
  scene.add(new THREE.AmbientLight('#7a436f'));

  // Add some light
  const light = new THREE.PointLight('#e3e0c0', 3, 15.5);
  light.position.set(2, 2, -4).multiplyScalar(1.5);
  scene.add(light);

  window.scene = scene

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


      const degrees = (playhead) * (Math.PI * 2)

      // const radians = degrees * (Math.PI / 180)

      // meshes.map((cylinder, i) => {
      //   const carrot = carrots[i]
      //
      //
      //
      //   const y = Math.sin(degrees) + (i / 100)
      //
      //   cylinder.position.set(0, carrot[2] + y , 0)
      //
      // })

      // console.log(cylinder1.rotation)

      // console.log(radians, degrees)

      // controls.update();
      // group.rotation.x = degrees
      group.rotation.y = degrees
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
