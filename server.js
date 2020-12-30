
import webSocket from 'ws'

const server = webSocket.Server
const s = new server({
    port: 8080,
})

s.on('connection', ws => {
    console.log('new client connected')

    //send message to everyone except the one that wrote it
    ws.on('message', message => {
        console.log('message from client: ' + message)
        s.clients.forEach(client => {
            if (client != ws)
                client.send(message)
        })
    })

    ws.on('close', () => console.log('client disconnected'))
})
