import * as THREE from 'three'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js'
import { FontLoader } from 'three/addons/loaders/FontLoader.js'
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js'
import utils from "./utils.min.js"

THREE.Cache.enabled = true

const createLighting = () => {
  const lights = []
  const catchlight = new THREE.SpotLight(0xffffff, 1.5)
  catchlight.position.set(0, 2.65, -1.1)
  catchlight.angle = Math.PI
  catchlight.castShadow = true
  //lights.push(catchlight)

  const spotlight = new THREE.SpotLight(0xffffff, 1)
  spotlight.position.set(0, 2.6, -1)
  spotlight.angle = Math.PI / 8.6
  spotlight.castShadow = true
  //lights.push(spotlight)

  const fillLightR = new THREE.DirectionalLight(0xffffff, 1)
  fillLightR.position.set(-4, 1, -2)
  fillLightR.castShadow = true
  lights.push(fillLightR)

  const fillLightL = new THREE.DirectionalLight(0xffffff, 0.6)
  fillLightL.position.set(1.4, 0.4, -1)
  fillLightL.angle = Math.PI / 5
  lights.push(fillLightL)

  const backLight = new THREE.PointLight(0xffffff, 3.6)
  backLight.position.set(0, 1, 1.5)
  backLight.castShadow = true
  //lights.push(backLight)

  return lights
}

const particleVelocity = () => 0.002 + Math.random() * 0.001

const createParticles = () => {
  const particleCount = 20
  const particlesGeometry = new THREE.BufferGeometry()
  const positions = new Float32Array(particleCount * 3)
  const velocities = []

  for (let i = 0; i < particleCount; i++) {
    const x = -1.5 + Math.random() * 3
    const z = -.4 + Math.random() * 1.2
    const y = 2 * Math.random()

    positions[i * 3 + 0] = x
    positions[i * 3 + 1] = y
    positions[i * 3 + 2] = z

    velocities.push({
      y: particleVelocity()
    })
  }

  particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))

  const textureLoader = new THREE.TextureLoader()
  const sparkTexture = textureLoader.load('https://threejs.org/examples/textures/sprites/spark1.png')

  const particlesMaterial = new THREE.PointsMaterial({
    map: sparkTexture,
    color: 0xffffff,
    size: 0.1,
    transparent: true,
    opacity: 0.4,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  })

  const particles = new THREE.Points(particlesGeometry, particlesMaterial)
  particles.userData = { velocities, particleCount }

  return particles
}

const updateParticles = (particles, delta) => {
  const positions = particles.geometry.attributes.position.array
  const { velocities, particleCount } = particles.userData

  for (let i = 0; i < particleCount; i++) {
    const idx = i * 3
    const vel = velocities[i]

    if (positions[idx + 1] < 2) {
      // Active
      positions[idx + 1] += vel.y / 2
    } else {
      // Dead
      const x = -1.5 + Math.random() * 3
      const z = -.4
      const y = 0

      positions[idx + 0] = x
      positions[idx + 1] = y
      positions[idx + 2] = z

      vel.y = particleVelocity()
    }
  }

  particles.geometry.attributes.position.needsUpdate = true
}

const createModelLoader = () => {
  const loader = new GLTFLoader()
  const dracoLoader = new DRACOLoader()
  dracoLoader.setDecoderPath('https://cdn.jsdelivr.net/npm/three@0.165.0/examples/jsm/libs/draco/')
  loader.setDRACOLoader(dracoLoader)
  return loader
}

