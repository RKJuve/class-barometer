// global app namespace
window.App = {}

//Backbone Client representation
App.Client = Backbone.Model.extend({
	//override AJAX save method, don't need it/errors
	save: function() { return null; }
});



// Backbone Classroom representation
App.Classroom = Backbone.Collection.extend({
	model: App.Client
});

App.Classroom.prototype.create = function(model, options) {
	options = options ? _.clone(options) : {};
	if (!(model = this._prepareModel(model, options))) return false;
	if (!options.wait) this.add(model, options);
	var collection = this;
	var success = options.success;
	options.success = function(model, resp, options) {
	if (options.wait) collection.add(model, options);
	if (success) success(model, resp, options);
	};
	model.save(null, options);
	return model;
};