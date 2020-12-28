
const http = require("http");
const WebSocketServer = require("websocket").server
let connection = null

const httpserver = http.createServer()
const websocket = new WebSocketServer({ "httpServer": httpserver })

httpserver.listen(8080, () => console.log("server is running on port 8080"))

websocket.on("request", req => {

    connection = req.accept(null, req.origin)
    connection.on("message", message => {
        console.log(`Message from client: ${message.utf8Data}`)
        connection.send(`This message was recieved: ${message.utf8Data}`)
    })
})
