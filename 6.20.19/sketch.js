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
    const far = 200;
    const color = 'white';
    // scene.fog = new THREE.Fog(color, near, far)
    scene.background = new THREE.Color(color)

    const AREA_SIZE = 200

    const sites = [...Array(AREA_SIZE)].map((_, i) => {
      return {
        x: Math.random(),
        y: Math.random()
      }
    })

    // window.sites = sites

    const meshes = []


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
    // const colors = gradient_color(['hsla(120, 63%, 40%, 1)', 'hsla(120, 63%, 40%, 1)', 'hsl(73, 73%, 69%)', 'tan', 'hsl(211, 100%, 50%)'].reverse(), result.cells.length)
    // const colors = gradient_color(['brown', 'tan', 'hsla(39, 86%, 50%, 1)', 'hsla(0, 81%, 50%, 1)'].reverse(), result.cells.length)
    const colors = gradient_color(['white', 'white'].reverse(), result.cells.length)

    //total / 2 = middle index

    // range from middle index = offset

    result.cells.forEach((cell, ci) => {

      const xCoord = .5 - cell.site.x
      const yCoord = .5 - cell.site.y


      const size = result.cells.length

      const xDistance = Math.abs(xCoord) * size
      const yDistance = Math.abs(yCoord) * size


      const distanceFromCenter = xDistance + yDistance

      const indexFromDistance = Math.floor(distanceFromCenter)


      const material = new THREE.MeshStandardMaterial({
        color: colors[indexFromDistance],
        roughness: 1,
      });

      const points = [];
      for (let i = 0; i < cell.halfedges.length; i++) {
        const start = cell.halfedges[i].getStartpoint();

        points.push(
          new THREE.Vector2().copy(start)
            .multiplyScalar(AREA_SIZE).add(vertexOffset)
        );
      }
      points.push(points[0]);

      const offset = -0.4 * Math.sqrt(Math.abs(THREE.ShapeUtils.area(points)));
      const shape = new THREE.Shape(points);
      const geometry = new THREE.ExtrudeGeometry(shape, Object.assign({}, extrudeSettings, {
        // depth: 20 + offset
      }))
      const mesh = new THREE.Mesh(
        geometry,
        material
      );

      mesh.scale.y = 8
      mesh.geometry.applyMatrix(rotation);
      mesh.castShadow = true;
      mesh.receiveShadow = true;

      const pivot = new THREE.Group();


      scene.add( pivot );
      pivot.add( mesh );
      // pivot.geometry.center()

      const box = new THREE.Box3().setFromObject( pivot );

      // var helper = new THREE.Box3Helper( box, 0xffff00 );
      // scene.add( helper );

      const center = box.getCenter()


      mesh.geometry.center()
      pivot.translateX(center.x)
      pivot.translateY(center.y)
      pivot.translateZ(center.z)


      // box.center( pivot.position ); // this re-sets the mesh position
      // mesh.position.multiplyScalar( - 1 )



      meshes.push({
        mesh,
        pivot,
        cell,
        ci,
        indexFromDistance,
        xCoord,
        yCoord,
      })

    })


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

    scene.add(ambLight);

    var hexShape = new THREE.Shape();
    hexShape.moveTo(0, 0.6);
    hexShape.lineTo(0.3, 0.3);
    hexShape.lineTo(0.2, 0);
    hexShape.lineTo(-0.2, 0);
    hexShape.lineTo(-0.3, 0.3);
    hexShape.lineTo(0, 0.6);

    const minLength = 5

    var hexExtrudeSettings = {
      depth: (Math.random() * 3) + minLength,
      bevelEnabled: true,
      bevelSegments: 1,
      steps: 1,
      bevelSize: (Math.random() * 1) + 1.5,
      bevelThickness: (Math.random() * 1) + 2.5
    };




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
        color: 'hsla(55, 100%, 60' +
          '% , 1)',
        transparent: true,
        depthTest: true,
        depthWrite: false,
        visible: true,
        // side: THREE.DoubleSide,
        // refractionRatio: 0.01,
        specular: 8355711,
        roughness: 20,
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

      return mes
    }

    const crystalDistanceFromCamera = cameraDistanceFromCenter + 20

    const crystalY = 45

    const crystalDistanceFromCenter = cameraDistanceFromCenter - crystalDistanceFromCamera

    const crystal = addShape(
      hexShape,
      hexExtrudeSettings,
      0xff3333, // color
      -crystalDistanceFromCenter, // x pos
      crystalY, // y pos
      crystalDistanceFromCenter, // z pos
      Math.random() * 2 * Math.PI, // x rotation
      Math.random() * 2 * Math.PI, // y rotation
      Math.random() * 2 * Math.PI, // z rotation
      1
    )


    // scene.add(crystal)

    // const light7 = new THREE.PointLight('white', 1.2, 100 )
    // light7.position.set(
    //   -crystalDistanceFromCenter,
    //   50,
    //   crystalDistanceFromCenter);
    // light7.castShadow = true;
    //
    // scene.add(light7)


    const animationKeys = Object.keys(eases)

    const numMeshesToAnimate = 10

    const meshIndexesToAnimation = [...Array(numMeshesToAnimate)].map(() => {
      return Math.floor(Math.random()*meshes.length)
    })

    const meshAnimationsByIndex = meshIndexesToAnimation.map(() => {
      return eases[animationKeys[Math.floor(Math.random()*animationKeys.length)]]
    })

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
        // mesh.rotation.y = time * (10 * Math.PI / 180);

        // total duration

        // divide duration into chunks
        // const pointInAnimation = (duration * playhead)


        meshIndexesToAnimation.map((meshIndex, index) => {

          const {pivot} = meshes[meshIndex]
          const meshAnimation = meshAnimationsByIndex[index]

          pivot.rotation.x = playhead

        })



        // meshes.map(({
        //   mesh,
        //   cell,
        //   ci,
        //   indexFromDistance,
        //   xCoord,
        //   yCoord,
        // }, i) => {
        //
        //   const delay = i
        //
        //
        //
        //
        //   // console.log(yDistance)
        //
        //
        //   // const y = Math.abs(
        //   //     Math.sin((playhead * Math.PI / 2 * 4) + -distanceFromCenter / waveSize) + -distanceFromCenter * columnWaveSize
        //   //   ) + 2
        //
        //   // console.log(distanceFromCenter)
        //
        //
        //   // console.log((playhead * 100 * ci))
        //
        //   // mesh.scale.y = xDistance + yDistance
        //
        //   const waveLength = 15
        //
        //   const dampener = .5
        //   const indexOffset = meshes.length - indexFromDistance + 1
        //   const individualOffset = indexOffset * dampener
        //
        //   const amplitude = 15
        //
        //
        //   // const individualWavePoint = Math.abs(
        //   //   Math.sin(
        //   //
        //   //     (playhead * Math.PI / 2 * 4)
        //   //     + individualOffset / waveLength
        //   //
        //   //   ) * amplitude
        //   // )
        //
        //   // mesh.rotation.z = playhead
        //
        //   mesh.position.x = pointInAnimation
        //
        //   // mesh.scale.y = individualWavePoint
        //   // crystal.rotation.x = playhead * (4 * Math.PI)
        //
        //   // mesh.scale.y = playhead * (10 * Math.PI / 180)
        //
        //   // mesh.scale.y = playhead * (10 * Math.PI / 180)
        //
        //   // mesh.position.y = playhead * -individualOffset
        // })

        // console.log(Math.sin(playhead + 1 / 5))

        // console.log(playhead * 100 * meshes[10].ci)



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

