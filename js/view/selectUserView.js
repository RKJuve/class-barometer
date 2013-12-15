// Backbone Select User View
App.SelectUserPathView = Backbone.View.extend({
  el: "#contentArea",

  events: {
    "click .teacherPath": "teacherPath",
    "click .studentPath": "studentPath"
  },

  initialize: function() {
    console.log("SelectUserPathView initialized");
    this.addBanner();
    this.render();
  },

  addBanner: function() {
    $('#wrap').prepend('<div class="choosePathImage"></div>');
    $(window).resize(function() {
      $('.choosePathImage').height($(window).height());
    });
    $(window).trigger('resize');
  },

  teacherPath: function() {
    App.router.navigate("teacher", {
      trigger: true
    });
    this.fadeImage();
  },

  studentPath: function() {
    App.router.navigate("student", {
      trigger: true
    });
    this.fadeImage();
  },

  fadeImage: function() {
    $(".choosePathImage").fadeOut("slow", function() {
      $(".choosePathImage").remove();
    });
  },

  render: function() {
    $("#contentArea").empty();
    var source = $("#selectYourPath").html();
    var template = Handlebars.compile(source);
    var html = template();
    this.$el.html(html);
  }
});