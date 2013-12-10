var path = require("path"),
    _ = require("underscore"),
    express = require("express"),
    io = require("socket.io"),
    http = require("http"),
    app = express();


// The server holds the state of the 'classroom' in this global object. 
var Clients = {};

// functions that modify the Clients object
function addClient(clientId) {
    var temp = {status: "", comment: "no comment"};

    Clients[clientId] = temp;
}
function updateStatus(clientId) {

}
function removeClient(clientId) {
    delete Clients[clientId];
}

// ExpressJS Server Definition
app.set("views", path.join(__dirname, "templates"))
   .set("view engine", "hbs")
   .use(express.static(path.join(__dirname, "js")));

app.get("/", function(req, res) {
    console.log("index hit");
    res.render("index");
});

app.get("/server", function(req, res) {
    console.log("server hit");
    res.render("server");
});

app.get("/client", function(req, res) {
    console.log("server hit");
    res.render("client");
});

// create and start io server thing
var server = http.createServer(app);
    io = io.listen(server);

    io.sockets.on('connection', function(client) {

        addClient(client.id);
        io.sockets.emit("update", Clients);
        
        client.on('disconnect', function(){
            removeClient(client.id);
            io.sockets.emit("update", Clients);
        })
    });

// start web server
server.listen(3000);
console.log("Started CodeFellows Class Barometer on port 3000");