// global app namespace
var App = window.App || {};

// moted to #clientStatusBlock
// $.get('statusBlock.html', function(res) {
// 	App.studentTemplate = res;
// });

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
	},
	topicUpdate: function() {
		socket.on('topicUpdate', function(data) {
			//Change jquery selector to whatever is applicable when topic view is finalized
			$('#topic').val(data);
		});
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