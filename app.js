var path = require("path"),
    _ = require("underscore"),
    express = require("express"),
    io = require("socket.io"),
    http = require("http"),
    app = express();


// The server holds the state of the 'classroom' in this global object. 
var Classroom = {};

// functions that modify the Classroom object
function addClient(clientId) {
    var temp = {status: "", comment: "no comment"};

    Classroom[clientId] = temp;
}
function setStatus(clientId, updatedStatus) {
    Classroom[clientId].status = updatedStatus;
}
function setComment(clientId, updatedComment) {
    Classroom[clientId].comment = updatedComment;
}
function removeClient(clientId) {
    delete Classroom[clientId];
}

// ExpressJS Server Definition
app.set("views", path.join(__dirname, ""))
   .set("view engine", "hbs")
   .use(express.static(path.join(__dirname, "templates")))
   .use(express.static(path.join(__dirname, "js")));

app.get("/", function(req, res) {
    console.log("index hit");
    res.render("index");
});

app.get("/server", function(req, res) {
    console.log("server hit");
    //res.render("server");
});

app.get("/client", function(req, res) {
    console.log("server hit");
    //res.render("client");
});

// create and start io server thing
var server = http.createServer(app);
    io = io.listen(server);

    io.sockets.on('connection', function(client) {

        addClient(client.id);
        io.sockets.emit("update", Classroom);

        client.on('setStatus', function(status) {
            setStatus(client.id, status);
            io.sockets.emit("update", Classroom);
        });

        client.on('setComment', function(comment) {
            setComment(client.id, comment);
            io.sockets.emit("update", Classroom);
        });
        
        client.on('disconnect', function(){
            removeClient(client.id);
            io.sockets.emit("update", Classroom);
        });
    });

// start web server
server.listen(3000);
console.log("Started CodeFellows Class Barometer on port 3000");