
import * as cv  from './canvas.js'

const socket = new WebSocket('ws://localhost:8080')
let turtleData

socket.addEventListener('open', () => {
    document.getElementById('status').innerHTML = 'status: connected'
})

socket.addEventListener('close', () => {
    document.getElementById('status').innerHTML = 'status: disconnected'
})

socket.addEventListener('message', message => {

    if (message.data.includes("From turtle: ")) {
        turtleData = message.data.replace("From turtle: ", "")
        turtleData = JSON.parse(turtleData)
        console.log(turtleData)
        
        cv.turtle[0].position.set(turtleData.coord.x, turtleData.coord.y, turtleData.coord.z)
        cv.turtle[1].position.set(turtleData.coord.x, turtleData.coord.y, turtleData.coord.z)

        if (turtleData.blocks.Down != "air") {
            cv.newBlock({ x: turtleData.coord.x, y: (turtleData.coord.y - 1), z: turtleData.coord.z}, 'green')
        }
        if (turtleData.blocks.Forward != "air") {
            cv.newBlock({ x: (turtleData.coord.x + 1), y: turtleData.coord.y, z: turtleData.coord.z}, 'green')
        }
        if (turtleData.blocks.Up != "air") {
            cv.newBlock({ x: turtleData.coord.x, y: (turtleData.coord.y + 1), z: turtleData.coord.z}, 'green')
        }
    } else {
        console.log('Message from server: ', message.data)
    }
})

let buttonArray = ['Up', 'Forward', 'Left', 'Right', 'Back', 'Down', 'Refuel', 'Dig']
buttonArray.forEach(button => {
    document.getElementById(button).addEventListener('click', () => {
        socket.send('From control panel: ' + button)
    })
})

document.getElementById('status').addEventListener('click', () => {
    console.log(objects)
})
