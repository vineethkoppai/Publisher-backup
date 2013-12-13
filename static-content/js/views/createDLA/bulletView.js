define(
['jquery',
'underscore',
'backbone' 
],

function(
$,
_ ,
Backbone ) {

var bulletView  = Backbone.View.extend({
  tagName: "div",
  className:"bullet_div",
  template:_.template("<div id='addedBullet'><img class='bullet_dot' src='imgs/Buttons/dot.png'/><input type='text' id='edit_txt' maxlength='70'/><span id='bullet_data'><%= name %></span><div class='iconDivBulletView'><img id='edit_label' class='editIcon' src='imgs/icon_edit.png' /><img id='close_label' class='bullet_imgClose' src='imgs/icon_close.png' /></div></div>"),

  initialize:function(options){
    this.$saveBtn =  $('#btn_save');
  },

  events:{
      'mouseover #addedBullet':'showDeleteIcon',
      'click #close_label':'deleteBullet',
      'mouseout #addedBullet':'hideDeleteIcon',
      'click #edit_label':'editBullet',
      'click .document':'closeEdit'
    },

  render: function() {
    this.$el.append(this.template(this.model.toJSON()));
    var self=this;
    this.$('#edit_txt').bind('change',function(){
        var data=self.$('#edit_txt').val();
        self.$('#edit_txt').hide();   
        self.$('#bullet_data').text(data);
        self.$('#bullet_data').show();
        self.model.set({name:data});
        self.closeEdit();
    });

    this.$('#edit_txt').bind('blur',function(){
      self.closeEdit();
    });
    return this;
  },

 deleteBullet:function(){
        this.$saveBtn.removeAttr('disabled');
        this.$saveBtn.removeClass('disabledSave');
        this.trigger('deleteAddedBullet',this);
 },
 showDeleteIcon:function(){
    this.$('#bullet_data').css("padding-right"," 30px");
    this.$('.iconDivBulletView').show();
 },
 
 hideDeleteIcon:function(){
    this.$('.iconDivBulletView').hide();
    this.$('#bullet_data').css("padding-right"," 0");
 },
 
 editBullet:function(){
    this.hideDeleteIcon();
    this.undelegateEvents();
    this.$('#bullet_data').hide();
    this.$('#edit_txt').show();
    var data=this.$('#bullet_data').text();   
    this.$('#edit_txt').val(data);
    this.$('#edit_txt').text(this.model.toJSON().name);
    
 },

 closeEdit:function(){
   this.delegateEvents();
    this.$('#edit_txt').hide();
    this.$('#bullet_data').show();
 }
});// end bullet view


return bulletView;

});