/**
 * minimalistic dependency-loader using rawgit to fetch javascript-files
 * from github.
 */
function loadDeps(deps) {
  const githubUrl = (project, file) =>
    `https://cdn.rawgit.com/${project}/master/${file}`;

  function loadScripts(scripts) {
    return Promise.all(scripts.map(
      src => new Promise(resolve => {
        const s = document.createElement('script');
        s.onload = resolve;
        s.src = src;
        document.body.appendChild(s);
      })
    ));
  }

  const urls = [];
  Object.keys(deps).forEach(project => {
    urls.push(...deps[project].map(githubUrl.bind(null, project)));
  });

  return loadScripts(urls);
}

const deps = {
  'gorhill/Javascript-Voronoi': [
    'rhill-voronoi-core.js'
  ]
};

loadDeps(deps).then(boot);


import eases from 'eases'
import gradient_color from 'gradient-color'


const canvasSketch = require('canvas-sketch');

// Ensure ThreeJS is in global scope for the 'examples/'
global.THREE = require('three');

// Include any additional ThreeJS examples below
require('three/examples/js/controls/OrbitControls');


const duration = 45

const settings = {
  // Make the loop animated
  animate: true,
  // Get a WebGL canvas rather than 2D
  context: 'webgl',
  // Turn on MSAA
  attributes: { antialias: true },
  duration,
  fps: 30,
}


