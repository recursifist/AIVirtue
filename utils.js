import * as THREE from 'three'

const loadJSON = async (jsonFileName) => {
  const response = await fetch(jsonFileName)
  const jsonData = await response.json()
  return jsonData.data
}

const isMobile = () => /Mobi/i.test(navigator.userAgent)

const calculateFOV = (container) => {
  const cW = container.clientWidth
  if (cW < 482) return 60
  else if (cW < 760) return 50
  else return 36
}

const raycaster = new THREE.Raycaster()
const mouse = new THREE.Vector2(-0.9, 0.9)
let hoveredItem = null
function setupMouseEvents(camera, textGroup, setSelectedDetails, slowText) {
  window.addEventListener('mousemove', (event) => {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1
  })

  window.addEventListener('click', (event) => {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1

    checkIntersection(camera, textGroup, slowText)

    setSelectedDetails(undefined)
    if (hoveredItem) {
      hoveredItem.nameMesh.material.metalness = 0
      setTimeout(() => {
        hoveredItem.nameMesh.material.metalness = 0.6
      }, 600)
      setSelectedDetails(hoveredItem.record)
    }
  })
}

function checkIntersection(camera, textGroup, slowText) {
  try {
    raycaster.setFromCamera(mouse, camera)
    const intersects = raycaster.intersectObjects(textGroup.children, true)
    document.body.style.cursor = 'default'
    textGroup.children.forEach(item => {
      item.nameMesh.material.metalness = 0.6
      item.nameMesh.parent.position.z = 0.26
    })

    if (hoveredItem) hoveredItem = null

    if (intersects.length > 0) {
      const intersectedObject = intersects[0].object.parent

      for (const item of textGroup.children) {
        if (item.uuid === intersectedObject.uuid) {
          slowText()
          document.body.style.cursor = 'pointer'
          hoveredItem = intersectedObject
          hoveredItem.nameMesh.parent.position.z = 0.25
          hoveredItem.nameMesh.material.metalness = 0
          break
        }
      }
    }
  } catch (error) {
    console.error('Error in raycasting:', error)
  }
}

export default {
  loadJSON,
  isMobile,
  calculateFOV,
  setupMouseEvents,
  checkIntersection
}