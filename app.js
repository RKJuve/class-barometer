var path = require("path"),
    _ = require("underscore"),
    express = require("express"),
    io = require("socket.io"),
    http = require("http"),
    app = express();


// The server holds the state of the classrooms in this global object. 
var Classrooms = {};

// functions that modify the Classrooms object
function addTeacher(classroomId, clientId) {

    Classrooms[classroomId][clientId] = {status: "none", comment: ""};
    // 
}
function addStudent(classroomId, clientId) {
    if (!Classrooms[classroomId]) {
        Classrooms[classroomId] = {};
    }
    Classrooms[classroomId][clientId] = {status: "none", comment: ""};
    console.log(Classrooms);
    // [classroomId]
}
function setStatus(classroomId, clientId, updatedStatus) {
    Classrooms[classroomId][clientId].status = updatedStatus;
    // [classroomId]
}
function setComment(classroomId, clientId, updatedComment) {
    Classrooms[classroomId][clientId].comment = updatedComment;
    // [classroomId]
}
function removeClient(classroomId, clientId) {
    delete Classrooms[classroomId][clientId];
    // [classroomId]
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


        client.on('joinClassroom', function(classroomId){
            client.join(classroomId);
            addStudent(classroomId, client.id)
            io.sockets.in(classroomId).emit("update", Classrooms[classroomId]);
        
            client.on('setStatus', function(status) {
                setStatus(classroomId, client.id, status);
                io.sockets.in(classroomId).emit("update", Classrooms[classroomId]);
            });

            client.on('setComment', function(comment) {
                setComment(classroomId, client.id, comment);
                io.sockets.in(classroomId).emit("update", Classrooms[classroomId]);
            });

            client.on('disconnect', function(){
                removeClient(classroomId, client.id);
                io.sockets.in(classroomId).emit("update", Classrooms[classroomId]);
            });
        });
                
    });

// start web server
var port = process.env.PORT || 3000;
server.listen(port);
console.log("Started CodeFellows Class Barometer on port 3000");