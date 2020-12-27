
const http = require("http");
const fs = require('fs')
const WebSocketServer = require("websocket").server
let connection = null;

const httpserver = http.createServer((req, res) => {
    fs.readFile('./index.html', (err, html) => {
        if (err) throw err;
        res.end(html)
    })
})

const websocket = new WebSocketServer({ "httpServer": httpserver })

httpserver.listen(8080, () => console.log("server is running on port 8080"))

websocket.on("request", request => {

    connection = request.accept(null, request.origin)
    connection.on("message", message => {
        console.log(`Message from client: ${message.utf8Data}`)
        connection.send(`this message was recieved: ${message.utf8Data}`)
    })
})
