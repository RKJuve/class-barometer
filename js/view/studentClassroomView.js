//Student classroom view  
App.StudentClassroomView = Backbone.View.extend({
  //tagname defaults to div

  el: '#contentArea',

  initialize: function() {
    this.render();
  },

  render: function() {
    console.log('studentclassroomview render hit');
    this.$el.empty();

    //console.log(App.students);

    var source = $("#studentClassroomView").html();
    var template = Handlebars.compile(source);
    // the template should be handed the context of this.model, but 
    // that is not working for some reason
    var html = template();
    this.$el.html(html);

    // Renders all the boxes indecating students status
    // Will need a for each or somthing but this is firing up the template
    App.studentsInClassroomView = new App.StudentsInClassroomView({
      collection: App.classrooms
    });

    console.log(App.students.length);
  }
});