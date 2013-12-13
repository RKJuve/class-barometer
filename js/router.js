App.Router = Backbone.Router.extend({

  routes: {
    "": "index",
    "teacher": "teacher",
    "teacher/:name": "joinClassroom",
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

  teacher: function() {
    console.log("teacher route fired");

    App.socket.emit("poll");

    App.socket.on('classroomsUpdate', function(data) {
      var temp = [];
      _.each(data, function(elem, index, list) {
        temp.push({
          name: elem
        });
      });

      App.classrooms.set(temp);

      // Need to instantiate TeacherCreateClassroomParentView here
      if (App.teacherCreateClassroomParentView) {
        // does this need to happen here? can it be part of the render?
        App.teacherCreateClassroomParentView.el.innerHTML = '';
        App.teacherCreateClassroomParentView.render();
      } else {
        App.teacherCreateClassroomParentView = new App.TeacherCreateClassroomParentView({
          collection: App.classrooms
        });
      }

    });

    App.socket.on('nameUpdate', function(data) {
      //update each model by id, with name
    });
  },

  joinClassroom: function() {
    console.log("joinClassroom Route fired");

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
  }
});

App.router = new App.Router();
Backbone.history.start({
  root: "/"
});