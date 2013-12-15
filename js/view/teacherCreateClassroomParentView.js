// Teacher Create Classroom View
App.TeacherCreateClassroomParentView = Backbone.View.extend({
  el: "#contentArea",

  events: {
    "click #createClassroom": "createClassroom",
    "submit #createClassroomForm": "createClassroom",
    "click .classroomList li": "joinClassroom"
  },

  initialize: function() {
    console.log("TeacherCreateClassroomParentView initialized");
    this.render();
    var collection = this.collection;
  },

  joinClassroom: function(e) {
    var data = $(e.target).children().data("name");
    App.socket.emit('teacherJoinClassroom', data);

    App.router.navigate("teacher/" + data, {
      trigger: true
    });
  },

  createClassroom: function(e) {
    e.preventDefault();

    //--------
    // This section trims whitespace before or after the
    // classroom name, prevents submissions from being blank
    // and then clears the input field after submission.
    //--------

    var classroomName = $("[name='classroomName']");
    var trimmedName = classroomName.val().replace(/^\s\s*/, '').replace(/\s\s*$/, '');
    if (trimmedName.length === 0) {
      return;
    }
    App.socket.emit('createClassroom', trimmedName);
    classroomName.val("");
  },

  render: function() {
    this.$el.empty();
    var source = $("#teacherCreateClassroomParent").html();
    var template = Handlebars.compile(source);
    var html = template();
    this.$el.html(html);

    App.classroomsView = new App.ClassroomsView({
      collection: App.classrooms
    });
  }

});