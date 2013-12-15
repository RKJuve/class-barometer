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
		"click .classroomList li": "joinClassroom"
	},

	initialize: function() {
		console.log("TeacherCreateClassroomParentView initialized");
		this.render();
		var collection = this.collection;
	},

	joinClassroom: function(e) {
		var data = $(e.target).children().data("name");
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
		console.log("render teach render!!!");
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

App.StudentClassroomsView = Backbone.View.extend({
	el: "#contentArea",

	events: {
		"click .classroomList li": "joinClassroom"
	},

	initialize: function() {
		console.log("TeacherCreateClassroomParentView initialized");
		this.render();
		var collection = this.collection;
	},

	joinClassroom: function(e) {
		var data = $(e.target).children().data("name");
		App.socket.emit('teacherJoinClassroom', data);

		App.router.navigate("student/" + data, {
			trigger: true
		});
	},

	render: function() {
		console.log("render student render!!!");
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

		console.log($(e.target).closest("span"));
		App.socket.emit('teacherJoinClassroom', data);

		App.router.navigate("teacher/" + data, {
			trigger: true
		});
	},

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

//Student classroom view  
App.StudentClassroomView = Backbone.View.extend({
	//tagname defaults to div

	el: '#contentArea',

	initialize: function() {
		this.render();
	},

	render: function() {
		console.log('studentclassroomview render hit');
		this.$el.empty();
		console.log(App.classrooms);

		var source = $("#studentClassroomView").html();
		var template = Handlebars.compile(source);
		// the template should be handed the context of this.model, but 
		// that is not working for some reason
		var html = template();
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