let selectedDetails = undefined
let textItems = []
let _textItems = []
const textSpacing = 0.4
const createText = (data, textGroup, textItems) => { // hack: ugly non-async pattern
  const fontLoader = new FontLoader()
  fontLoader.load('helvetiker_regular.typeface.json',
    font => {
      data.forEach((x, i) => {
        const itemGroup = new THREE.Group()
        itemGroup.record = { name: x.name, text: x.rationale, link: x.link }

        const material = new THREE.MeshStandardMaterial({
          color: 0xffbe46,
          metalness: 0.6,
          roughness: 0.5,
        })

        const nameGeometry = new TextGeometry(x.name, {
          font: font,
          size: 0.07,
          depth: 0.016,
          curveSegments: utils.isMobile ? 3 : 6,
        })
        const nameMesh = new THREE.Mesh(nameGeometry, material)
        nameGeometry.computeBoundingBox()
        nameMesh.position.x = -nameGeometry.boundingBox.max.x / 2
        nameMesh.position.z = 0.01
        itemGroup.nameMesh = nameMesh
        itemGroup.add(nameMesh)

        const textWidth = nameGeometry.boundingBox.max.x - nameGeometry.boundingBox.min.x
        const underlineGeometry = new THREE.BoxGeometry(
          textWidth + 0.05,
          0.002,
          0.015
        )
        const underlineMesh = new THREE.Mesh(underlineGeometry, material)
        underlineMesh.position.x = nameMesh.position.x + textWidth / 2
        underlineMesh.position.y = nameMesh.position.y - 0.01
        underlineMesh.position.z = nameMesh.position.z
        itemGroup.add(underlineMesh)

        const taglineGeometry = new TextGeometry(x.tagline, {
          font: font,
          size: 0.04,
          depth: 0.016,
          curveSegments: utils.isMobile ? 3 : 6,
        })
        const taglineMesh = new THREE.Mesh(taglineGeometry, material)
        taglineGeometry.computeBoundingBox()
        taglineMesh.position.x = -taglineGeometry.boundingBox.max.x / 2
        taglineMesh.position.y = -0.1
        taglineMesh.position.z = nameMesh.position.z
        itemGroup.add(taglineMesh)

        const nameBox = nameGeometry.boundingBox
        const taglineBox = taglineGeometry.boundingBox
        const width = Math.max(nameBox.max.x - nameBox.min.x, taglineBox.max.x - taglineBox.min.x)
        const height = Math.abs(taglineMesh.position.y) + (nameBox.max.y - nameBox.min.y) + (taglineBox.max.y - taglineBox.min.y)

        const planeGeometry = new THREE.PlaneGeometry(width + 0.1, height + 0.1)
        const planeMaterial = new THREE.MeshBasicMaterial({
          color: 0xffffff,
          transparent: true,
          opacity: 0.0,
          side: THREE.FrontSide
        })

        const hitPlane = new THREE.Mesh(planeGeometry, planeMaterial)
        hitPlane.position.z = 0.26
        hitPlane.position.y = -height / 5
        itemGroup.add(hitPlane)
        itemGroup.bbHeight = height

        itemGroup.position.y = i * textSpacing

        textGroup.add(itemGroup)
        textGroup.rotation.y = Math.PI

        textItems.push({ mesh: itemGroup, name: x.name })
        _textItems.push({ mesh: itemGroup, name: x.name })
      })
    })
}

let scrollDirection = 1
let scrollSpeed = 0.05
const updateScrolling = (textItems, delta) => {
  textItems.forEach((item) => {
    item.mesh.position.y = THREE.MathUtils.lerp(item.mesh.position.y, item.mesh.position.y + scrollSpeed * delta * scrollDirection, 0.25)

    if (scrollDirection === 1 && item.mesh.position.y > 3) {
      let minY = textItems.reduce((min, t) => Math.min(min, t.mesh.position.y), Infinity)
      minY = minY > 0.5 ? 0.5 : minY
      item.mesh.position.y = minY - textSpacing
    }
    else if (scrollDirection === -1 && item.mesh.position.y < 0) {
      let maxY = textItems.reduce((max, t) => Math.max(max, t.mesh.position.y), -Infinity)
      item.mesh.position.y = maxY + textSpacing
    }
  })
}

let boostTimer
const _scrollSpeed = scrollSpeed
const textSpeedChange = (factor, timeout) => {
  clearTimeout(boostTimer)
  scrollSpeed = _scrollSpeed * factor
  boostTimer = setTimeout(() => {
    scrollSpeed = _scrollSpeed * factor * 0.25
    boostTimer = setTimeout(() => { scrollSpeed = _scrollSpeed }, timeout * .25)
  }, timeout * .75)
}

const resetTextSpacing = (targetY) => {
  textItems.forEach((item, i) => {
    item.mesh.position.y = targetY - (textSpacing * i)
  })
}

