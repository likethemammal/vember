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




import gradient_color from 'gradient-color'

// import { sites } from './constants'





const canvasSketch = require('canvas-sketch');

// Ensure ThreeJS is in global scope for the 'examples/'
global.THREE = require('three');

// Include any additional ThreeJS examples below
require('three/examples/js/controls/OrbitControls');

function boot() {









  const settings = {
    // Make the loop animated
    dimensions: [512, 512],
    animate: true,
    duration: 4,
    fps: 30,
    // Get a WebGL canvas rather than 2D
    context: 'webgl',
    // Turn on MSAA
    attributes: { antialias: true }
  };

  const meshes = []

  const sketch = ({ context }) => {

    //RENDERER
    const renderer = new THREE.WebGLRenderer({
      context,
      // alpha: true,
      // antialias: true,
    });

    // WebGL background color
    renderer.setClearColor('#dddddd', 1);
    renderer.shadowMap.enabled = true;





    //CAMERA
    const camera = new THREE.PerspectiveCamera(45, 1, 0.01, 100);
    // camera.controls = new THREE.OrbitControls(camera);

    camera.position.set(-175, 135, 175);
    camera.lookAt(new THREE.Vector3(0,0,0));

    camera.far = 1000

    // Setup camera controller
    const controls = new THREE.OrbitControls(camera);

    // Setup your scene
    const scene = new THREE.Scene();


    const AREA_SIZE = 200

    const sites = [...Array(200)].map((_, i) => {
      return {
        x: Math.random(),
        y: Math.random()
      }
    })

    // window.sites = sites

    const voronoi = new Voronoi();
    const result = voronoi.compute(sites, {
      xl:0, xr:1,
      yt:0, yb:1
    });

    const extrudeSettings = {
      steps: 2,
      depth: 1,
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
    const colors = gradient_color(['hsl(170, 70%, 60%)', 'hsl(201, 100%, 50%)', 'hsl(241, 75%, 70%)'].reverse(), result.cells.length)


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
      const mesh = new THREE.Mesh(
        new THREE.ExtrudeGeometry(shape, Object.assign({}, extrudeSettings, {
          // depth: 20 + offset
        })),
        material
      );

      mesh.scale.y = 1
      mesh.geometry.applyMatrix(rotation);
      mesh.castShadow = true;
      mesh.receiveShadow = true;

      meshes.push({
        mesh,
        cell,
        ci,
        indexFromDistance,
        xCoord,
        yCoord,
      })

      group.add(mesh);
    });







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

    const pointLightHelper = new THREE.PointLightHelper( light, 1 );
    const pointLightHelper2 = new THREE.PointLightHelper( light2, 1 );
    const pointLightHelper3 = new THREE.PointLightHelper( light3, 1 );
    const pointLightHelper4 = new THREE.PointLightHelper( light4, 1 );
    const pointLightHelper5 = new THREE.PointLightHelper( light5, 1 );
    // scene.add( pointLightHelper, pointLightHelper2, pointLightHelper3, pointLightHelper4, pointLightHelper5 );



    //LIGHTING
    // const light = new THREE.SpotLight( 0xffffff, 1, 0, Math.PI / 2 );
    // light.name = 'spotlight';
    // light.position.set( 60, 80, 20);
    // light.target.position.set( 0, 0, 0 );

    const ambLight = new THREE.AmbientLight(0x404040, 3.8);

    scene.add(ambLight);

    // ... setup shadow-casting for the light
    // light.castShadow = true;
    // light.shadow = new THREE.LightShadow(
    //   new THREE.PerspectiveCamera(50, 1, 50, 150)
    // );
    // scene.add(new THREE.CameraHelper(light.shadow.camera));

    // light.shadow.bias = 0.0001;
    // light.shadow.radius = 1;
    // light.shadow.mapSize.width = 2048;
    // light.shadow.mapSize.height = 2048;





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
        // mesh.rotation.y = time * (10 * Math.PI / 180);




        meshes.map(({
          mesh,
          cell,
          ci,
          indexFromDistance,
        }, i) => {



          // console.log(yDistance)


          // const y = Math.abs(
          //     Math.sin((playhead * Math.PI / 2 * 4) + -distanceFromCenter / waveSize) + -distanceFromCenter * columnWaveSize
          //   ) + 2

          // console.log(distanceFromCenter)


          // console.log((playhead * 100 * ci))

          // mesh.scale.y = xDistance + yDistance

          const waveLength = 15

          const dampener = .5
          const indexOffset = meshes.length - indexFromDistance + 1
          const individualOffset = indexOffset * dampener

          const amplitude = 15


          const individualWavePoint = Math.abs(
              Math.sin(

                (playhead * Math.PI / 2 * 4)
                + individualOffset / waveLength

              ) * amplitude
            )


          mesh.scale.y = individualWavePoint

          // mesh.scale.y = playhead * (10 * Math.PI / 180)

          // mesh.scale.y = playhead * (10 * Math.PI / 180)
        })

        // console.log(Math.sin(playhead + 1 / 5))

        // console.log(playhead * 100 * meshes[10].ci)



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

  canvasSketch(sketch, settings)

}

