App.Router = Backbone.Router.extend({

  routes: {
    "": "selectUser",
    "teacher": "teacher",
    "teacher/:name": "joinClassroom",
    "student/:name": "studentJoinClassroom",
    "student": "student"
  },

  initialize: function() {
    console.log("router initialized");
    App.students = new App.Students();
    App.classrooms = new App.Classrooms();

    App.socket = io.connect(window.location.origin);
  },

  index: function() {
    console.log("index route fired");

  },

  selectUser: function() {
    console.log("Select User Route Hit!");
    App.selectUserPathView = new App.SelectUserPathView();
  },

  teacher: function() {
    console.log("teacher route fired");

    App.socket.removeAllListeners('classroomsUpdate');

    App.socket.emit("poll");

    App.socket.on('classroomsUpdate', function(data) {
      var classroomsObjects = [];
      var classroomsArray = _.keys(data);
      _.each(classroomsArray, function(elem, index, list) {
        classroomsObjects.push({
          name: elem
        });
      });

      App.classrooms.set(classroomsObjects);

      App.teacherCreateClassroomParentView = new App.TeacherCreateClassroomParentView({
        collection: App.classrooms
      });

    });


    
  },

  joinClassroom: function() {
    console.log("joinClassroom Route fired");

    App.socket.removeAllListeners('nameUpdate');

    App.socket.on('nameUpdate', function(data){
       var temp = [];
       _.each(data, function(elem, index, list) {
         temp.push({id: index, name: elem});
       });
 
       App.students.set(temp);
 
       console.log(App.students);
    });
    
    App.socket.on('needNameUpdate1', function(data){
      socket.emit('needNameUpdate2');
    });
    // this needs to poll to update current info within the classroom
    //App.socket.emit("poll");

    // Passes current classrooms students and data
    // App.socket.on('studentsUpdate', function(data) {
    //   var temp = [];
    //   _.each(data, function(elem, index, list) {
    //     temp.push({
    //       name: elem
    //     });
    //   });

    //   App.classrooms.set(temp);

    App.teacherClassroomParentView = new App.TeacherClassroomParentView({
      // need to pass in collection for students
      // collectionL App.students
    });
  },

  student: function() {
    console.log("student route fired");

    App.socket.removeAllListeners("classroomsUpdate");

    App.socket.emit("poll");


    // TODO: Can this be added to main.js since this block is
    // being used multiple times?
    
    App.socket.on('classroomsUpdate', function(data) {
      var classroomsObjects = [];
      var classroomsArray = _.keys(data);
      _.each(classroomsArray, function(elem, index, list) {
        classroomsObjects.push({
          name: elem
        });
      });

      App.classrooms.set(classroomsObjects);

      App.studentClassroomsView = new App.StudentClassroomsView({
      collection: App.classrooms
      });
    });
    

    
  },

  studentJoinClassroom: function() {
    console.log("studentJoinClassroom route fired");
    App.socket.emit("poll");

    App.socket.on('classroomsUpdate', function(data) {
      var temp = [];
      _.each(data, function(elem, index, list) {
        temp.push({
          name: elem
        });
      });
      App.classrooms.set(temp);
      App.studentClassroomView = new App.StudentClassroomView({
        collection: App.classrooms
      });
    });

    


    
  }
});

App.router = new App.Router();
Backbone.history.start({
  root: "/"
});