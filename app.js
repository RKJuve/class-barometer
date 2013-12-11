var path = require("path"),
    _ = require("underscore"),
    express = require("express"),
    io = require("socket.io"),
    http = require("http"),
    app = express();
    
app.use(express.bodyParser());

// The server holds the state of the 'classroom' in this global object. 
var Classroom = {};

//Initialize an empty array that will contain objects of each chat participant
var participants = [];

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

//POST method to create a chat message
app.post("/message", function(request, response) {
    console.log(request);
  //The request body expects a param named "message"
  var message = request.body.message;

  //If the message is empty or wasn't sent it's a bad request
  if(_.isUndefined(message) || _.isEmpty(message.trim())) {
    return response.json(400, {error: "Message is invalid"});
  }

  //We also expect the sender's name with the message
  var name = request.body.name;

  //Let our chatroom know there was a new message
  io.sockets.emit("incomingMessage", {message: message, name: name});

  //Looks good, let the client know
  response.json(200, {message: "Message received"});

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


        client.on("newUser", function(data) {
            participants.push({id: data.id, name: data.name});
            io.sockets.emit("newConnection", {participants: participants});
        });

        client.on("nameChange", function(data) {
            _.findWhere(participants, {id: client.id}).name = data.name;
            io.sockets.emit("nameChanged", {id: data.id, name: data.name});
        });

        client.on("disconnect", function() {
            participants = _.without(participants,_.findWhere(participants, {id: client.id}));
            io.sockets.emit("userDisconnected", {id: client.id, sender:"system"});
        });
    });

// start web server
var port = process.env.PORT || 3000;
server.listen(port);
console.log("Started CodeFellows Class Barometer on port 3000");