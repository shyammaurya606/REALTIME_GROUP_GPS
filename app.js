const express = require("express");
const app = express();
const path = require("path");

//Setup of Socket.io
const http = require("http");
const socketio = require("socket.io");
const server = http.createServer(app);
const io = socketio(server);

//Set EJS as the view engine
app.set("view engine", "ejs");

//Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, "public")));

//Handle Socket.io connections
io.on("connection", function (socket) {
    socket.on("send-location", function (data) {
        io.emit("receive-location", {id: socket.id, ...data  })
    });

    socket.on("disconnect", function(){
        io.emit("user-disconnected", socket.id);
    });
});

//Render the index.ejs file on the root route
app.get("/", function (req, res) {
    res.render("index");
}); 

//Start the server
server.listen(8080, () => {
    console.log("Server is listening on port 8080");
    console.log("Make a visit on localhost:8080.,");
});
