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

var DLA = Backbone.Model.extend({
 
 url:constants.getConetnt,

 parse:function(response){
 	if(response.response)
    return response.response.content;
 }


});
return DLA;
});

		