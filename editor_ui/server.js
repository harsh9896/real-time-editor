const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const ACTIONS = require("./src/Actions");
const app = express();
const cors = require("cors");
const Axios = require("axios");
const server = http.createServer(app);
const io = new Server(server);
const qs = require('qs');
app.use(cors());
app.use(express.json());
const userSocketMap = {}

app.post("/compile", (req, res) =>{
    //console.log(req.body.code)
    let code = req.body.code
    let language = req.body.language;
    let input = req.body.input
    //console.log(code,input)
    if (language === "python") {
        language = "py"
    }
    //console.log(input)
    var data = qs.stringify({
        'code': code,
        'language': language,
        'input': input
    });
    var config = {
        method: 'post',
        url: 'https://api.codex.jaagrav.in',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        data : data
    };
    
    Axios(config)
      .then(function (response) {
        //console.log(response.data);
        if(response.data.error!=='')
        res.send(response.data.error);
        else
        res.send(response.data.output);
      })
      .catch(function (error) {
        console.log(error);
      });
})

function getAllConnectedClients(roomId)
{
    //console.log( Array.from(io.sockets.adapter.rooms.get(roomId)))
    return Array.from(io.sockets.adapter.rooms.get(roomId) || []).map(
        (socketId) => {
            return {
                socketId,
                username: userSocketMap[socketId],
            };
        }
    );
}
io.on("connection", (socket) => {
    console.log("socket id", socket.id);
    socket.on(ACTIONS.JOIN, ({roomId, username})=>{
        //console.log(username)
        userSocketMap[socket.id]= username;
        socket.join(roomId);
        const clients = getAllConnectedClients(roomId);
        //console.log(clients)
        clients.forEach(({socketId})=>{
            io.to(socketId).emit(ACTIONS.JOINED, {
                clients,
                username,
                socketId:socket.id,
            });
        });
    });

    socket.on(ACTIONS.CODE_CHANGE, ({roomId, code})=>{
        socket.in(roomId).emit(ACTIONS.CODE_CHANGE,{
            code
        });
    });

    socket.on(ACTIONS.SYNC_CODE, ({socketId, code})=>{
        //console.log(code);
        io.to(socketId).emit(ACTIONS.CODE_CHANGE,{
            code
        });
    });


    socket.on("disconnecting", ()=>{
        //console.log(socket.rooms)
        const rooms = [...socket.rooms]
        //console.log(rooms.length)
        rooms.forEach((roomId)=>{
            //console.log(roomId)
            socket.to(roomId).emit(ACTIONS.DISCONNECTED, {
                socketId: socket.id,
                username: userSocketMap[socket.id],
            })
        })
        delete userSocketMap[socket.id];
        socket.leave();
    })
});





const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server is listening at ${PORT}`));
