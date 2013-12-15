// Classrooms Collection View (creates the list of classrooms)
App.ClassroomsView = Backbone.View.extend({
  el: "#classroomList",
  initialize: function() {
    this.render();
  },
  render: function() {
    this.collection.each(function(model) {
      App.classroomView = new App.ClassroomView({
        model: model
      });
      this.$el.append(App.classroomView.el);
    }, this);
  }
});