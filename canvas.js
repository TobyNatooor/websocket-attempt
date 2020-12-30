
import * as THREE from 'https://threejsfundamentals.org/threejs/resources/threejs/r122/build/three.module.js';
import { OrbitControls } from 'https://threejsfundamentals.org/threejs/resources/threejs/r122/examples/jsm/controls/OrbitControls.js';

const theCanvas = document.getElementById('theCanvas')

//scene
const scene = new THREE.Scene()
scene.background = new THREE.Color('#9c9c9c')
//camera
const camera = new THREE.PerspectiveCamera(75, theCanvas.clientWidth / theCanvas.clientHeight, 0.1, 1000)
camera.position.set(2, 2, 2)
camera.lookAt(0, 0, 0)
//render
const renderer = new THREE.WebGLRenderer({
    antialias: true,
    canvas: theCanvas,
})
renderer.setSize(theCanvas.clientWidth, theCanvas.clientHeight)
//light
const pointLight = new THREE.HemisphereLight('white', 'white', 2)
pointLight.position.set(10, 10, 10)
scene.add(pointLight)
//controls
const controls = new OrbitControls(camera, theCanvas)
controls.target.set(0, 0, 0)
controls.update()
//object(s)
export let objects = {}
export let turtle = []
export let geometry, edgeGeo, lines, material, cube, lineMat
export const newBlock = (pos, blockColor, isTurtle) => {
    geometry = new THREE.BoxGeometry(1, 1, 1)
    edgeGeo = new THREE.EdgesGeometry(geometry)
    lineMat = new THREE.LineBasicMaterial({
        color: 'white',
        linewidth: 50,
    })
    lines = new THREE.LineSegments(edgeGeo, lineMat);
    lines.position.set(pos.x, pos.y, pos.z)
    scene.add(lines)
    material = new THREE.MeshPhongMaterial({
        color: blockColor,
        opacity: isTurtle ? 0.5 : 0.3,
        transparent: true,
    })
    cube = new THREE.Mesh(geometry, material)
    cube.position.set(pos.x, pos.y, pos.z)
    scene.add(cube)
    isTurtle ? turtle = [cube, lines] : objects[`${pos.x} ${pos.y} ${pos.z}`] = [cube, lines]
}
//remove objects
export const removeBlock = (object) => {
    for (let i = 0; i < 2; i++) {
        object[i].geometry.dispose()
        object[i].material.dispose()
        scene.remove(object[i])
    }
    renderer.renderLists.dispose()
    //delete object
}
newBlock({ x: 0, y: 0, z: 0 }, 'red', 'turtle')
//newBlock({ x: 0, y: 1, z: 0 }, 'red')

//animate
const animate = () => {
    requestAnimationFrame(animate)
    renderer.render(scene, camera)
    // cube.rotation.x += 0.01
    // cube.rotation.y += 0.01
}
animate()

window.addEventListener('resize', () => {
    theCanvas.style.height = '60vh'
    theCanvas.style.width = '80vw'
    renderer.setSize(theCanvas.clientWidth, theCanvas.clientHeight)
    camera.aspect = theCanvas.clientWidth / theCanvas.clientHeight
    camera.updateProjectionMatrix()
})
