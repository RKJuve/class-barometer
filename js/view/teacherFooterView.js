// Footer view for the teacher

App.TeacherFooterView = Backbone.View.extend({
	el: ".footerContainer",

	events: {
		'click .create-topic-btn': 'topicChange'
	},

	initialize: function() {
		console.log('teacherFooterView initialized');
		this.render();
	},

	render: function() {
		this.$el.empty();
		var source = $('#teacherFooter').html();
		var template = Handlebars.compile(source);
		//will need to know about topic model below
		var html;
		if (this.model) {
			html = template(this.model.toJSON());
		} else {
			html = template();
		}
		this.$el.html(html);
		console.log(source);
	},

	topicChange: function() {
		var topic = $('.create-topic-input').val();
		App.socket.emit('topicChange', topic);
		console.log('topicChange event fired: ' + topic);
	}
});