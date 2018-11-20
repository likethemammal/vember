const canvasSketch = require('canvas-sketch');

// Ensure ThreeJS is in global scope for the 'examples/'
global.THREE = require('three');

// Include any additional ThreeJS examples below
require('three/examples/js/controls/OrbitControls');


function randBetween(min, max) {
  return (Math.random() * (max - min)) + min;
}

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
  renderer.setClearColor('#be9ef4', 1)
  renderer.shadowMap.enabled = true


  // Setup a camera
  const camera = new THREE.PerspectiveCamera(45, 1, 0.01, 100)
  camera.position.set(0, 3.3, 7.5)
  // camera.position.set(-8, -8, 8)

  // camera.lookAt(new THREE.Vector3())

  camera.far = 1000
  camera.near = 0.1

  // Setup camera controller
  const controls = new THREE.OrbitControls(camera);

  // Setup your scene
  const scene = new THREE.Scene()


  var mesh = new THREE.Mesh(
    new THREE.BoxGeometry(0.1, 100, 100),
    new THREE.MeshStandardMaterial({
      color: '#aaa'
    })
  )

  // mesh.receiveShadow = true
  // mesh.castShadow = true
  // mesh.lookAt(camera)

  // mesh.position.set(0, 6, -4)
  //
  // mesh.rotation.set(
  //   0,
  //   (Math.PI / 180) * 45,
  //   // 0,
  //   (Math.PI / 180) * 35,
  //   // 0,
  // )

  mesh.position.set(0, -10, -20)

  mesh.rotation.set(
    0,
    (Math.PI / 180) * 90,
    // 0,
    (Math.PI / 180) * -55,
    // 0,
  )

  scene.add(mesh)

  function addShape(color, x, y, z, rx, ry, rz, s) {

    const group = new THREE.Group()
    group.position.y = 0

    const hexShape = new THREE.Shape();
    hexShape.moveTo(0, 0.6);
    hexShape.lineTo(0.3, 0.3);
    hexShape.lineTo(0.2, 0);
    hexShape.lineTo(-0.2, 0);
    hexShape.lineTo(-0.3, 0.3);
    hexShape.lineTo(0, 0.6);

    const hexExtrudeSettings = {
      depth: Math.random() * 5.5 + 0.7,
      bevelEnabled: true,
      bevelSegments: 1,
      steps: 1,
      bevelSize: (Math.random() * 1) + 1.5,
      bevelThickness: (Math.random() * 1) + 2.5
    };

    var geo = new THREE.ExtrudeGeometry(hexShape, hexExtrudeSettings);

    // var mat = new THREE.MeshPhongMaterial({
    //   transparent: true,
    //   shininess: 50,
    //   depthTest: true,
    //   emissive: 0,
    //   specular: 8355711,
    //   vertexColors: 0,
    //   opacity: 0.2,
    //   side: THREE.BackSide,
    //   refractionRatio: .09
    // });
    var mat = new THREE.MeshPhysicalMaterial({
      color: '#d89ef4',
      transparent: true,
      depthTest: true,
      depthWrite: false,
      visible: true,
      specular: 8355711,
    });
    var mes = new THREE.Mesh(geo, mat)

    mes.geometry.center()

    mes.position.set(x, y, z);
    // mes.rotation.set(rx, ry, rz);
    mes.scale.set(s, s, s);

    mes.castShadow = true
    mes.receiveShadow = true

    mes.geometry.center()

    // scene.add(group)

    return mes
  }

  const orbitRadius = 2.2
  const numCrystals = 10
  const orbitOriginX = 0
  const orbitOriginY = 0

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

  const crystalGroup = new THREE.Group()

  const crystals = [...Array(numCrystals)].map((_, i) => {
    const flowerAngle = calcAngleFromCenter(i, numCrystals)

    const xOrigin = calcXOnCircle(orbitOriginX, orbitRadius, flowerAngle)
    const yOrigin = calcYOnCircle(orbitOriginY, orbitRadius, flowerAngle)

    const mesh = addShape(
      0xff3333, // color
      xOrigin, // x pos
      0, // y pos
      yOrigin, // z pos
      Math.random() * 2 * Math.PI, // x rotation
      Math.random() * 2 * Math.PI, // y rotation
      Math.random() * 2 * Math.PI, // z rotation
      0.1
    )

    crystalGroup.add(mesh)

    return {
      mesh,
      offset: Math.random() * 360,
      positive: Math.random() >= 0.5,
    }



  })

  // const sphereMat = new THREE.MeshStandardMaterial({
  //   color: '#666'
  // })

  const sphereMat = new THREE.MeshPhysicalMaterial({
    color: '#d89ef4',
    transparent: true,
    depthTest: true,
    depthWrite: false,
    visible: true,
    roughness: 1,
    opacity: 0.3,
    specular: 8355711,
  });

  const sphereMatDark = new THREE.MeshPhysicalMaterial({
    color: '#555',
    transparent: true,
    depthTest: true,
    depthWrite: false,
    visible: true,
    roughness: 0.7,
    specular: 8355711,
  });

  const sphere = new THREE.Mesh(
    new THREE.SphereGeometry(1, 15, 15),
    sphereMatDark,
    // sphereMat,
  )

  sphere.receiveShadow = true
  sphere.castShadow = true

  scene.add(crystalGroup)
  scene.add(sphere)




  const shadowLight = new THREE.DirectionalLight(0xffffff, 0.01)
  shadowLight.position.set(0, 10, 8)
  shadowLight.castShadow = true
  const shadowLightHelper = new THREE.DirectionalLightHelper(shadowLight)

  // const ambientLight = new THREE.AmbientLight(0xffffff, 0.3)
  // const ambientLight2 = new THREE.AmbientLight('#f1a4ff', 0.2)

  const ambientLight = new THREE.AmbientLight(0xffffff, 0.45)
  const ambientLight2 = new THREE.AmbientLight('#4902ff', 0.3)

  const light1 = new THREE.PointLight( '#b146ff', 0.3, 100 )
  light1.position.set( -12, 6, -12 )
  light1.castShadow = true
  const light1Helper = new THREE.PointLightHelper(light1)

  const light2 = new THREE.PointLight( 0x5854ff, 0.3, 100 )
  light2.castShadow = true
  light2.position.set( -60, 5, 10 )
  const light2Helper = new THREE.PointLightHelper(light2)

  const light3 = new THREE.PointLight( 0x632ecf, 0.3, 100 )
  // light3.castShadow = true
  light3.position.set( 5, 5, 4)
  const light3Helper = new THREE.PointLightHelper(light3)

  const light4 = new THREE.PointLight( 0x632ecf, 0.2, 100 )
  light4.position.set( -4, 4, -4 )
  light4.castShadow = true
  const light4Helper = new THREE.PointLightHelper(light4)

  const light5 = new THREE.PointLight( 0x632ecf, 0.4, 100 )
  light5.position.set( -3, 0, 3 )
  light5.castShadow = true
  const light5Helper = new THREE.PointLightHelper(light5)

  const light6 = new THREE.PointLight( 'red', 10, 200 )
  light6.position.set(0, 0, 0)
  light6.castShadow = true
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
    // light6
  )
  scene.add(
    // shadowLightHelper,
    // light1Helper,
    // light2Helper,
    // light3Helper,
    // light4Helper,
    // light5Helper
  )

  // scene.add(light6Helper)

  camera.lookAt(new THREE.Vector3())

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

      crystalGroup.rotation.y = playhead * 2 * Math.PI

      crystals.map(({ mesh, offset, positive }, i) => {

        const sign = (positive ? 1 : -1)

        mesh.rotation.y = (playhead * 2 * Math.PI + offset) * sign
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
