// global app namespace
window.App = {}

// get templates
$.get('student.html', function(res) {
	App.studentTemplate = res;
});
$.get('classroom.html', function(res) {
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

// Classrooms Collection View
App.ClassroomsView = Backbone.View.extend({
	el: "#dropzone",
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
	tagName: null, // <--- super hacky way to stop backbone wrapping this in an extra div
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