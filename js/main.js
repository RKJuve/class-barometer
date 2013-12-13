// global app namespace
var App = window.App || {};

// moted to #clientStatusBlock
$.get('statusBlock.html', function(res) {
	App.studentTemplate = res;
});

// moved to #classroomListItem
// $.get('classroomList.html', function(res) {
// 	App.classroomTemplate = res;
// });

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
		"click #createClassroom": "createClassroom",
		"submit #createClassroomForm": "createClassroom",
		"click .classroom": "joinClassroom"
	},

	initialize: function() {
		console.log("TeacherCreateClassroomParentView initialized");
		this.render();
		var collection = this.collection;
	},

	joinClassroom: function(e) {
		var data = $(e.target).data("name");
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

		var source = $("#classroomListItem").html();
		var template = Handlebars.compile(source);
		var html = template(this.model.toJSON());
		this.$el.html(html);

		// var template = Handlebars.compile(App.classroomTemplate);
		// this.$el.html(template(this.model.toJSON()));
	}
});

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
		var source = $("#teacherClassroomView").html();
		var template = Handlebars.compile(source);
		// Probably will need the toJSON
		// var html = template(this.model.toJSON());
		var html = template();
		this.$el.html(html);
		// You need this to initalize the bootstrap tabs
		this.startBootstrapTabs();
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