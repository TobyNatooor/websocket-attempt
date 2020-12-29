
import { newBlock } from './canvas.js'

const socket = new WebSocket('ws://localhost:8080')

socket.addEventListener('open', () => {
    document.getElementById('status').innerHTML = 'status: connected'
})

socket.addEventListener('close', () => {
    document.getElementById('status').innerHTML = 'status: disconnected'
})

socket.addEventListener('message', message => {
    console.log('Message from server: ', message.data)

    if (message.data.includes("From turtle: ")) {

        let data = message.data.replace("From turtle: ", "")
        data = data.split(" ")
        let blockType = data[0]
        let blockCoord = { x: data[1], y: data[2], z: data[3] }
        console.log(blockType)
        console.log(blockCoord)

        newBlock(blockCoord, 'green')
    }
})

let buttonArray = ['Up', 'Forward', 'Left', 'Right', 'Back', 'Down', 'Refuel', 'Dig']
buttonArray.forEach(button => {
    document.getElementById(button).addEventListener('click', () => {
        socket.send('From control panel: ' + button)
    })
})

document.getElementById('status').addEventListener('click', () => {
    newBlock({ x: 0, y: 0, z: 1 }, 'green')
})
