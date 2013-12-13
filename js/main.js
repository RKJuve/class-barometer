// global app namespace
var App = window.App || {};

// get templates
$.get('statusBlock.html', function(res) {
	App.studentTemplate = res;
});
$.get('classroomList.html', function(res) {
	App.classroomTemplate = res;
});

//Backbone Classroom model
App.Classroom = Backbone.Model.extend({
	//override AJAX save method, don't need it/errors
	save: function() {
		return null;
	}
});

//Backbone Classrooms Collection
App.Classrooms = Backbone.Collection.extend({
	model: App.Classroom
});

App.TeacherCreateClassroomParentView = Backbone.View.extend({
	el: "#contentArea",

	events: {
		"click #createClassroom" : "createClassroom",
		"submit #createClassroomForm" : "createClassroom",
		"click .classroom": "joinClassroom"
	},

	initialize: function() {
		this.render();
		var collection = this.collection;
	},

	joinClassroom: function() {
		socket.emit('teacherJoinClassroom', $(this).attr("data"));
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
      socket.emit('createClassroom', trimmedName);
      classroomName.val("");
	},

	render: function(){
		var source = $("#teacherCreateClassroomParent").html();
		var template = Handlebars.compile(source);
		var html = template();
		this.$el.html(html);

        App.classroomsView = new App.ClassroomsView({
          collection: App.classrooms
        });
	}

});

// Classrooms Collection View
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
// Classroom Model View
App.ClassroomView = Backbone.View.extend({
	tagName: "li",
	initialize: function() {
		this.render();
	},
	// events: {
	// 	'click': 'joinClassroom'
	// },
	// joinClassroom: function(){
	// 	socket.emit('studentJoinClassroom', this.model.get('name'), studentName);
	// },
	render: function() {
		var template = Handlebars.compile(App.classroomTemplate);
		this.$el.html(template(this.model.toJSON()));
	}
});



//Backbone Student model
App.Student = Backbone.Model.extend({
	//override AJAX save method, don't need it/errors
	save: function() {
		return null;
	}
});

// Backbone Students collection
App.Students = Backbone.Collection.extend({
	model: App.Student
});

// Students Collection View
App.StudentsView = Backbone.View.extend({
	el: "#dropzone",
	initialize: function() {
		this.render();
	},
	render: function() {
		this.collection.each(function(model) {
			App.studentView = new App.StudentView({
				model: model
			});
			this.$el.append(App.studentView.el);
		}, this);
	}
});
// Student Model View
App.StudentView = Backbone.View.extend({
	tagName: null, // <--- super hacky way to stop backbone wrapping this in an extra div
	initialize: function() {
		this.render();
	},
	render: function() {
		var template = Handlebars.compile(App.studentTemplate);
		this.$el.html(template(this.model.toJSON()));
	}
});