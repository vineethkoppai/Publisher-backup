define([
'jquery',
'underscore',
'backbone' 
],

function(
$,
_ ,
Backbone ) {

var keywordView  = Backbone.View.extend({
    tagName: "div",
  className:"keyword_div",
  template:_.template("<span id='addedKeyword'><%= name %><img id='close_keyword' class='keyword_imgClose' src='imgs/Buttons/closebtn.png' /></span>"),

  initialize:function(options){
     this.$saveBtn =  $('#btn_save');
     this.model.bind('remove',this.clear, this);
  },

  events:{
      'mouseover ':'showDeleteIcon',
      'click #close_keyword':'deleteKeyword',
      'click #close_keyword_LookUp':'deleteKeyword',
      'mouseover #close_keyword':'changeToRed',
       'mouseout #close_keyword':'changeImage',
      'mouseout ':'hideDeleteIcon'      
    },

  render: function() {
    this.$el.append(this.template(this.model.toJSON()));
    return this;
  },

 deleteKeyword:function(){
      this.$saveBtn.removeAttr('disabled');
      this.$saveBtn.removeClass('disabledSave');
      this.trigger('deleteKeyword',this);
 },
 showDeleteIcon:function(){
    //this.$('#close_keyword').show();
 },
 
 hideDeleteIcon:function(){
    //this.$('#close_keyword').hide();
 },

 changeToRed:function(){
    this.$('#close_keyword').attr('src','imgs/Buttons/closebtn_red.png');
 },

 changeImage:function(){

     this.$('#close_keyword').attr('src','imgs/Buttons/closebtn.png');
 },

  clear:function(){
      this.remove();
  }

});// end of view

return keywordView;

});