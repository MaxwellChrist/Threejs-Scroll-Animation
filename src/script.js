import './style.css'
import * as THREE from 'three'
import * as dat from 'lil-gui'

/**
 * Debug
 */
const gui = new dat.GUI()

const parameters = {
    materialColor: '#440D0F'
}

gui.addColor(parameters, 'materialColor').onChange(() => material.color.set(parameters.materialColor))

/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Texture
 */
const textureLoader = new THREE.TextureLoader()
const gradientTexture = textureLoader.load('textures/gradients/3.jpg')
gradientTexture.magFilter = THREE.NearestFilter

/**
 * Objects
 */
const material = new THREE.MeshToonMaterial({ 
    color: parameters.materialColor,
    gradientMap: gradientTexture
})

// Meshes
const objectsDistanceX = 2.5
const objectsDistanceY = 5

const mesh1 = new THREE.Mesh(
    new THREE.TorusGeometry(1, 0.4, 16),
    material
)
const mesh2 = new THREE.Mesh(
    new THREE.ConeGeometry(1, 0.4, 16),
    material
)
const mesh3 = new THREE.Mesh(
    new THREE.TorusKnotGeometry(1, 0.4, 16),
    material
)

mesh1.position.x = (objectsDistanceX)
mesh1.position.y = -(objectsDistanceY * 0)

mesh2.position.x = -(objectsDistanceX)
mesh2.position.y = -(objectsDistanceY * 1)

mesh3.position.x = (objectsDistanceX )
mesh3.position.y = -(objectsDistanceY * 2)

scene.add(mesh1, mesh2, mesh3)

const sectionMeshes = [mesh1, mesh2, mesh3]

/**
 * Lights
 */
const directionalLight = new THREE.DirectionalLight('#ffffff', 1)
directionalLight.position.set(1, 1, 0)
scene.add(directionalLight)

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Group
const cameraGroup = new THREE.Group()
scene.add(cameraGroup)

// Base camera
const camera = new THREE.PerspectiveCamera(35, sizes.width / sizes.height, 0.1, 100)
camera.position.z = 6
cameraGroup.add(camera)

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true // allows you to see through you canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Scroll
 */
let scrollY = window.scrollY
window.addEventListener('scroll', e => {
    scrollY = window.scrollY
})

/**
 * Cursor
 */
const cursor = {
    x: 0,
    y: 0
}
window.addEventListener('mousemove', e => {
    cursor.x = (e.clientX / sizes.width) - 0.5
    cursor.y = (e.clientY / sizes.height) - 0.5
    console.log(cursor)

})

/**
 * Animate
 */
const clock = new THREE.Clock()
let previousTime = 0

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()
    const delta = elapsedTime - previousTime
    previousTime = elapsedTime

    // Animate camera
    camera.position.y = -scrollY/sizes.height * objectsDistanceY

    // Parallax
    const parallaxX = cursor.x * 0.5
    const parallaxY = -cursor.y * 0.5
    cameraGroup.position.x += (parallaxX - cameraGroup.position.x) * 4 * delta
    cameraGroup.position.y += (parallaxY - cameraGroup.position.y) * 4 * delta

    // Animate meshes
    for (let mesh of sectionMeshes) {
        mesh.rotation.x = elapsedTime * 0.25
        mesh.rotation.y = elapsedTime * 0.25
    }

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()