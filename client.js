
import * as cv from './canvas.js'

const socket = new WebSocket('ws://localhost:8080')
let turtleData
let btnObjects = document.getElementById('movementButtons').getElementsByTagName("*")
let btnNames = []
let objCoords = {}

for (let i in btnObjects) {
    if (btnObjects[i].id) {
        btnNames.push(btnObjects[i].id)
    }
}
for (let i in btnNames) {
    if (btnNames[i].nodeName == "DIV") {
        btnNames.splice(i, 1)
    }
}

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

        //inspected object coordinates
        objCoords.Up = { "x": turtleData.coord.x, "y": (turtleData.coord.y + 1), "z": turtleData.coord.z }
        objCoords.Down = { "x": turtleData.coord.x, "y": (turtleData.coord.y - 1), "z": turtleData.coord.z }

        if (turtleData.direction == "forward")
            objCoords.Forward = { "x": turtleData.coord.x + 1, "y": turtleData.coord.y, "z": turtleData.coord.z }
        else if (turtleData.direction == "left")
            objCoords.Forward = { "x": turtleData.coord.x, "y": turtleData.coord.y, "z": turtleData.coord.z - 1 }
        else if (turtleData.direction == "right")
            objCoords.Forward = { "x": turtleData.coord.x, "y": turtleData.coord.y, "z": turtleData.coord.z + 1 }
        else if (turtleData.direction == "back")
            objCoords.Forward = { "x": turtleData.coord.x - 1, "y": turtleData.coord.y, "z": turtleData.coord.z }

        //move turtle to the new position
        cv.turtle[0].position.set(turtleData.coord.x, turtleData.coord.y, turtleData.coord.z)
        cv.turtle[1].position.set(turtleData.coord.x, turtleData.coord.y, turtleData.coord.z)

        //remove old objects
        const removeInspectedBlock = (blockCoords) => {
            if (cv.objects[`${blockCoords.x} ${blockCoords.y} ${blockCoords.z}`])
                cv.removeBlock(cv.objects[`${blockCoords.x} ${blockCoords.y} ${blockCoords.z}`])
        }
        removeInspectedBlock(objCoords.Down)
        removeInspectedBlock(objCoords.Forward)
        removeInspectedBlock(objCoords.Up)
        removeInspectedBlock(turtleData.coord)

        //place inspected blocks
        if (turtleData.blocks.Down != "air")
            cv.newBlock({ x: objCoords.Down.x, y: objCoords.Down.y, z: objCoords.Down.z }, 'green')
        if (turtleData.blocks.Forward != "air")
            cv.newBlock({ x: objCoords.Forward.x, y: objCoords.Forward.y, z: objCoords.Forward.z }, 'green')
        if (turtleData.blocks.Up != "air")
            cv.newBlock({ x: objCoords.Up.x, y: objCoords.Up.y, z: objCoords.Up.z }, 'green')

    } else {
        console.log('Message from server: ', message.data)
    }
})

btnNames.forEach(button => {
    document.getElementById(button).addEventListener('click', () => {
        socket.send('From control panel: ' + button)
    })
})

// document.getElementById('status').addEventListener('click', () => {
//     console.log(cv.objects)
//     console.log(cv.objects.indexOf("1 0 0"))
// })
