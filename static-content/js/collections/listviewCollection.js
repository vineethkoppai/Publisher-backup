 define(
['underscore',
'backbone',
'models/dla' 
],

function(
 _ ,
Backbone ,
DLA ) {

  var List_DLACollection = Backbone.Collection.extend({

        //model: DLA,

         parse:function(data){
		     return data.response["content-list"];
		 },

		 getCheckedCount:function(){
		 	return this.filter(function(DLA){ return DLA.get('checked'); });
		 }
       
    });

return List_DLACollection;

});