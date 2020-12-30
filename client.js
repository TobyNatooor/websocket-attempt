
import { newBlock, objects } from './canvas.js'

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

        //newBlock(blockCoord, 'green')
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
