var path = require("path"),
    _ = require("underscore"),
    express = require("express"),
    io = require("socket.io"),
    http = require("http"),
    app = express();



// The server holds the state of the classrooms in this global object. 
// "schema":
// Classrooms: {
//     classroomId: {
//         clientId: ##id from websocket##
//     }
// }
var Classrooms = {};



//  the server holds student names associated with websockets in this object
//  "schema":
//  nameRegister: {
//      classroomId: {
//          ##id from websocket##: ##student name##
//      }
//  }
var nameRegister = {};

// functions that modify the Classrooms and nameRegister objects

// function addTeacher(classroomId, clientId) {
// !!!! might not need this. yet?
// }
function createClassroom(classroomId) {
    Classrooms[classroomId] = {};
    nameRegister[classroomId] = {};
}

function removeClassroom(classroomId) {
    // disconnect all sockets?
    delete Classrooms[classroomId];
    delete nameRegister[classroomId];
}

function addStudent(classroomId, clientId, studentName) {
    // work around until teacher creating classrooms is working
    // replace with error message about no class to join?
    // if (!Classrooms[classroomId]) {
    //     createClassroom(classroomId)
    // }
    Classrooms[classroomId][clientId] = {
        status: "none",
        comment: ""
    };
    nameRegister[classroomId][clientId] = studentName;
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
    delete nameRegister[classroomId][clientId];
}

// ExpressJS Server Definition
app.set("views", path.join(__dirname, "templates/server"))
    .set("view engine", "hbs")
    .use(express.static(path.join(__dirname, "templates/client")))
    .use(express.static(path.join(__dirname, "js")))
    .use(express.static(path.join(__dirname, "css")))
    .use(express.static(path.join(__dirname, "bower_components")));

app.get("/", function(req, res) {
    console.log("newindex hit");
    res.render("index");
});

app.get("/student", function(req, res) {
    console.log("student route hit");
    res.render("student");
});

app.get("/teacher", function(req, res) {
    console.log("teacher route hit");
    res.render("teacher");
});

// create app server, wrap it in websocket server
var server = http.createServer(app);
io = io.listen(server);

// websocket behavior
io.sockets.on('connection', function(client) {
    //after join, emit list of available classrooms
    client.emit('classroomsUpdate', _.keys(Classrooms));

    //create classroom currently before joining as teacher, potential security hole
    client.on('createClassroom', function(data) {
        createClassroom(data);
        console.log(Classrooms);
        io.sockets.emit('classroomsUpdate', _.keys(Classrooms));
    });

    //teacher connection
    client.on('teacherJoinClassroom', function(classroomId) {
        client.join(classroomId);
        client.emit('update', Classrooms[classroomId]);
        client.emit('nameUpdate', nameRegister[classroomId]);
        console.log("teacher joined classroom");


        io.sockets.on('studentJoinClassroom', function() {

        });

    });

    // student connection
    client.on('studentJoinClassroom', function(classroomId, studentName) {
        client.join(classroomId);
        addStudent(classroomId, client.id, studentName);
        io.sockets. in (classroomId).emit("update", Classrooms[classroomId]);
        console.log(Classrooms);
        console.log(nameRegister);
        client.on('setStatus', function(status) {
            setStatus(classroomId, client.id, status);
            io.sockets. in (classroomId).emit("update", Classrooms[classroomId]);
        });

        client.on('setComment', function(comment) {
            setComment(classroomId, client.id, comment);
            io.sockets. in (classroomId).emit("update", Classrooms[classroomId]);
        });

        client.on('disconnect', function() {
            removeClient(classroomId, client.id);
            io.sockets. in (classroomId).emit("update", Classrooms[classroomId]);
        });
    });

});

// start web server
var port = process.env.PORT || 3000;
server.listen(port);
console.log("Started CodeFellows Class Barometer on port 3000");