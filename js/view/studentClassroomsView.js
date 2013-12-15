// Student Select Class View
App.StudentClassroomsView = Backbone.View.extend({
  el: "#contentArea",

  initialize: function() {
    console.log("StudentClassroomsView initialized");
    this.render();
    var collection = this.collection;
  },

  render: function() {
    this.$el.empty();
    var source = $("#studentClassroomsView").html();
    var template = Handlebars.compile(source);
    var html = template();
    this.$el.html(html);

    App.classroomsView = new App.ClassroomsView({
      collection: App.classrooms
    });
  }

});