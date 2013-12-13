App.Router = Backbone.Router.extend({

  routes: {
    "": "selectUser",
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

  selectUser: function() {
    console.log("Select User Route Hit!");
    App.selectUserPathView = new App.SelectUserPathView();
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
    App.studentClassroomsView = new App.StudentClassroomsView({
      collection: App.classrooms
    });

    App.socket.on('classroomsUpdate', function(data) {
      var temp = [];
      _.each(data, function(elem, index, list) {
        temp.push({
          name: elem
        });
      });

      App.classrooms.set(temp);
    });
  }
});

App.router = new App.Router();
Backbone.history.start({
  root: "/"
});