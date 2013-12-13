
define(
[
'jquery',
'underscore',
'backbone' ,
'constants'
],

function(
  $,
  _ ,
  Backbone ,
  constants
   ) {

var Taxonomy = Backbone.Model.extend( {
  defaults: {

  } ,

  initialize:function(options){
   
    var self = this;
    console.log("taxonomy init"+options);
    var taxonomyId = options.taxonomyId;
    $.ajax({
      type:"GET",
       contentType: 'application/json',
       url: constants.getTaxonomy+taxonomyId+'?level=2',
       success: function (data) {
               // data.response['taxonomy-node-list'].state = 'open';
                self.set({'treeData':data.response['taxonomy-node-list']});
                self.getStrandsDomains(options);
               // options.onComplete();
              //  self.doProcess(data,options);

       },
       error: function (e) {
                console.log('error on taxonomy');
                console.log(e);;
       }
    });
  }, // end init

  getStrandsDomains:function(options){

    var self = this;
    var taxonomyId = options.taxonomyId;
    var type = options.type;
    $.ajax({
      type:"GET",
       contentType: 'application/json',
       url: constants.getTaxonomy+taxonomyId+'?type='+type,
       success: function (data) {
                self.set({'strandDomain':data.response['taxonomy-node-list'] });
                options.onComplete();
              //  self.doProcess(data,options);

       },
       error: function (e) {
                console.log('error in fetching starnds');
                console.log(e);;
       }
    });
  }


});

return Taxonomy;

});