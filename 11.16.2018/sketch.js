const canvasSketch = require('canvas-sketch');

// Ensure ThreeJS is in global scope for the 'examples/'
global.THREE = require('three');

// Include any additional ThreeJS examples below
require('three/examples/js/controls/OrbitControls');





const settings = {
  // Make the loop animated
  animate: true,
  fps: 30,
  dimensions: [1024, 1024],
  duration: 4,

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
  renderer.setClearColor('black', 1)





  // Setup a camera
  const camera = new THREE.PerspectiveCamera(45, 1, 0.01, 100);
  camera.position.set(2, 2, -4);
  camera.lookAt(
    new THREE.Vector3()
  )

  // Setup camera controller
  const controls = new THREE.OrbitControls(camera);




  const mesh = new THREE.Mesh(
    new THREE.TetrahedronGeometry(1, 0),
    new THREE.MeshPhysicalMaterial({
      color: 'white',
      roughness: 0.75,
      flatShading: true
    })
  )
  const mesh1 = new THREE.Mesh(
    new THREE.TetrahedronGeometry(1, 0),
    new THREE.MeshPhysicalMaterial({
      color: 'white',
      roughness: 0.75,
      flatShading: true
    })
  )
  const mesh2 = new THREE.Mesh(
    new THREE.TetrahedronGeometry(1, 0),
    new THREE.MeshPhysicalMaterial({
      color: 'white',
      roughness: 0.75,
      flatShading: true
    })
  )

  const r = Math.PI / 3

  mesh1.rotation.set(1.5, 0, 0)
  mesh2.rotation.set(0, 0, 0)

  scene.add(
    mesh,
    mesh1,
    // mesh2
  )

  window.mesh2 = mesh2






  // Specify an ambient/unlit colour
  scene.add(new THREE.AmbientLight('#59314f'));

  // Add some light
  const light = new THREE.PointLight('#45caf7', 1, 15.5);
  light.position.set(2, 2, -4).multiplyScalar(1.5);
  scene.add(light);




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





      const speed = 1
      const rotation = playhead * Math.PI * speed


      // mesh.rotation.y = rotation
      //




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
