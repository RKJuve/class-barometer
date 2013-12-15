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

    //Create new topic model
    App.topic = new App.Topic();

    App.socket = io.connect(window.location.origin);
  },

  removeFooter: function() {
    console.log("------------ Remove!! -------------");
    $("#footer").fadeOut('fast', function() {
      $('#footer').remove();
    });
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

    App.socket.removeAllListeners('nameUpdate');
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
    this.removeFooter();
  },

  joinClassroom: function(name) {
    console.log("joinClassroom Route fired");
    console.log(name);
    App.socket.emit('teacherJoinClassroom', name);
    App.socket.removeAllListeners('nameUpdate');
    App.socket.removeAllListeners('classroomsUpdate');

    //initial page render
    App.teacherClassroomParentView = new App.TeacherClassroomParentView({});

    //update socket behavior
    App.socket.on("update", function(data) {
      var temp = [];
      _.each(data, function(elem, index, list) {
        temp.push({
          id: index,
          status: elem.status,
          comment: elem.comment
        });
      });

      App.students.reset(temp);
      console.log('update happened, next is students status view');
      App.studentsInClassroomViewT = new App.StudentsInClassroomViewT({
        collection: App.students
      });
    });

    App.socket.on('nameUpdate', function(data) {
      var temp = [];
      _.each(data, function(elem, index, list) {
        temp.push({
          id: index,
          name: elem
        });
      });
      App.students.set(temp);

      console.log(App.students);
    });

    

    App.socket.on('topicUpdate', function(data) {
      App.topic.set({topic: data});
    });

    App.socket.on('needNameUpdate1', function(data) {
      App.socket.emit('needNameUpdate2');
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

  },

  student: function() {
    console.log("student route fired");

    App.socket.removeAllListeners('nameUpdate');
    App.socket.removeAllListeners('needNameUpdate1');
    App.socket.removeAllListeners('classroomsUpdate');

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

  studentJoinClassroom: function(name) {
    console.log("studentJoinClassroom route fired");
    App.studentClassroomView = new App.StudentClassroomView({
      //collection: App.classrooms
    });

    App.socket.removeAllListeners('nameUpdate');
    App.socket.removeAllListeners('classroomsUpdate');

    App.socket.emit("studentJoinClassroom", name, "TEST_STUDENT_NAME");


    //update socket behavior
    App.socket.on("update", function(data) {
      var temp = [];
      _.each(data, function(elem, index, list) {
        temp.push({
          id: index,
          status: elem.status,
          comment: elem.comment
        });
      });


      App.students.reset(temp);
      console.log('update happened, next is students status view');
      App.studentsInClassroomView = new App.StudentsInClassroomView({
        collection: App.students
      });
    });

  }
});

App.router = new App.Router();

Backbone.history.start({
  root: "/"
});