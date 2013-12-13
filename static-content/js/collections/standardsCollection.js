define(
['underscore',
'backbone',
'models/standardModel',
'constants'
],

function(
_,
Backbone,
Standard,
constants) {

	var collection = Backbone.Collection.extend({
		unique: true,
		model:Standard,

		initialize:function(options){
			this.on('remove', this.destroyModel, this);
		},

		destroyModel:function(model) {
			model.trigger('destroy');
		}


	});
	return collection;
});