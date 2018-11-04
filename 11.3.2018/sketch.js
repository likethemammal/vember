const canvasSketch = require('canvas-sketch');

// Ensure ThreeJS is in global scope for the 'examples/'
global.THREE = require('three');

// Include any additional ThreeJS examples below
require('three/examples/js/controls/OrbitControls');

const settings = {
  // Make the loop animated
  animate: true,
  duration: 4,
  fps: 24,
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

  const scene = new THREE.Scene();


  // WebGL background color
  renderer.setClearColor('#000', 1);

  // Setup a camera
  const camera = new THREE.PerspectiveCamera(45, 1, 0.01, 100);
  camera.position.set(2, -1, -2);
  // camera.lookAt(0,-1,0)
  //
  // scene.add(camera)

  // Setup camera controller
  const controls = new THREE.OrbitControls(camera);

  // Setup your scene


  const COLOR_GREEN = 'green'
  const COLOR_BROWN = 'brown'
  const COLOR_ORANGE = 'hsl(19, 100%, 60%)'
  const materialOrange = new THREE.MeshPhysicalMaterial( {color: COLOR_ORANGE, flatShading: true, roughness: 1} );
  const materialBrown = new THREE.MeshPhysicalMaterial( {color: COLOR_BROWN, flatShading: true, roughness: 1} );
  const materialGreen = new THREE.MeshPhysicalMaterial( {color: COLOR_GREEN, flatShading: true, roughness: 0.7} );

  //slices
  const geometry3 = new THREE.CylinderGeometry( 0.24, 0.24, 0.09, 32 )
  const geometry4 = new THREE.CylinderGeometry( 0.315, 0.315, 0.09, 32 )
  const geometry5 = new THREE.CylinderGeometry( 0.32, 0.32, 0.11, 32 )
  const geometry6 = new THREE.CylinderGeometry( 0.30, 0.30, 0.11, 32 )
  const geometry7 = new THREE.CylinderGeometry( 0.27, 0.27, 0.10, 32 )
  const geometry8 = new THREE.CylinderGeometry( 0.24, 0.24, 0.10, 32 )
  const geometry9 = new THREE.CylinderGeometry( 0.205, 0.205, 0.09, 32 )
  const geometry10 = new THREE.CylinderGeometry( 0.16, 0.16, 0.08, 32 )
  const geometry13 = new THREE.CylinderGeometry( 0.12, 0.12, 0.06, 32 )

  //leaves
  const geometry1 = new THREE.CylinderGeometry( 0.25, 0.25, 0.07, 32 )
  const geometry2 = new THREE.CylinderGeometry( 0.2, 0.2, 0.07, 32 )
  const geometry11 = new THREE.CylinderGeometry( 0.18, 0.18, 0.05, 32 )

  //stem
  const geometry12 = new THREE.CylinderGeometry( 0.07, 0.07, 0.05, 32 )

  const cylinder1 = new THREE.Mesh( geometry1, materialGreen )
  const cylinder2 = new THREE.Mesh( geometry2, materialGreen )
  const cylinder3 = new THREE.Mesh( geometry3, materialOrange )
  const cylinder4 = new THREE.Mesh( geometry4, materialOrange )
  const cylinder5 = new THREE.Mesh( geometry5, materialOrange )
  const cylinder6 = new THREE.Mesh( geometry6, materialOrange )
  const cylinder7 = new THREE.Mesh( geometry7, materialOrange )
  const cylinder8 = new THREE.Mesh( geometry8, materialOrange )
  const cylinder9 = new THREE.Mesh( geometry9, materialOrange )
  const cylinder10 = new THREE.Mesh( geometry10, materialOrange )
  const cylinder11 = new THREE.Mesh( geometry11, materialGreen )
  const cylinder12 = new THREE.Mesh( geometry12, materialBrown )
  const cylinder13 = new THREE.Mesh( geometry13, materialOrange )

  scene.add( cylinder1 )
  scene.add( cylinder2 )
  scene.add( cylinder3 )
  scene.add( cylinder4 )
  scene.add( cylinder5 )
  scene.add( cylinder6 )
  scene.add( cylinder7 )
  scene.add( cylinder8 )
  scene.add( cylinder9 )
  scene.add( cylinder10 )
  scene.add( cylinder11 )
  scene.add( cylinder12 )
  scene.add( cylinder13 )

  //stem
  cylinder12.position.set(0, -0.2, 0,)

  //leaves
  cylinder11.position.set(0, 0.09, 0,)
  cylinder2.position.set(0, -0.1, 0,)

  //slices
  cylinder3.position.set(0, -0.31, 0,)
  cylinder4.position.set(0, -0.46, 0,)
  cylinder5.position.set(0, -0.61, 0,)
  cylinder6.position.set(0, -0.76, 0,)
  cylinder7.position.set(0, -0.9, 0,)
  cylinder8.position.set(0, -1.04, 0,)
  cylinder9.position.set(0, -1.18, 0,)
  cylinder10.position.set(0, -1.3, 0,)
  cylinder13.position.set(0, -1.41, 0,)



  // Specify an ambient/unlit colour
  scene.add(new THREE.AmbientLight('#59314f'));

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
    render ({ time }) {
      // cylinder.rotation.x = time * (0.5 * Math.PI / 180);
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
