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


const duration = 4

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

  const sketch = ({ context }) => {
    // Create a renderer
    const renderer = new THREE.WebGLRenderer({
      context
    });

    // WebGL background color
    renderer.setClearColor('#fff', 1);

    //CAMERA
    const camera = new THREE.PerspectiveCamera(45, 1, 0.01, 100);
    // camera.controls = new THREE.OrbitControls(camera)

    const CAMERA_Y = 100

    const cameraDistanceFromCenter = 0

    camera.position.set(-cameraDistanceFromCenter, CAMERA_Y, cameraDistanceFromCenter);
    camera.lookAt(new THREE.Vector3(0,CAMERA_Y,0));

    camera.far = 1000

    // Setup camera controller
    const controls = new THREE.OrbitControls(camera, context.canvas);

    // Setup your scene
    const scene = new THREE.Scene()


    const near = 1;
    const far = 1000;
    const color = 'white';
    scene.fog = new THREE.Fog(color, near, far)
    scene.background = new THREE.Color(color)

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

      const material = new THREE.MeshStandardMaterial({
        color: 'white',
        roughness: 1,
      })

      const points = []
      for (let i = 0; i < cell.halfedges.length; i++) {
        const start = cell.halfedges[i].getStartpoint();

        points.push(
          new THREE.Vector2().copy(start)
            .multiplyScalar(AREA_SIZE).add(vertexOffset)
        )
      }
      points.push(points[0])

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
      mesh.geometry.applyMatrix(rotation);
      mesh.castShadow = true;
      mesh.receiveShadow = true;

      const pivot = new THREE.Group();

      scene.add( pivot );
      pivot.add( mesh );

      const box = new THREE.Box3().setFromObject( pivot );
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

      const minLength = 5

      const hexExtrudeSettings = {
        depth: (Math.random() * 3) + minLength,
        bevelEnabled: true,
        bevelSegments: 1,
        steps: 1,
        bevelSize: (Math.random() * 1) + 1.5,
        bevelThickness: (Math.random() * 1) + 2.5
      }

      const geo = new THREE.ExtrudeGeometry(hexShape, hexExtrudeSettings);

      const mat = new THREE.MeshPhysicalMaterial({
        color,
        transparent: true,
        depthTest: true,
        depthWrite: false,
        visible: true,
        specular: 8355711,
        roughness: 20,
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
    const lengthFromCenter = 45
    const orbRadius = 20
    const distanceDown = 6

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
        newRotationZ = lookAtZ / distance

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
    const light = new THREE.PointLight('white', 1.2, 100 )
    light.position.set(30, 50, 10);
    light.castShadow = true;
    const light2 = new THREE.PointLight('white', 1.5, 100 )
    light2.position.set(-60, 50, -15);
    light2.castShadow = true;
    const light3 = new THREE.PointLight('white', 1.1, 100 )
    light3.position.set(-65, 50, 60);
    light3.castShadow = true;
    const light4 = new THREE.PointLight('white', 1.1, 100 )
    light4.position.set(35, 50, 60);
    light4.castShadow = true;
    const light5 = new THREE.PointLight('white', 2, 100 )
    light5.position.set(40, 50, -50);
    light5.castShadow = true;
    scene.add( light, light2, light3, light4, light5 );


    const ambLight = new THREE.AmbientLight('#fff', 0.1);

    scene.add(ambLight)

    // background
    // const crystalDistanceFromCamera = cameraDistanceFromCenter + 20
    //
    // const crystalY = -25
    //
    // const crystalDistanceFromCenter = cameraDistanceFromCenter - crystalDistanceFromCamera
    //
    // const crystal = addShape(
    //   'purple', // color
    //   -crystalDistanceFromCenter, // x pos
    //   crystalY, // y pos
    //   crystalDistanceFromCenter, // z pos
    //   Math.random() * 2 * Math.PI, // x rotation
    //   Math.random() * 2 * Math.PI, // y rotation
    //   Math.random() * 2 * Math.PI, // z rotation
    //   1
    // )
    //
    // scene.add(crystal)

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

