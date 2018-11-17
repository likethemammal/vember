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
  duration: 8,
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
  renderer.shadowMap.enabled = true;


  // Setup a camera
  const camera = new THREE.PerspectiveCamera(45, 1, 0.01, 100);
  camera.position.set(-8, -8, 8);
  // camera.lookAt(new THREE.Vector3())

  camera.far = 1000

  // Setup camera controller
  const controls = new THREE.OrbitControls(camera);

  // Setup your scene
  const scene = new THREE.Scene()

  const sugarWidth = randBetween(1, 3)
  const sugarLength = randBetween(1, 3)
  const sugarDepth = randBetween(1, 3)

  const sugarShape = new THREE.Shape()

  // sugarShape.moveTo(randBetween(0,1.5),randBetween(0,1.5))
  // sugarShape.lineTo(randBetween(0, 1.5), sugarWidth)
  // sugarShape.lineTo(sugarLength, sugarWidth)
  // sugarShape.lineTo(sugarLength, randBetween(0, 1.5))
  // sugarShape.lineTo(randBetween(0,1.5),randBetween(0,1.5))
  //
  //
  //

  // sugarShape.moveTo( 25, 25 );
  // sugarShape.bezierCurveTo( 25, 25, 20, 0, 0, 0 );
  // sugarShape.bezierCurveTo( 30, 0, 30, 35,30,35 );
  // sugarShape.bezierCurveTo( 30, 55, 10, 77, 25, 95 );
  // sugarShape.bezierCurveTo( 60, 77, 80, 55, 80, 35 );
  // sugarShape.bezierCurveTo( 80, 35, 80, 0, 50, 0 );
  // sugarShape.bezierCurveTo( 35, 0, 25, 25, 25, 25 );

  var hexShape = new THREE.Shape();
  hexShape.moveTo(0, 0.6);
  hexShape.lineTo(0.3, 0.3);
  hexShape.lineTo(0.2, 0);
  hexShape.lineTo(-0.2, 0);
  hexShape.lineTo(-0.3, 0.3);
  hexShape.lineTo(0, 0.6);

  var hexExtrudeSettings = {
    depth: Math.random() * 6,
    bevelEnabled: true,
    bevelSegments: 1,
    steps: 1,
    bevelSize: (Math.random() * 1) + 1.5,
    bevelThickness: (Math.random() * 1) + 2.5
  };




  // points - (x, y) pairs are rotated around the y-axis
  // var points = [];
  // for ( var deg = 0; deg <= 80; deg += 6 ) {
  //
  //   var rad = Math.PI * deg / 80;
  //   var point = new THREE.Vector2( ( 0.72 + .08 * Math.cos( rad ) ) * Math.sin( rad ), - Math.cos( rad ) ); // the "egg equation"
  //   //console.log( point ); // x-coord should be greater than zero to avoid degenerate triangles; it is not in this formula.
  //   points.push( point );
  //
  // }

  const group = new THREE.Group();
  group.position.y = 0;
  scene.add(group);

  var mesh = new THREE.Mesh(
    new THREE.BoxGeometry(0.1, 40, 40),
    new THREE.MeshStandardMaterial({
      color: '#aaa'
    })
  )

  mesh.position.set(-4, -6, 2,)
  mesh.receiveShadow = true
  mesh.castShadow = true
  // mesh.lookAt(camera)

  mesh.position.set(0, 6, -4)

  mesh.rotation.set(
    0,
    (Math.PI / 180) * 45,
    // 0,
    (Math.PI / 180) * 35,
    // 0,
  )

  scene.add(mesh)


  function addShape(shape, extrudeSettings, color, x, y, z, rx, ry, rz, s) {
    var geo = new THREE.ExtrudeGeometry(shape, extrudeSettings);

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
      // opacity: 0.8,
      depthTest: true,
      depthWrite: false,
      visible: true,
      // side: THREE.DoubleSide,
      // refractionRatio: 0.01,
      specular: 8355711,
      // color: 'white'
      // emissive: 'green',
      // emissiveIntensity: 10,
      // fog: true,
      // color: 'blue'
    });
    var mes = new THREE.Mesh(geo, mat)

    mes.geometry.center()

    mes.position.set(x, y, z);
    // mes.rotation.set(rx, ry, rz);
    mes.scale.set(s, s, s);

    mes.castShadow = true
    mes.receiveShadow = true

    group.add(mes)
  }

  addShape(
    hexShape,
    hexExtrudeSettings,
    0xff3333, // color
    0, // x pos
    0, // y pos
    0, // z pos
    Math.random() * 2 * Math.PI, // x rotation
    Math.random() * 2 * Math.PI, // y rotation
    Math.random() * 2 * Math.PI, // z rotation
    1
  )

  // group.geometry.center()

  // const egg = new THREE.LatheBufferGeometry( points, 32 )


  // const crystal = new THREE.SphereBufferGeometry(5, 32, 32, 10, 10, 10, 10)
  // const crystal = new THREE.SphereBufferGeometry(2, 10, 32, 5)
  //
  //
  // const extrudeSettings = {
  //   steps: 2,
  //   depth: 1,
  //   bevelEnabled: true,
  //   bevelThickness: 1,
  //   bevelSize: 1,
  //   bevelSegments: 2
  // }

  // const geometry = new THREE.ExtrudeGeometry(
  //   sugarShape,
  //   extrudeSettings,
  // )
  //
  // const material = new THREE.MeshPhongMaterial({
  //   transparent: true,
  //   shininess: 50,
  //   depthTest: true,
  //   emissive: 0,
  //   specular: 8355711,
  //   vertexColors: 0,
  //   opacity: 0.4,
  //   side: THREE.BackSide,
  //   // color: 'green'
  // })

  // const mesh = new THREE.Mesh(egg, material)
  // const mesh = new THREE.Mesh(crystal, material)
  //
  // mesh.castShadow = true
  // mesh.receiveShadow = true
  //
  // mesh.geometry.center()
  // scene.add(mesh);




  const shadowLight = new THREE.DirectionalLight(0xffffff, 0.3)
  shadowLight.position.set(2, 10, 1)
  shadowLight.castShadow = true
  const shadowLightHelper = new THREE.DirectionalLightHelper(shadowLight)

  const ambientLight = new THREE.AmbientLight(0xffffff, 0.2)
  const ambientLight2 = new THREE.AmbientLight(0xf1a4ff, 0.2)

  const light1 = new THREE.PointLight( 0xff5de0, 0.3, 100 )
  light1.position.set( 30, 0, 10 )
  light1.castShadow = true
  const light1Helper = new THREE.PointLightHelper(light1)

  const light2 = new THREE.PointLight( 0x5854ff, 0.3, 100 )
  light2.castShadow = true
  light2.position.set( -60, 0, 10 )
  const light2Helper = new THREE.PointLightHelper(light2)

  const light3 = new THREE.PointLight( 0x632ecf, 0.3, 100 )
  // light3.castShadow = true
  light3.position.set( 0, -5, 5)
  const light3Helper = new THREE.PointLightHelper(light3)

  const light4 = new THREE.PointLight( 0x632ecf, 0.2, 100 )
  light4.position.set( -4, 4, 4 )
  // light4.castShadow = true
  const light4Helper = new THREE.PointLightHelper(light4)

  const light5 = new THREE.PointLight( 0x632ecf, 0.2, 100 )
  light5.position.set( -5, -2, 5 )
  // light5.castShadow = true
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
  // scene.add(shadowLightHelper, light1Helper, light2Helper, light3Helper, light4Helper, light5Helper)

  // scene.add(light6Helper)
  console.log(group)

  camera.lookAt(group.position)

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
      // group.rotation.y = playhead * (4 * Math.PI)
      group.rotation.x = playhead * (4 * Math.PI)
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