const searchText = query => {
  const q = query.toLowerCase().trim()
  const split = name => name.toLowerCase().split(/\s+/)

  const matches = []
  scrollDirection = 1
  resetTextSpacing(-1)
  textSpeedChange(0.25, 1500)

  matches.push(..._textItems.filter(item => split(item.name)[0].startsWith(q)))
  matches.push(..._textItems.filter(item => {
    const parts = split(item.name)
    return parts[parts.length - 1].startsWith(q)
  }))
  matches.push(..._textItems.filter(item => {
    const parts = split(item.name)
    return parts.length > 2 && parts.slice(1, -1).some(p => p.startsWith(q))
  }))

  if (matches.length === 0) {
    textItems = [..._textItems]
    resetTextSpacing(2)
    return
  }

  const uniqueItems = new Set(matches)
  textItems = [...uniqueItems]

  resetTextSpacing(1)
}

const setupAnimations = (renderer, scene, camera, updates) => {
  const clock = new THREE.Clock()
  const renderLoop = () => {
    const delta = Math.min(clock.getDelta(), utils.isMobile ? 0.04 : 0.016)

    updates(delta)

    renderer.render(scene, camera)
  }

  renderer.setAnimationLoop(renderLoop)

  document.addEventListener('visibilitychange', () => {
    if (container.visibilityState === 'hidden') {
      renderer.setAnimationLoop(null)
      clock.stop()
    } else {
      clock.start()
      renderer.setAnimationLoop(renderLoop)
    }
  })
}

const initScene = (containerId) => {
  const container = document.getElementById(containerId)
  container.innerHTML = ''
  container.classList.add('invisible')

  const renderer = new THREE.WebGLRenderer({ antialias: true })
  renderer.setSize(container.clientWidth, container.clientHeight)
  renderer.setPixelRatio(window.devicePixelRatio)
  renderer.outputEncoding = THREE.sRGBEncoding
  container.appendChild(renderer.domElement)

  const scene = new THREE.Scene()
  scene.background = new THREE.Color(0x000000)

  const camera = new THREE.PerspectiveCamera(
    utils.calculateFOV(container),
    container.clientWidth / container.clientHeight,
    0.1,
    500
  )
  camera.position.set(0, 1.25, -4.8)
  camera.lookAt(new THREE.Vector3(0, 0.5, 10))

  return { container, renderer, scene, camera }
}

const updateOnWindowResize = (container, camera, renderer) => {
  window.addEventListener('resize', () => {
    camera.fov = utils.calculateFOV(container)
    camera.aspect = container.clientWidth / container.clientHeight
    camera.updateProjectionMatrix()
    renderer.setSize(container.clientWidth, container.clientHeight)
  })
}

const updateScrollDirection = (container, textItems) => {
  const changeDirection = (direction) => {
    scrollDirection = direction
    textSpeedChange(150, 250)
  }

  container.addEventListener('wheel', (e) => {
    changeDirection(e.deltaY > 0 ? 1 : -1)
  })

  document.addEventListener('keydown', (e) => {
    if (e.key == "ArrowUp") changeDirection(1)
    else if (e.key == "ArrowDown") changeDirection(-1)
  })

  let startY
  container.addEventListener('touchstart', (e) => startY = e?.touches[0]?.clientY)
  container.addEventListener('touchend', (e) => {
    const endY = e?.changedTouches[0]?.clientY
    const yDiff = startY - endY
    if (Math.abs(yDiff) > 50) changeDirection(yDiff > 0 ? 1 : -1)
  })
}

const createScene = async (htmlContainerId, jsonFileName, modelFileName) => {
  const loader = createModelLoader()

  loader.load(modelFileName, async (gltf) => {
    const { container, renderer, scene, camera } = initScene(htmlContainerId)
    const model = gltf.scene
    const lights = createLighting()
    const textGroup = new THREE.Group()
    const particles = createParticles()

    for (const item of [model, ...lights, particles, textGroup]) {
      scene.add(item)
    }

    const data = await utils.loadJSON(jsonFileName)
    createText(data, textGroup, textItems)

    const updates = (delta) => {
      updateParticles(particles, delta)
      if (textItems.length > 0) updateScrolling(textItems, delta)
    }
    setupAnimations(renderer, scene, camera, updates)

    updateScrollDirection(container, textItems)
    updateOnWindowResize(container, camera, renderer)
    function setSelectedDetails(x) { selectedDetails = x }
    utils.setupMouseEvents(camera, container, textGroup, setSelectedDetails)

    setTimeout(() => {
      container.classList.remove('invisible')
      container.classList.add('fadeIn')
    }, 1000)
  })
}

export default {
  create: createScene,
  search: searchText,
  getSelected: () => { return selectedDetails }
}

