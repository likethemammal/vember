const canvasSketch = require('canvas-sketch');

// Ensure ThreeJS is in global scope for the 'examples/'
global.THREE = require('three');

// Include any additional ThreeJS examples below
require('three/examples/js/controls/OrbitControls');


const ANIMATION_SPEED = 1
let clicked = false

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

const sketch = ({ context, canvas }) => {


  canvas.onclick= () => {
    clicked = !clicked
  }


  // Create a renderer
  const renderer = new THREE.WebGLRenderer({
    context
  });
  const scene = new THREE.Scene();

  // WebGL background color
  renderer.setClearColor('black', 1)
  renderer.shadowMap.enabled = true





  // Setup a camera
  const camera = new THREE.PerspectiveCamera(45, 1, 0.01, 100);
  camera.position.set(2, 1.5, -3);
  camera.lookAt(
    new THREE.Vector3()
  )

  camera.far = 1000

  // Setup camera controller
  const controls = new THREE.OrbitControls(camera);


  function createStar(_, i) {

    const geometry = new THREE.TetrahedronGeometry(1, 0)
    const material = new THREE.MeshPhysicalMaterial({
      // color: '#d89ef4',
      // // opacity: 0.2,
      // transparent: true,
      // // depthTest: true,
      // // depthWrite: false,
      // visible: true,
      // specular: 8355711,

    })

    // const mesh = new THREE.Mesh(
    //   geometry,
    //   material,
    // )
    // const mesh1 = new THREE.Mesh(
    //   geometry,
    //   material
    // )
    // const mesh2 = new THREE.Mesh(
    //   geometry,
    //   material
    // )
    // const mesh3 = new THREE.Mesh(
    //   geometry,
    //   material
    // )
    //
    // const mesh4 = new THREE.Mesh(
    //   geometry,
    //   material
    // )
    //
    // const mesh5 = new THREE.Mesh(
    //   geometry,
    //   material
    // )

    // const meshes = [
    //   // mesh,
    //   // mesh1,
    //   // mesh2,
    //   // mesh3,
    //   // mesh4,
    //   // mesh5,
    // ]

    const meshes = [...Array(45)].map(() => {
      return new THREE.Mesh(
        geometry,
        material,
      )
    })



    const current = 0.75
    const speed = 1
    const rotation = current * Math.PI * speed

    const geom = new THREE.Geometry();

    const finalMaterial = new THREE.MeshPhysicalMaterial({
      // color: 'white',
      roughness: 0.46,
      flatShading: true,

      color: '#dde',
      // opacity: 0.8,
      transparent: true,
      // depthTest: true,
      // depthWrite: false,
      visible: true,
      specular: 8355711,

    })


    meshes.map((mesh, i) => {
      mesh.rotation.x = i * .2
      mesh.rotation.y = i * .2
      mesh.rotation.z = i * .2
    })

    // mesh.rotation.x = rotation
    // mesh.rotation.z = rotation
    //
    // mesh1.rotation.x = 1
    // mesh1.rotation.y = 2.4
    //
    // mesh2.rotation.z = rotation
    // mesh2.rotation.y = rotation
    //
    // mesh3.rotation.z = rotation
    // mesh4.rotation.y = rotation
    // mesh5.rotation.x = rotation

    meshes.map((m) => {

      m.updateMatrix()


      geom.merge(m.geometry, m.matrix)
    })

    const totalMesh = new THREE.Mesh(geom, finalMaterial)


    totalMesh.castShadow = true

    scene.add(totalMesh)

    return totalMesh
  }


  const stars = [...Array(10)].map(createStar)

  const background = new THREE.Mesh(
    new THREE.BoxGeometry(0.1, 100, 100),
    new THREE.MeshStandardMaterial({
      color: '#9f9f9f',
      roughness: 0.8,
      flatShading: true,
    })
  )

  background.position.set(0, 0, 5)

  background.receiveShadow = true

  background.rotation.set(
    0,
    (Math.PI / 180) * 90,
    // 0,
    (Math.PI / 180) * 45,
    // 0,
  )

  scene.add(background)


  const shadowLight = new THREE.DirectionalLight(0xffffff, 0.04)
  shadowLight.position.set(6.5, 1.5, -5)
  shadowLight.castShadow = true
  const shadowLightHelper = new THREE.DirectionalLightHelper(shadowLight)

  // const ambientLight = new THREE.AmbientLight(0xffffff, 0.3)
  // const ambientLight2 = new THREE.AmbientLight('#f1a4ff', 0.2)

  const ambientLight = new THREE.AmbientLight(0xffffff, 0.12)
  const ambientLight2 = new THREE.AmbientLight('#4902ff', 0.3)

  const light1 = new THREE.PointLight('hsl(240, 100%, 64%)', 0.6, 100 )
  light1.position.set( 4, 3, -5 )
  // light1.castShadow = true
  const light1Helper = new THREE.PointLightHelper(light1)

  const light2 = new THREE.PointLight('#cffcff', 0.22, 100 )
  // light2.castShadow = true
  light2.position.set( 0, 30, 0 )
  const light2Helper = new THREE.PointLightHelper(light2)

  const light3 = new THREE.PointLight('#632ecf', 0.3, 500 )
  // light3.castShadow = true
  light3.position.set( 0, 5, 3)
  const light3Helper = new THREE.PointLightHelper(light3)

  const light4 = new THREE.PointLight('#632ecf', 0.2, 100 )
  light4.position.set( -4, 4, -4 )
  // light4.castShadow = true
  const light4Helper = new THREE.PointLightHelper(light4)

  const light5 = new THREE.PointLight('#6630f4', 0.5, 100 )
  light5.position.set( -0.3, 0.3, -2.2 )
  // light5.castShadow = true
  const light5Helper = new THREE.PointLightHelper(light5)

  const light6 = new THREE.PointLight('#3c22cb', .5, 200 )
  light6.position.set(1, 0.3, -1)
  // light6.castShadow = true
  // light6.castShadow = true
  const light6Helper = new THREE.PointLightHelper(light6)

  scene.add(
    shadowLight,
    ambientLight,
    ambientLight2,
    light1,
    light2,
    light3,
    light4,
    light5,
    light6
  )
  scene.add(
    // shadowLightHelper,
    // light1Helper,
    // light2Helper,
    // light3Helper,
    // light4Helper,
    // light5Helper,
    // light6Helper,
  )



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







      //
      // if (!clicked) {
      //   const speed = 2
      //   const rotation = playhead * Math.PI * speed
      //   const offsetRotation = playhead * Math.PI
      //
      //
      //   mesh.rotation.x = rotation
      //   mesh.rotation.z = rotation
      //
      //   mesh1.rotation.x = offsetRotation
      //   mesh1.rotation.y = rotation
      //
      //   mesh2.rotation.z = rotation
      //   mesh2.rotation.y = offsetRotation
      //
      //   mesh3.rotation.z = rotation
      //   mesh4.rotation.y = offsetRotation
      //   mesh5.rotation.x = rotation
      //   //
      // }


      stars.map((mesh, i) => {
        mesh.rotation.x = playhead * Math.PI * 2
        // mesh.rotation.y = playhead * Math.PI * 2
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
