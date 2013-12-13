define(
['jquery',
'underscore',
'backbone',
'constants'],

function(
$,
 _,
Backbone,
constants) {

var Moreinfo = Backbone.Model.extend({

  defaults: {
    author:$('#user-disp').text()
  },
  
  initialize:function(options){
    if(options){
      this.url = constants.moreInfo + options.dlaId+'/history';
    }
    //USE THIS AS AUTHOR DURING CREATE DLA
    this.loggedinUser = $('#user-disp').text();  
  },

  parse: function(response) { 
    var author;
    try{
      if(response.response.history.length > 0)
        author = response.response.history[0].user.username;
    }catch(e){} 
    this.set('author', author || this.loggedinUser);
    this.set('history',response.response.history);
  } 

});

return Moreinfo;

});

		