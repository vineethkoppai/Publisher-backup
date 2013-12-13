define([
	'jquery',
	'underscore',
	'backbone' ,
	'constants',
	'jqplaceholder',
	'jqplaceholdermin'
],

function(
	$,
	_  ,
	Backbone ,
	constants,
	jqplaceholder,
	jqplaceholdermin
){

var LoginView = Backbone.View.extend({
	el:'#loginDiv',

	events:{
     'click #lobtn'       : 'login',
     'click #frgt'        : 'forgotPassword',
     'click #checkChkbx'  : 'checkTheChkBx',
     'keyup .loginData'   : 'changeTxtColor'
	},

	login:function(){
		$('#login-form').submit();
	},

    // show forgot passsword div when user clicks on forgot password
	forgotPassword:function(){
    	this.trigger('forgotpwd');
	},

	changeTxtColor:function(){
	    if($.browser.msie){
	      $(".placeholderspolyfill").css("color","black");
	    }
	},

	remove:function(){
		this.$el.hide();
	},

	show:function(){
		this.$el.show();
	},

  checkTheChkBx:function(){
    var srcs = $("#checkChkbx").attr('src');
    if(srcs=='imgs/checkbox_bg.png')
      $("#checkChkbx").attr('src','imgs/checkedCheck.png');
    else
      $("#checkChkbx").attr('src','imgs/checkbox_bg.png');
  }

});
return LoginView;
});