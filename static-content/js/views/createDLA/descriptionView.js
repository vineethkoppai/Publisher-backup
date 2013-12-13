define([
'jquery',
'underscore',
'backbone' ],

function(
$,
_ ,
Backbone ) {

var DescriptionView  = Backbone.View.extend({
  tagName: "div",
  className:"node",
  template:_.template(
    "<div id='addedNode'>"
    +"<span class='nodeText' title='<%=model.description %>'><%=model.name %></span>"
    +"<img id='close_node' class='keyword_imgClose' src='imgs/Buttons/closebtn.png' />"
    +"</div>"),

  initialize:function(options){
  },

  events:{
      'click #close_node':'deleteNode'
    },

  render: function() {
    var model = this.model.toJSON();
    this.$el.append(this.template( {model:model} ));
    return this;
  },

 deleteNode:function(){
        $('#btn_save').removeAttr('disabled');
        $('#btn_save').removeClass('disabledSave');
        this.trigger('deleteAddedNode',this);
 },
 showDeleteIcon:function(){
    this.$('#close_node').show();

 },
 
 hideDeleteIcon:function(){
    this.$('#close_node').hide();
 }

});// end view

return DescriptionView;

});