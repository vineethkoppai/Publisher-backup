define(
['jquery', 'underscore', 'backbone', 'constants'],

function($, _, Backbone, constants) {


//model for the create dla form 
var DLAForm = Backbone.Model.extend( {
 
  // api url to get the data for the form which needs to be pre populated
  urlRoot : constants.contentPropertiesURL,
 //  urlRoot : "https://pml.firebaseio.com/metadatanew.json",

  initialize:function(){
  },

  parse: function(response) { 
    response = response.response;
    this.set('id',response['content-type'].id);
    this.set('name',response['content-type'].name);
    this.set('contentTypeMetaData',response['content-type']['meta-attribute-description-list']);
    this.set('subjects',response['content-type']['subject-list']);
  } 

});

return DLAForm;

})
