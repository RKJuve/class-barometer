var path = require("path"),
    _ = require("underscore"),
    express = require("express"),
    io = require("socket.io"),
    http = require("http"),
    app = express();


// The server holds the contents of various open files in this
// global object. 
var fileContent = {};


// ExpressJS Server Definition
app.set("views", path.join(__dirname, "templates"))
   .set("view engine", "hbs");

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
        client.on("save", function(data) {
            client.broadcast.emit("update", data);

        });
    });

// start web server
server.listen(3000);
console.log("Started teamedit on port 3000");