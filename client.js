
import * as cv from './canvas.js'

const socket = new WebSocket('ws://localhost:8080')
let tData
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

btnNames.forEach(button => {
    document.getElementById(button).addEventListener('click', () => {
        socket.send('From control panel: ' + button)
    })
})

socket.addEventListener('message', message => {

    if (message.data.includes("From turtle: ")) {
        tData = message.data.replace("From turtle: ", "")
        tData = JSON.parse(tData)
        console.log(tData)

        //inspected object coordinates
        objCoords.Up = { "x": tData.coord.x, "y": (tData.coord.y + 1), "z": tData.coord.z }
        objCoords.Down = { "x": tData.coord.x, "y": (tData.coord.y - 1), "z": tData.coord.z }

        if (tData.direction == "forward")
            objCoords.Forward = { "x": tData.coord.x + 1, "y": tData.coord.y, "z": tData.coord.z }
        else if (tData.direction == "left")
            objCoords.Forward = { "x": tData.coord.x, "y": tData.coord.y, "z": tData.coord.z - 1 }
        else if (tData.direction == "right")
            objCoords.Forward = { "x": tData.coord.x, "y": tData.coord.y, "z": tData.coord.z + 1 }
        else if (tData.direction == "back")
            objCoords.Forward = { "x": tData.coord.x - 1, "y": tData.coord.y, "z": tData.coord.z }

        //move turtle to the new position
        cv.turtle[0].position.set(tData.coord.x, tData.coord.y, tData.coord.z)
        cv.turtle[1].position.set(tData.coord.x, tData.coord.y, tData.coord.z)

        //remove old objects
        const removeInspectedBlock = (blockCoords) => {
            if (cv.objects[`${blockCoords.x} ${blockCoords.y} ${blockCoords.z}`])
                cv.removeBlock(cv.objects, [`${blockCoords.x} ${blockCoords.y} ${blockCoords.z}`])
        }
        removeInspectedBlock(objCoords.Down)
        removeInspectedBlock(objCoords.Forward)
        removeInspectedBlock(objCoords.Up)
        removeInspectedBlock(tData.coord)

        //place inspected blocks
        if (tData.blocks.Down != "air")
            cv.newBlock({ x: objCoords.Down.x, y: objCoords.Down.y, z: objCoords.Down.z }, 'green')
        if (tData.blocks.Forward != "air")
            cv.newBlock({ x: objCoords.Forward.x, y: objCoords.Forward.y, z: objCoords.Forward.z }, 'green')
        if (tData.blocks.Up != "air")
            cv.newBlock({ x: objCoords.Up.x, y: objCoords.Up.y, z: objCoords.Up.z }, 'green')

    } else {
        console.log('Message from server: ', message.data)
    }
})



// document.getElementById('status').addEventListener('click', () => {
//     console.log(cv.objects)
// })
