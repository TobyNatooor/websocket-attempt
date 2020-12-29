
import webSocket from 'ws'

const server = webSocket.Server
const s = new server({
    port: 8080,
})

s.on('connection', ws => {
    console.log('new client connected')

    ws.on('message', message => {
        console.log('message from client: ' + message)

        s.clients.forEach(client => {
            client.send(message)
        })
    })

    ws.on('close', () => console.log('client disconnected'))
})
