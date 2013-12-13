define([
	'jquery',
	'underscore',
	'backbone' ,
	'constants',
	'jqplaceholder',
	'jqplaceholdermin',
	'login',
	'forgotpwd'
],

function(
	$,
	_  ,
	Backbone ,
	constants,
	jqplaceholder,
	jqplaceholdermin,
	LoginView,
	ForgotPwdView
) {

var LoginApp =  Backbone.View.extend({
	el:'body',

	initialize:function(){

		Placeholders.init({
		live: true, //Apply to future and modified elements too
		hideOnFocus: true //Hide the placeholder when the element receives focus
		});

		this.loginView  = new LoginView();
		this.forgotPwdView = new ForgotPwdView();
		this.loginView.on('forgotpwd',this.forgotPwd , this);
		this.forgotPwdView.on('cancel' , this.showLogin , this);
		this.render();
	},

	render:function(){
		Placeholders.init();
	},

	forgotPwd:function(){
		this.loginView.remove();
		this.forgotPwdView.show();
		this.forgotPwdView.hideError();
		this.forgotPwdView.hideSuccessMsg();
	},

	showLogin:function(){
		this.loginView.show();
		this.forgotPwdView.remove();
	}
});
	return LoginApp;
});