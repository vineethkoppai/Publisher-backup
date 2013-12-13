define(
['jquery',
'underscore',
'backbone' 
],

function(
$,
_ ,
Backbone ) {

var Spinner  = Backbone.View.extend({
  tagName: "div",
  className:"loadingDiv",
 //template:_.template("<img class='loadingImg' src='imgs/Loading_Animation.gif'/>"),

  initialize:function(options){
     this.$el.html("<img class='loadingImg' src='imgs/spinner.gif'/>");
  },

 show:function(){
    console.log("showing spinner");
    this.$el.show();
 },
 
 hide:function(){
 	console.log("hiding spinner");
    this.$el.hide();
 }


});// end bullet view


return Spinner;

});