define(
[
'jquery',
'underscore',
'backbone' ,
'text!templates/pageHeader.html' ,
'models/user',
'constants'
],

function(
$,
_ ,
Backbone ,
PageHeader,
UserModel,
constants) {

var PageHeader = Backbone.View.extend({
   el: '#pageHeader',
   template:_.template( PageHeader ),

   events:{
    'click #addUsers':'renderAddUsersDiv',
    'click #logout':"logout",
    'click #masterReportId':'generateReport',
    'mouseover #dropSettings':'showLogout',
    'mouseleave #settings_menu':'hideLogout',
    'click .closeDownload':'closeDownloads',
    'click #logo':'home'
   },

  initialize:function(){
   this.render();
  },

  render: function() {   
    this.$el.html(this.template(this.model.toJSON()));
    if(this.model.get('role').toUpperCase() !== constants.admin.toUpperCase() ){
      $('#divDefineUsers').hide().next().hide();
    }
  },

  //to remove sub nav bar
  remove:function(){
    this.$el.empty();
    this.$el.hide()
  } ,

  show:function(){
    this.render();
    this.$el.show();
  },

  logout:function(){
    javascript:logout();
  },

  renderAddUsersDiv:function(){
    this.trigger('renderAddUsers');
  },

  // Master dla report generating
  generateReport:function(){
    var self = this;
    this.$downloadDiv = $('#downloadDiv');
    this.$downloadDiv.show().delay(1500).fadeOut();
    $("<iframe/>", {
      src: constants.masterReport,
      class:'download-iframe'
    }).appendTo("body");
  },

  //Clossing all downloads
  closeDownloads:function(){
    if(window.stop !== undefined){
      window.stop();
    }
    else if(document.execCommand !== undefined){
      document.execCommand("Stop", false);
    }
    this.$downloadDiv.hide();
  },

  //IE TRICK TO SHOW LOGOUT DROP DOWN
  showLogout:function(){
    if(!$.browser.msie)
      return;
     $('div#settings_menu').show();
  },

  hideLogout:function(){
   if(!$.browser.msie)
      return;
    $('#settings_menu').hide();
  },
  //CLICK ON HOME, REFRESH SHOW ALL COUNT
  home:function(){
     constants.eventbus.trigger('refreshCount');
  }

});

return PageHeader;

});