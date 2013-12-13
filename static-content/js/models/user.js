define(
['jquery',
'underscore',
'backbone',
'constants'],

function($,
 _,
 Backbone,
 constants) {

var user = Backbone.Model.extend({

  defaults: {
    id:null,
    username: '',
    role:''
  },

  urlRoot:constants.user

});
return user;
});

