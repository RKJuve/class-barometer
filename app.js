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
//  Resources: {
//      classroomId: {
//          topic: "",
//          resourcesPage: ['', '', ''],
//          timers: []
//      }
//  }

//  the server holds student names associated with websockets in this object
//  "schema":
//  nameRegister: {
//      classroomId: {
//          ##id from websocket##: ##student name##
//      }
//  }
var nameRegister = {};

// The server tracks the state of all teacher resources
// "schema":
// resources:
//   classroomID: {
//       topic: 'current topic',
//       links: ['array of links'],
//       etc: 'whatever else'
//   };
var resources = {};

// functions that modify the Classrooms and nameRegister objects

// function addTeacher(classroomId, clientId) {
// !!!! might not need this. yet?
// }
function createClassroom(classroomId) {
    Classrooms[classroomId] = {};
    nameRegister[classroomId] = {};
    resources[classroomId] = {};
}

// helper function to add topic to resources object
function updateResourcesTopic(classroomId, topic) {
    resources[classroomId].topic = topic;
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

    // ERROR: This is crashing the server, we need to
    // do some more work to get this data in the
    // intended format.

    // First set of work to try to correct.
    // var clientIdObject = { clientId: clientId};
    // Classrooms[classroomId] = clientIdObject;

    Classrooms[classroomId][clientId] = {
        status: "defcon3",
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
// app.set("views", path.join(__dirname, "templates/server"))
//     .set("view engine", "hbs")
//     .use(express.static(path.join(__dirname, "templates/client")))
//     .use(express.static(path.join(__dirname, "js")))
//     .use(express.static(path.join(__dirname, "css")))
//     .use(express.static(path.join(__dirname, "bower_components")));

app.use(express.static(__dirname,
    path.join(__dirname, "bower_components"),
    path.join(__dirname, "js"),
    path.join(__dirname, "css")));


app.get("/", function(req, res) {
    console.log("newindex hit");
    res.render("index");
});

// app.get("/student", function(req, res) {
//     console.log("student route hit");
//     res.render("student");
// });

// app.get("/teacher", function(req, res) {
//     console.log("teacher route hit");
//     res.render("teacher");
// });

// create app server, wrap it in websocket server
var server = http.createServer(app);
io = io.listen(server);

// websocket behavior
io.sockets.on('connection', function(client) {
    // after join, emit classroom information
    // client.emit('classroomsUpdate', Classrooms);



    // This is a response to a poll request for classroom information from the teacher route
    client.on('poll', function() {
        client.emit('classroomsUpdate', Classrooms);
    });

    //create classroom currently before joining as teacher, potential security hole
    client.on('createClassroom', function(data) {
        createClassroom(data);
        console.log(Classrooms);
        io.sockets.emit('classroomsUpdate', Classrooms);
    });

    //teacher connection
    client.on('teacherJoinClassroom', function(classroomId) {
        client.join(classroomId);
        client.emit('update', Classrooms[classroomId]);
        client.emit('nameUpdate', nameRegister[classroomId]);
        console.log("teacher joined classroom");


        client.on('topicChange', function(data) {
            console.log(data);
            updateResourcesTopic(classroomId, data);
            io.sockets. in (classroomId).emit('topicUpdate', data);
        });


        client.on('needNameUpdate2', function() {
            console.log("nameupdate needed2");
            client.emit('nameUpdate', nameRegister[classroomId]);
        });


        io.sockets.on('studentJoinClassroom', function() {

        });

    });

    // student connection
    client.on('studentJoinClassroom', function(classroomId, studentName) {
        //client joins room
        client.join(classroomId);
        //client fed to addStudent function



        addStudent(classroomId, client.id, studentName);
        console.log(Classrooms);
        console.log(nameRegister);
        // update room about student
        io.sockets. in (classroomId).emit("update", Classrooms[classroomId]);
        // update room that name update is needed
        console.log("nameupdate needed1");
        io.sockets. in (classroomId).emit("needNameUpdate1");

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