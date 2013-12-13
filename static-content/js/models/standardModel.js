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
 
var standard = Backbone.Model.extend({
 
   defaults:{
   	 id:null
   	 // name:'',
   	 // description:'',
   	 // node_type:'',
   	 // tree_type:'',
   	 // rating:''
   }
});
 
return standard;
});