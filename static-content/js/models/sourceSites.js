 define(
['constants',
'backbone'
],

function(
 constants ,
Backbone  ) {

  var SourceSites = Backbone.Model.extend({

  	    initialize:function(option){
			this.urlRoot = constants.sourceSites;
			this.fetch({
				success:function(){
					option.onComplete();
				}
			})
		},

         parse:function(data){
         	 this.set('list', data.response["source-site-list"]); 
		     return data;
		 }
       
    });

return SourceSites;

});