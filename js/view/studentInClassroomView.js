// Renders each square for students in the classroom and their status
App.StudentsInClassroomView = Backbone.View.extend({
  el: "#studentsInClassList",
  tagName: 'li',

  initialize: function() {
    this.render();
  },

  // Todo: Will need add functionality to set status state defcon1 - 3

  render: function() {
    //this.$el.empty();
    console.log("rendering who is in class");

    var source = $("#studentInClassroom").html();
    var template = Handlebars.compile(source);
    var html = template();
    this.$el.html(html);
  }

});