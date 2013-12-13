define(
['jquery', 'underscore', 'backbone'],

function($, _, Backbone) {

var LoadingIconView = Backbone.View.extend({
  tagName: "div",
  className: "page_effect",
  template:_.template("<img src='imgs/loading.gif' /> "),

  render: function() {
    this.$el.append(this.template);  
    return this;
  },

   show:function(){
    console.log("showing the loading icon");
    this.$el.show();
   // this.$el.delay(1000).fadeOut();
  } ,

  hide:function(){
    this.$el.hide()
  }

});


return LoadingIconView;

});