function boot() {

  const meshes = []
  const AREA_SIZE = 200

  const sites = [...Array(AREA_SIZE)].map((_, i) => {
    return {
      x: Math.random(),
      y: Math.random()
    }
  })

  const voronoi = new Voronoi();
  const result = voronoi.compute(sites, {
    xl:0, xr:1,
    yt:0, yb:1
  });



  const sketch = ({ context }) => {
    // Create a renderer
    const renderer = new THREE.WebGLRenderer({
      context
    });

    renderer.shadowMap.enabled = true;


    // WebGL background color
    // renderer.setClearColor('black', 1);

    //CAMERA
    const camera = new THREE.PerspectiveCamera(45, 1, 0.01, 100);
    // camera.controls = new THREE.OrbitControls(camera)

    const CAMERA_Y = 110

    const cameraDistanceFromCenter = 0

    camera.position.set(-cameraDistanceFromCenter, CAMERA_Y, cameraDistanceFromCenter);
    camera.lookAt(new THREE.Vector3(0, 0,0));

    camera.far = 1000

    // Setup camera controller
    const controls = new THREE.OrbitControls(camera, context.canvas);

    // Setup your scene
    const scene = new THREE.Scene()


    const near = 1;
    const far = 500;
    const color = 'black';
    // scene.fog = new THREE.Fog(color, near, far)
    scene.background = new THREE.Color(color)

    const extrudeSettings = {
      steps: 2,
      depth: 0.1,
      bevelEnabled: true,
      bevelThickness: 0.05,
      bevelSize: 0.01,
      bevelSegments: 4
    };

    const group = new THREE.Group();
    group.position.y = -5;

    scene.add(group);

    const vertexOffset = new THREE.Vector2(-AREA_SIZE/2, -AREA_SIZE/2);
    const rotation = new THREE.Matrix4().makeRotationX(-Math.PI/2);
    const colors = gradient_color(['white', 'white'].reverse(), result.cells.length)
    const size = result.cells.length

    result.cells.forEach((cell, ci) => {

      const xCoord = .5 - cell.site.x
      const yCoord = .5 - cell.site.y


      const xDistance = Math.abs(xCoord) * size
      const yDistance = Math.abs(yCoord) * size


      const distanceFromCenter = xDistance + yDistance

      const indexFromDistance = Math.floor(distanceFromCenter)

      const color = colors[indexFromDistance]

      const points = []
      for (let i = 0; i < cell.halfedges.length; i++) {
        const start = cell.halfedges[i].getStartpoint();

        points.push(
          new THREE.Vector2().copy(start)
            .multiplyScalar(AREA_SIZE).add(vertexOffset)
        )
      }
      points.push(points[0])

      const material = new THREE.MeshPhysicalMaterial({
        color: 'white',
        roughness: 1,
      })

      const offset = -0.4 * Math.sqrt(Math.abs(THREE.ShapeUtils.area(points)));
      const shape = new THREE.Shape(points);
      const geometry = new THREE.ExtrudeGeometry(shape, Object.assign({}, extrudeSettings, {
        // depth: 20 + offset
      }))

      const mesh = new THREE.Mesh(
        geometry,
        material
      )

      mesh.scale.y = 8
      mesh.geometry.applyMatrix(rotation)
      mesh.castShadow = true
      mesh.receiveShadow = true

      const pivot = new THREE.Group()

      scene.add( pivot )
      pivot.add( mesh )

      const box = new THREE.Box3().setFromObject( pivot )
      const center = box.getCenter()


      mesh.geometry.center()
      pivot.translateX(center.x)
      pivot.translateY(center.y)
      pivot.translateZ(center.z)

      meshes.push({
        mesh,
        pivot,
        center,
        cell,
        ci,
        indexFromDistance,
        xCoord,
        yCoord,
      })

    })

    function addShape(color, x, y, z, rx, ry, rz, s) {

      const hexShape = new THREE.Shape();
      hexShape.moveTo(0, 0.6);
      hexShape.lineTo(0.3, 0.3);
      hexShape.lineTo(0.2, 0);
      hexShape.lineTo(-0.2, 0);
      hexShape.lineTo(-0.3, 0.3);
      hexShape.lineTo(0, 0.6);

      const minLength = 18

      const hexExtrudeSettings = {
        depth: (Math.random() * 3) + minLength,
        bevelEnabled: true,
        bevelSegments: 1,
        steps: 1,
        bevelSize: (Math.random() * 1) + 1.5,
        bevelThickness: (Math.random() * 1) + 2.5
      }

      const geo = new THREE.ExtrudeGeometry(hexShape, hexExtrudeSettings);

      const mat = new THREE.MeshStandardMaterial({
        color: '#b279f4',
        roughness: 0.55,
        metalness: 0.8,
      })

      const mes = new THREE.Mesh(geo, mat)

      mes.geometry.center()
      mes.position.set(x, y, z);
      mes.scale.set(s, s, s);

      mes.castShadow = true
      mes.receiveShadow = true

      return mes
    }

    // mouse controls
    const boxGeo = new THREE.BoxGeometry(8, 6, 4);
    boxGeo.translate(0, 0, 0)
    boxGeo.rotateX(Math.PI / 2)

    const boxMat = new THREE.MeshNormalMaterial()
    const box = new THREE.Mesh(boxGeo, boxMat)
    box.lookAt(new THREE.Vector3(0, 1, 0))

    let mouse = new THREE.Vector2()

    // orb field
    const lengthFromCenter = 46
    const orbRadius = 25
    const distanceDown = 11

    const onmousemove = (event) => {

      // mouse to orb field
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

      box.position.x = lengthFromCenter * mouse.x
      box.position.z = lengthFromCenter * -mouse.y

      box.position.y = 10

      meshes.map(({ pivot, center  }, i) => {

        const distanceFromMouseX = center.x - box.position.x
        const distanceFromMouseY = center.z - box.position.z

        const distanceFromMouse = Math.sqrt(Math.pow(distanceFromMouseX, 2) + Math.pow(distanceFromMouseY, 2))

        const distance = Math.max(distanceFromMouse, 1)

        const rotation = new THREE.Vector3(pivot.rotation.x, pivot.rotation.y, pivot.rotation.z)

        pivot.lookAt(box.position)

        const lookAtRotation = new THREE.Vector3(pivot.rotation.x, pivot.rotation.y, pivot.rotation.z)

        const lookAtZ = lookAtRotation.z

        const percentDistance = distance / orbRadius

        let newRotationZ = rotation.z

        // if (distance < orbRadius) {
          newRotationZ = lookAtZ / distance
        // }

        const newRotation = new THREE.Vector3(rotation.x, rotation.y, newRotationZ)

        pivot.rotation.set(newRotation.x, newRotation.y, newRotation.z)

        if (distance < orbRadius) {
          pivot.position.y = -distanceDown * (1 - eases.quadInOut(percentDistance))
        }

      })
    }

    onmousemove({ clientX: 0, clientY: 0, })
    window.addEventListener("mousemove", onmousemove, false)

    // lights

    const crystalPointLight = new THREE.PointLight('#b146ff', 0.3, 100 )
    crystalPointLight.position.set(0, -10, 0);
    crystalPointLight.castShadow = true;

    const crystalPointLight2 = new THREE.PointLight('#5854ff', 0.65, 100 )
    crystalPointLight2.position.set(50, -80, 45);
    crystalPointLight2.castShadow = true;

    const crystalPointLight3 = new THREE.PointLight('#5854ff', 0.3, 100 )
    crystalPointLight3.position.set(-0, -10, -0);
    crystalPointLight3.castShadow = true;

    const crystalPointLight4 = new THREE.PointLight('#5854ff', 0.6, 100 )
    crystalPointLight4.position.set(-40, -70, 45);
    crystalPointLight4.castShadow = true;

    const tilePointLight2 = new THREE.PointLight('white', 0.75, 100 )
    tilePointLight2.position.set(50, 40, 50);
    tilePointLight2.castShadow = true;
    const tilePointLight3 = new THREE.PointLight('white', 0.75, 100 )
    tilePointLight3.position.set(-50, 60, -50);
    tilePointLight3.castShadow = true;
    const tilePointLight4 = new THREE.PointLight('white', 0.5, 100 )
    tilePointLight4.position.set(-25, 70, 50);
    tilePointLight4.castShadow = true;

    scene.add(
      crystalPointLight,
      crystalPointLight2,
      crystalPointLight3,
      crystalPointLight4,
      tilePointLight2,
      tilePointLight3,
      tilePointLight4,
    );

    // const crystalPointLightHelper = new THREE.PointLightHelper( crystalPointLight, 1 );
    const crystalPointLightHelper2 = new THREE.PointLightHelper( crystalPointLight2, 1 );
    const crystalPointLightHelper3 = new THREE.PointLightHelper( crystalPointLight3, 1 );
    const crystalPointLightHelper4 = new THREE.PointLightHelper( crystalPointLight4, 1 );
    // const tilePointLightHelper2 = new THREE.PointLightHelper( tilePointLight2, 1 );
    // const tilePointLightHelper3 = new THREE.PointLightHelper( tilePointLight3, 1 );
    // const tilePointLightHelper4 = new THREE.PointLightHelper( tilePointLight4, 1 );
    // const paperPointLightHelper = new THREE.PointLightHelper( paperPointLight, 1 );


    const ambLight2 = new THREE.AmbientLight('#fff', 1.5);

    scene.add(
      // ambLight,
      ambLight2,
    )

    // scene.add(crystalPointLightHelper)
    // scene.add(crystalPointLightHelper2)
    // scene.add(crystalPointLightHelper3)
    // scene.add(crystalPointLightHelper4)
    // scene.add(tilePointLightHelper2)
    // scene.add(tilePointLightHelper3)
    // scene.add(tilePointLightHelper4)
    // scene.add(paperPointLightHelper)

    // background
    const crystalDistanceFromCamera = cameraDistanceFromCenter + 20

    const crystalY = -60

    const crystalDistanceFromCenter = cameraDistanceFromCenter - crystalDistanceFromCamera

    const crystal = addShape(
      'purple', // color
      -0, // x pos
      crystalY, // y pos
      0, // z pos
      Math.random() * 2 * Math.PI, // x rotation
      Math.random() * 2 * Math.PI, // y rotation
      Math.random() * 2 * Math.PI, // z rotation
      5
    )

    const degreesX = 45
    const degreesZ = 25

    crystal.rotation.x = Math.PI * 2 * (degreesX/360)
    crystal.rotation.z = Math.PI * 2 * (degreesZ/360)

    const crystalGroup = new THREE.Group()

    crystalGroup.add(crystal)

    scene.add(crystalGroup)

    const fieldDistance = 400
    const maxRadius = 1

    const colorTop = 'hsl(266, 73%, 8%)'
    const colorBottom = 'hsl(293, 68%, 13%)'

    const gradientMaterial = new THREE.ShaderMaterial({
      uniforms: {
        color1: {
          value: new THREE.Color(colorBottom)
        },
        color2: {
          value: new THREE.Color(colorTop)
        }
      },
      vertexShader: `
    varying vec2 vUv;

    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
    }
  `,
      fragmentShader: `
    uniform vec3 color1;
    uniform vec3 color2;
  
    varying vec2 vUv;
    
    void main() {
      
      gl_FragColor = vec4(mix(color1, color2, vUv.y), 1.0);
    }
  `,
    })

    const geometry = new THREE.BoxGeometry(
      700,
      2,
      700,
    )

    const geometryPaper = new THREE.BoxGeometry(
      70,
      2,
      100,
    )

    const plane = new THREE.Mesh( geometry, gradientMaterial )
    const paper = new THREE.Mesh( geometryPaper, new THREE.MeshStandardMaterial() )

    paper.castShadow = true
    paper.receiveShadow = true
    // plane.rotation.x = Math.PI / 2

    paper.material.colorWrite = false;
    paper.material.depthWrite = false;
    // paper.material.transparent = true; // only needed if there are other transparent objects
    paper.renderOrder = Infinity;

    paper.position.y = 10
    paper.position.z = 0

    // scene.add(paper)

    plane.position.y = -400;

    scene.add( plane )

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

        // crystal.rotation.z = Math.PI * 2 * playhead * 4
        crystalGroup.rotation.y = Math.PI * 2 * playhead * 4

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

  canvasSketch(sketch, settings)

}

