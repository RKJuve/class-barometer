// Renders area for students in the classroom and their status
App.StudentsInClassroomView = Backbone.View.extend({
  el: "#studentsInClassList",
  initialize: function() {
    this.render();
  },

  // Todo: Will need add functionality to set status state defcon1 - 3

  render: function() {
    this.$el.empty();
    console.log("rendering all students status");
    this.collection.each(function(model){
      App.studentInClassroomView = new App.StudentInClassroomView({
        model: model
      })
    });
  }

});

// Renders each square for students in the classroom and their status
App.StudentInClassroomView = Backbone.View.extend({
  el: "#studentsInClassList",
  tagName: 'li',

  initialize: function() {
    this.render();
  },

  // Todo: Will need add functionality to set status state defcon1 - 3

  render: function() {
    console.log("rendering one student's status");

    var source = $("#studentInClassroom").html();
    var template = Handlebars.compile(source);
    var html = template(this.model.toJSON());
    this.$el.append(html);
  }

});