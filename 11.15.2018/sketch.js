const canvasSketch = require('canvas-sketch');

// Ensure ThreeJS is in global scope for the 'examples/'
global.THREE = require('three');

// Include any additional ThreeJS examples below
require('three/examples/js/controls/OrbitControls')

import eases from 'eases'
import gradient_color from 'gradient-color'

import { triggerAnimations } from '../section-animator'

import _ from 'lodash'

const DURATION = 8

const settings = {
  // Make the loop animated
  animate: true,
  fps: 30,
  duration: DURATION,
  dimensions: [1024, 1024],
  // Get a WebGL canvas rather than 2D
  context: 'webgl',
  // Turn on MSAA
  attributes: { antialias: true }
};


//boxes

//box y goes up at a certain ease

//box x goes a direction based on sin

//

const sketch = ({ context }) => {
  // Create a renderer
  const renderer = new THREE.WebGLRenderer({
    context
  });

  // WebGL background color
  // renderer.setClearColor('black', 1)
  // renderer.setClearColor('#e9e8e8', 1)
  renderer.setClearColor('#e3e3e3', 1)
  renderer.shadowMap.enabled = true

  // Setup a camera
  const camera = new THREE.PerspectiveCamera(45, 1, 0.01, 100);
  camera.position.set(2.6, -0.2, -4);
  camera.lookAt(new THREE.Vector3(0, 0.5, 0))

  camera.far = 1000

  window.camera = camera

  // Setup camera controller
  // const controls = new THREE.OrbitControls(camera)

  // Setup your scene
  const scene = new THREE.Scene();


  // Specify an ambient/unlit colour
  // scene.add(new THREE.AmbientLight('#59314f'));
  //
  // // Add some light
  // const light = new THREE.PointLight('#45caf7', 1, 25.5);
  // light.position.set(2, 2, -4).multiplyScalar(1.5)
  //
  // light.castShadow = true
  // scene.add(light)


  const shadowLight = new THREE.DirectionalLight(0xffffff, 0.07)
  shadowLight.position.set(0, 3, -4)
  shadowLight.castShadow = true
  const shadowLightHelper = new THREE.DirectionalLightHelper(shadowLight)

  // const ambientLight = new THREE.AmbientLight(0xffffff, 0.3)
  // const ambientLight2 = new THREE.AmbientLight('#f1a4ff', 0.2)

  const ambientLight = new THREE.AmbientLight(0xffffff, 1.32)
  const ambientLight2 = new THREE.AmbientLight('#85e0ff', 0.01)

  const light1 = new THREE.PointLight( '#fffbfb', 0.3, 100 )
  light1.position.set( 1, 0, -1.2 )
  // light1.castShadow = true
  const light1Helper = new THREE.PointLightHelper(light1)
  //
  const light2 = new THREE.PointLight('white', 0.3, 10 )
  // light2.castShadow = true
  light2.position.set( -6, 8, 3 )
  const light2Helper = new THREE.PointLightHelper(light2)

  const light3 = new THREE.PointLight('#fffbfb', 0.3, 100 )
  // light3.castShadow = true
  light3.position.set( 5, 4, 5)
  const light3Helper = new THREE.PointLightHelper(light3)

  const light4 = new THREE.PointLight('orange', 0.3, 0.8)
  light4.castShadow = true
  light4.position.set( 0, 0.1, 0)
  const light4Helper = new THREE.PointLightHelper(light4)

  scene.add(
    shadowLight,
    ambientLight,
    ambientLight2,
    light1,
    light2,
    light3,
    light4,
    // light5,
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

  const cylinderRadius = 0.2
  const cylinderHeight = 1
  const cylinder = new THREE.Mesh(
    new THREE.CylinderGeometry( cylinderRadius, cylinderRadius, cylinderHeight, 32 ),
    new THREE.MeshPhysicalMaterial({
      color: 'white',
      roughness: 1,
      flatShading: true
    })
  )

  const cylinder2 = new THREE.Mesh(
    new THREE.CylinderGeometry( 0.01, 0.01, 0.3, 32 ),
    new THREE.MeshPhysicalMaterial({
      color: 'white',
      roughness: 1,
      flatShading: true
    })
  )

  cylinder.receiveShadow = true
  cylinder.castShadow = true
  cylinder2.castShadow = true
  cylinder2.receiveShadow = true

  cylinder.position.set(
    0,
    -0.7,
    0,
  )
  cylinder2.position.set(
    0,
    -0.2,
    0,
  )
  scene.add( cylinder, cylinder2 )


  const background = new THREE.Mesh(
    new THREE.BoxGeometry(0.1, 11, 11),
    new THREE.MeshPhysicalMaterial({
      color: 'white',
      roughness: 1,
      flatShading: true
    })
  )

  background.position.set(-1, -0.2, 2)
  background.receiveShadow = true

  background.rotation.set(
    0,
    (Math.PI / 180) * 90,
    // 0,
    (Math.PI / 180) * 80,
    // 0,
  )

  scene.add(background)






  const numOfBoxes = 20
  const colors = gradient_color([
    // 'hsl(30, 100%, 70%)',
    // 'hsl(45, 100%, 70%)',
    'hsl(48, 100%, 70%)',
    'hsl(48, 100%, 70%)',
  ], numOfBoxes)
  const boxes = [...Array(numOfBoxes)].map((_, i) => {
    const mesh = new THREE.Mesh(
      new THREE.BoxGeometry(1, 1, 1),
      new THREE.MeshPhysicalMaterial({
        color: colors[i],
        roughness: 1,
        flatShading: true
      })
    )

    mesh.castShadow = true
    mesh.receiveShadow = true

    mesh.scale.set(
      getBoxScale(0),
      getBoxScale(0),
      getBoxScale(0),
    )
    // mesh.material.transparent = true
    // mesh.material.opacity = 0

    scene.add(mesh)

    return mesh

  })

  function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;

      // And swap it with the current element.
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }

    return array;
  }

  const lengthOfAnimation = 1 / numOfBoxes


  const times = boxes.map((_, i) => {

    //startFloat is above 0

    //endFloat minus startFloat has to be less than 1


    const startFloat = lengthOfAnimation * i
    const endFloat = startFloat + lengthOfAnimation

    // const maxStartPosition = 1 - lengthOfAnimation
    // const startFloat = Math.random()*maxStartPosition
    // const minEndPosition = 1 - startFloat
    // const endFloatStart = Math.random()*minEndPosition
    // const endFloat = endFloatStart + startFloat

    // const potentialStartTime = startFloat - 0.1


    return {
      startFloat: startFloat - 0.3 > 0 ? startFloat - 0.3: 0,
      endFloat,
    }
  })

  function getBoxScale(animationPlayhead) {
    return Math.sin(
      eases.sineOut(animationPlayhead) * Math.PI
    ) / 7
  }

  const animationCallbacks = shuffle(boxes.map((mesh, i) => {

    return (animationPlayhead) => {

        // mesh.material.transparent = true
        // mesh.material.opacity = 1

        const flameHeight = 2
        const flameWidth = 0.3
        const boxDistanceFromCenter = flameWidth * Math.sin(eases.sineOut(animationPlayhead) * Math.PI)

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


        mesh.position.y = flameHeight * eases.sineInOut(animationPlayhead)
        mesh.position.x = calcXOnCircle(0, boxDistanceFromCenter, calcAngleFromCenter(i, numOfBoxes))
        mesh.position.z = calcYOnCircle(0, boxDistanceFromCenter, calcAngleFromCenter(i, numOfBoxes))

        mesh.rotation.x = Math.PI * animationPlayhead

        mesh.scale.set(
          getBoxScale(animationPlayhead),
          getBoxScale(animationPlayhead),
          getBoxScale(animationPlayhead),
        )

        if (i % 2 === 0) {
          light4.intensity = Math.sin(animationPlayhead * Math.PI)
        }

        // if (animationPlayhead > 0.8) {
        //   mesh.material.transparent = true
        //   mesh.material.opacity = 0
        // }
    }
  }))

  const animations = boxes.map((_, i) => {
    const animationCallback = animationCallbacks[i]
    const time = times[i]

    return {
      animationCallback,
      ...time,
    }
  })

  // draw each frame
  return {
    // Handle resize events here
    resize ({ pixelRatio, viewportWidth, viewportHeight }) {
      renderer.setPixelRatio(pixelRatio);
      renderer.setSize(viewportWidth, viewportHeight);
      camera.aspect = viewportWidth / viewportHeight;
      camera.updateProjectionMatrix()
    },
    // Update & render your scene here
    render ({ time, playhead }) {
      // mesh.rotation.y = time * (10 * Math.PI / 180)

      triggerAnimations(animations, playhead)

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
