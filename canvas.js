
import * as THREE from 'https://threejsfundamentals.org/threejs/resources/threejs/r122/build/three.module.js'
import { OrbitControls } from 'https://threejsfundamentals.org/threejs/resources/threejs/r122/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'https://threejsfundamentals.org/threejs/resources/threejs/r122/examples/jsm/loaders/GLTFLoader.js'

const theCanvas = document.getElementById('theCanvas')
const canvasWidth = getComputedStyle(theCanvas).getPropertyValue('--canvasWidth')
const canvasHeight = getComputedStyle(theCanvas).getPropertyValue('--canvasHeight')

export let turtle = []
export let objects = {}
export let geometry, edgeGeo, lines, material, cube, lineMat, model, controls

//scene
const scene = new THREE.Scene()
scene.background = new THREE.Color('#9c9c9c')
//camera
const camera = new THREE.PerspectiveCamera(75, theCanvas.clientWidth / theCanvas.clientHeight, 0.1, 1000)
camera.position.set(-2, 2, 2)
camera.lookAt(0, 0, 0)
//render
const renderer = new THREE.WebGLRenderer({
    antialias: true,
    canvas: theCanvas,
})
renderer.setSize(theCanvas.clientWidth, theCanvas.clientHeight)
//light
const hemLight = new THREE.HemisphereLight('white', 'white', 2)
hemLight.position.set(10, 10, 10)
scene.add(hemLight)
const pointLight = new THREE.PointLight(0xff0000, 1, 100)
hemLight.position.set(10, 10, 10)
scene.add(pointLight)
//controls
controls = new OrbitControls(camera, theCanvas)
controls.target.set(0, 0, 0)
controls.update()
//model
// const loader = new GLTFLoader()
// loader.load('./model/turtle/scene.gltf', gltf => {
//     model = gltf.scene
//     model.scale.set(0.01, 0.01, 0.01)
//     model.position.set(0, 0, 0.2)
//     scene.add(model)
// })
//object(s)
export const newBlock = (pos, blockColor, blockType) => {
    geometry = new THREE.BoxGeometry(1, 1, 1)
    edgeGeo = new THREE.EdgesGeometry(geometry)
    lineMat = new THREE.LineBasicMaterial({ color: 'white', })
    lines = new THREE.LineSegments(edgeGeo, lineMat);
    lines.position.set(pos.x, pos.y, pos.z)
    scene.add(lines)

    material = new THREE.MeshPhongMaterial({
        color: blockColor,
        opacity: 0.5,
        transparent: true,
    })
    cube = new THREE.Mesh(geometry, material)
    cube.position.set(pos.x, pos.y, pos.z)
    scene.add(cube)

    if (blockType === 'turtle') {
        turtle = [cube, lines]
    } else {
        objects[`${pos.x} ${pos.y} ${pos.z}`] = [cube, lines]
    }
}
//remove objects
export const removeBlock = (object, propName) => {
    for (let i = 0; i < object[propName].length; i++) {
        object[propName][i].geometry.dispose()
        object[propName][i].material.dispose()
        scene.remove(object[propName][i])
    }
    renderer.renderLists.dispose()
    delete object[propName]
}

//animate
const animate = () => {
    requestAnimationFrame(animate)
    renderer.render(scene, camera)
}
animate()

//resize
window.addEventListener('resize', () => {
    theCanvas.style.height = canvasHeight
    theCanvas.style.width = canvasWidth
    renderer.setSize(theCanvas.clientWidth, theCanvas.clientHeight)
    camera.aspect = theCanvas.clientWidth / theCanvas.clientHeight
    camera.updateProjectionMatrix()
})

//move main
newBlock({ x: 0, y: 0, z: 0 }, 'red', 'turtle')
