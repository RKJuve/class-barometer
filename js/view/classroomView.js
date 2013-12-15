// Classroom Model View for the individual room
App.ClassroomView = Backbone.View.extend({
  tagName: "li",

  events: {
    "click": "joinClassroom"
  },

  joinClassroom: function(e) {
    //
    // Since context cannot be passed through from the events
    // in backbone, we're having an issue related to e.target
    // identifying the icon within the span instead of the
    // span itself. This is a hacky workaround that allows 
    // the classroom name data to be passed regardless of
    // where the user clicks.
    //

    var iconClick = $(e.target).closest("span").data("name");
    var liClick = $(e.target).children().data("name");
    var data;

    if (!liClick) {
      data = iconClick;
    } else {
      data = liClick;
    }

    var windowLocation = window.location.hash.slice(1);

    App.router.navigate(windowLocation + "/" + data, {
      trigger: true
    });
  },

  initialize: function() {
    this.render();
  },
  // events: {
  //  'click': 'joinClassroom'
  // },
  // joinClassroom: function(){
  //  socket.emit('studentJoinClassroom', this.model.get('name'), studentName);
  // },
  render: function() {

    var source = $("#classroomListItem").html();
    var template = Handlebars.compile(source);
    var html = template(this.model.toJSON());
    this.$el.html(html);

    // var template = Handlebars.compile(App.classroomTemplate);
    // this.$el.html(template(this.model.toJSON()));
  }
});