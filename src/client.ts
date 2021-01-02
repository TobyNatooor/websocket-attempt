
import * as cv from '../canvas.js'

const socket: WebSocket = new WebSocket('ws://localhost:8080')
let blockCoords: BlockCoords | any = {}
let tData: TData | any = {}
let tDataString: string
let btnNames: Array<string> = []
let btnObjects: HTMLCollectionOf<Element> = document.getElementById('movementButtons')!.getElementsByTagName("*")

interface TData {
    coord: Coord,
    blocks: Blocks,
    fuelLevel: number,
    direction: string
}
interface Coord {
    x: number,
    y: number,
    z: number
}
interface Blocks {
    Up: string,
    Forward: string,
    Down: string
}
interface BlockCoords {
    Up: Coord,
    Forward: Coord,
    Down: Coord
}

for (let i in btnObjects) {
    if (btnObjects[i].id) {
        btnNames.push(btnObjects[i].id)
    }
}

socket.addEventListener('open', () => {
    document.getElementById('status')!.innerHTML = 'status: connected'
})

socket.addEventListener('close', () => {
    document.getElementById('status')!.innerHTML = 'status: disconnected'
})

btnNames.forEach(button => {
    document.getElementById(button)!.addEventListener('click', () => {
        socket.send('From control panel: ' + button)
    })
})



socket.addEventListener('message', message => {

    if (message.data.includes("From turtle: ")) {
        tDataString = message.data.replace("From turtle: ", "")
        tData = JSON.parse(tDataString)
        console.log(tData)

        //inspected object coordinates
        blockCoords.Up = { "x": tData.coord.x, "y": (tData.coord.y + 1), "z": tData.coord.z }
        blockCoords.Down = { "x": tData.coord.x, "y": (tData.coord.y - 1), "z": tData.coord.z }

        if (tData.direction == "forward")
            blockCoords.Forward = { "x": tData.coord.x + 1, "y": tData.coord.y, "z": tData.coord.z }
        else if (tData.direction == "left")
            blockCoords.Forward = { "x": tData.coord.x, "y": tData.coord.y, "z": tData.coord.z - 1 }
        else if (tData.direction == "right")
            blockCoords.Forward = { "x": tData.coord.x, "y": tData.coord.y, "z": tData.coord.z + 1 }
        else if (tData.direction == "back")
            blockCoords.Forward = { "x": tData.coord.x - 1, "y": tData.coord.y, "z": tData.coord.z }

        //move turtle to the new position
        cv.turtle[0].position.set(tData.coord.x, tData.coord.y, tData.coord.z)
        cv.turtle[1].position.set(tData.coord.x, tData.coord.y, tData.coord.z)

        //remove old objects
        const removeInspectedBlock = (rmBlock: Coord) => {
            if (cv.objects[`${rmBlock.x} ${rmBlock.y} ${rmBlock.z}`])
                cv.removeBlock(cv.objects, [`${rmBlock.x} ${rmBlock.y} ${rmBlock.z}`])
        }
        removeInspectedBlock(blockCoords.Down)
        removeInspectedBlock(blockCoords.Forward)
        removeInspectedBlock(blockCoords.Up)
        removeInspectedBlock(tData.coord)

        //place inspected blocks
        if (tData.blocks.Down != "air")
            cv.newBlock({ x: blockCoords.Down.x, y: blockCoords.Down.y, z: blockCoords.Down.z }, 'green')
        if (tData.blocks.Forward != "air")
            cv.newBlock({ x: blockCoords.Forward.x, y: blockCoords.Forward.y, z: blockCoords.Forward.z }, 'green')
        if (tData.blocks.Up != "air")
            cv.newBlock({ x: blockCoords.Up.x, y: blockCoords.Up.y, z: blockCoords.Up.z }, 'green')

    } else {
        console.log('Message from server: ', message.data)
    }
})

// document.getElementById('status')!.addEventListener('click', () => {
//     console.log(cv.objects)
// })
