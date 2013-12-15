// Overall View for a teacher classroom
App.TeacherClassroomParentView = Backbone.View.extend({
  el: "#contentArea",

  initialize: function() {
    console.log("TeacherClassroomParentView initialized");
    this.render();
  },

  startBootstrapTabs: function() {
    $('.teach-tabs a').click(function(e) {
      e.preventDefault();
      $(this).tab('show');
    });
  },

  render: function() {
    $("#contentArea").empty();
    var source = $("#teacherClassroomView").html();
    var template = Handlebars.compile(source);
    // Probably will need the toJSON
    // var html = template(this.model.toJSON());
    var html = template();
    this.$el.html(html);
    // You need this to initalize the bootstrap tabs
    this.startBootstrapTabs();
  },

  //this event should be moved to sub-view when ready
  updateStatus: function() {
    //Assumes there is a resources object within App
    //The jqeury selector will need to be updated based on subview as well
    App.resources.status = $('#updateStatus').val();
    socket.emit('topicChange', App.resources.status);
  }
});