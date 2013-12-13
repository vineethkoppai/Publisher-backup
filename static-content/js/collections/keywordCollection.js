define([], 

function() {

		var keywords = Backbone.Collection.extend({


			comparator:function(model) {
            	return model.get("name"); 
        	},

			sortKeywords: function() {
				this.clear();
				this.sort();
				this.trigger('render');				
			},	

			clear: function() {
				this.each(function(keyword) {
					keyword.trigger('remove');
				});
			},

			//THIS WILL BE USED BY SORT FUNCTION, WE USE THIS FOR REVERSE SORTING AS WE ARE DOING PREPEND IN DOM
			sortBy: function(){		
				var models = _.sortBy(this.models, this.comparator, this);				
				models.reverse();			
				return models;
			}

		});

		return keywords;

});