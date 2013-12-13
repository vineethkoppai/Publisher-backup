define([
'jquery',
'bootstrap',
'underscore',
'backbone',
'text!templates/createDLA/standard.html' ],

function(
$,
Bootstrap,
_ ,
Backbone,
StandardTemplate ) {

var DescriptionView  = Backbone.View.extend({
  tagName: "div",
  className:"node",
  template:_.template(StandardTemplate),

  initialize:function(options){
    this.model.on('destroy', this.removeView, this);
  },

  events:{
      'click #close_node':'deleteNode',
      'click input[name^="standardRating"]':'rating',
      'click .nodeText':'getName'
    },

  render: function() {
    var model = this.model.toJSON();
    this.$el.append(this.template( {model:model} ));
    this.tooltip();
    return this;
  }
  ,

 deleteNode:function(){
        this.$el.popover('hide');
        
        $('#btn_save').removeAttr('disabled');
        $('#btn_save').removeClass('disabledSave');
        this.trigger('deleteAddedNode',this);
 },

 removeView:function(){
   this.$el.remove();
 },
  //METHOD TO RATE THE STANDARD WHEN USER CLCIKS ON A RATING
 rating:function(e){
  var rating = this.$('input[name^="standardRating"]:checked').attr('value');
  this.model.set('rating',rating);
 },
 getName:function(){

 },
  //REGISTER A FUNCTION TO SHOW A TOOLTIP
tooltip:function(){
  var self = this;
  this.$(".nodeText").popover({ 
    delay:{ 
            show: "800", 
            hide: "0"
          },
    html : true,
    trigger:'hover',
    title:self.model.get('name'),
    placement:'top',
    content:self.model.get('description')
  });

    // this.$(".nodeText").on('shown.bs.popover', function () {
    //   console.log("inside Setting left position");
    //   console.log($('.popover').css('left',parseInt($('.popover').css('left')) + 220 + 'px'));
    // });

 }

});// end view

return DescriptionView;

});