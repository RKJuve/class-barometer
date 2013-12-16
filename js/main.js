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
	},
	initialize: function() {
		this.on('change', function() {
			console.log('student model change event');
			this.collection.createStatsModel();
		})
	}
});

//Backbone teacher stats model
App.Stats = Backbone.Model.extend({
	save: function() {
		return null;
	}
});

// Backbone Students collection
App.Students = Backbone.Collection.extend({
	model: App.Student,
	createStatsModel: function() {
		var temp = [0,0,0];
		console.log('createStatsModel works');
		this.each(function(model) {
			if (model.get('status') === 'defcon1') {
				temp[0]++;
			} else if (model.get('status') === 'defcon2') {
				temp[1]++;
			} else if (model.get('status') === 'defcon3') {
				temp[2]++;
			}
		});
		var totalStudents = temp[0] + temp[1] + temp[2];

		App.stats = new App.Stats({
			defcon1: Math.round(100*(temp[0]/totalStudents))+'%',
			defcon2: Math.round(100*(temp[1]/totalStudents))+'%',
			defcon3: Math.round(100*(temp[2]/totalStudents))+'%'
		});
		App.teacherFooterView = new App.TeacherFooterView({
       		model: App.stats
    });

	}
});

// Backbone topic model
App.Topic = Backbone.Model.extend({
	save: function() {
		return null;
	},
	defaults: {topic: "No topic currently set"}
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