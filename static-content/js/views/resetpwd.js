
require.config({

  paths: {
    // Libraries
    jquery: "../lib/jquery",
    underscore: "../lib/underscore",
    backbone: "../lib/backbone", 
    bootstrap:"../lib/bootstrap",
    constants:"../utils/constants"
  //  jqplaceholder:"../lib/Placeholders/Placeholders",
   // jqplaceholdermin:"../lib/Placeholders/Placeholders.min"
  },

  shim: {
    underscore: {
      exports: "_"
    },

    backbone: {
      deps: ["underscore", "jquery"],
      exports: "Backbone"
    }
  }
});

define([
'jquery',
'underscore',
'backbone' ,
'constants'
],

function(
$,
 _  ,
Backbone ,
constants
) {

var ResetPwdView = Backbone.View.extend({
	el:'#divResetPwd',

	events:{
       'click #reset_send':'confirmPasswd',
       'click #reset_cancel':'cancel',
       'click #checkChkbx': 'checkTheChkBx',
       'click #uncheckChkbx': 'uncheckTheChkBx',
       'keyup #passwordTxt'    : 'checkStrength'
       //'keyup #conf_password':'confirmPasswd'
	},

	initialize:function(){

    this.pwdTxt = '#passwordTxt';
    this.confirmPwdTxt = '#conf_password';
    this.sendBtnId = '#reset_send';
    this.cancelBtnId = '#reset_cancel';
    // Placeholders.init({
    //     live: true, //Apply to future and modified elements too
    //     hideOnFocus: true //Hide the placeholder when the element receives focus
    // });
    //get the query string params using below function
		this.urlParams = {};
		var match,
        pl     = /\+/g,  // Regex for replacing addition symbol with a space
        search = /([^&=]+)=?([^&]*)/g,
        decode = function (s) { return decodeURIComponent(s.replace(pl, " ")); },
        query  = window.location.search.substring(1);

       while (match = search.exec(query))
       this.urlParams[decode(match[1])] = decode(match[2]);
       console.log(this.urlParams.username);
       this.typingTimer;                //timer identifier
       this.doneTypingInterval = 1100;	
       this.disableContinueBtn();	
       this.render();
	},

  render:function(){
    console.log("render reset");
   //  Placeholders.init();
  },

  checkStrength:function(){
    var password = $(this.pwdTxt).val();
    //initial strength
    var strength = 0;  
    //if the password length is less than 6, return message.
    

    //length is ok, lets continue.

    //if length is 8 characters or more, increase strength value
    if (password.length > 7) strength += 1

    //if password contains both lower and uppercase characters, increase strength value
    if (password.match(/([a-z].*[A-Z])|([A-Z].*[a-z])/))  strength += 1

    //if it has numbers and characters, increase strength value
    if (password.match(/([a-zA-Z])/) && password.match(/([0-9])/))  strength += 1 

    //if it has one special character, increase strength value
    if (password.match(/([!,%,&,@,#,$,^,*,?,_,~])/))  strength += 1

    //if it has two special characters, increase strength value
    if (password.match(/(.*[!,%,&,@,#,$,^,*,?,_,~].*[!,%,&,@,#,$,^,*,?,_,~])/)) strength += 1

    //now we have calculated strength value, we can return messages

    //if value is less than 2
    if (password.length < 3) { 
      $('#result').removeClass();
      $('#result').addClass('short');
      $('#result').html('Too short');   
      this.disableContinueBtn();
    }else if (strength < 2 ) {
      $('#result').removeClass();
      $('#result').addClass('weak');
      $('#result').html('Weak');  
      this.disableContinueBtn(); 
    } else if (strength == 2 ) {
      $('#result').removeClass()
      $('#result').addClass('good')
      $('#result').html('Medium');   
      this.enableContinueBtn(); 
    } else {
      $('#result').removeClass()
      $('#result').addClass('strong')
      $('#result').html('Strong'); 
      this.enableContinueBtn(); 
    }
  },	

  cancel:function(){
  	document.location.href = '/PMLPublisher/welcome'; 
  },

	remove:function(){
		this.$el.hide();
	},

	show:function(){
		this.$el.show();
	},

  checkTheChkBx:function(){
  //  $("#chkmark").style.visibility="visible";
    $("#uncheckChkbx").css('visibility','visible');
  },

  uncheckTheChkBx:function(){
   // $("#chkmark").style.visibility="hidden";
    $("#uncheckChkbx").css('visibility','hidden');
  },

  confirmPasswd:function(){
     this.disableContinueBtn();
  	 var self = this;
     var password = $(this.pwdTxt).val();
     var confirmPassword = $(this.confirmPwdTxt).val();

    console.log(confirmPassword+"::"+password)

        if (password != confirmPassword) { 
          $("#confirmation").html("Password doesn't match !");
          $("#confirmation").css('color','red');
          conf_password.focus();
          self.enableContinueBtn();
          $(this.confirmPwdTxt).val('');
          return false; 
        }else if(password===confirmPassword){
           $("#confirmation").html("Password match !");
           this.resetPwd();
        } 	
  },

  resetPwd:function(){
    console.log("submitting reset pwd");
      var self = this;
      var data = { 
              username:this.urlParams.username, 
              password:$('#conf_password').val()
             };

        jQuery.ajax({
          url: constants.userMgmntURL+'resetpwd',
          type: "POST",
          data:JSON.stringify(data) ,
          dataType: "json",
          contentType: "application/json",
          success: function(result) {
           console.log("success");
           if(result===true){
            document.location.href = '/PMLPublisher/welcome'; 
           }
          },
          error:function(error){
            console.log("errr");
          }
         });
      return false;
  },

  disableContinueBtn:function(){
    $(this.sendBtnId).attr("disabled", "disabled");
    $(this.sendBtnId).addClass("disabled-send");
  },

  enableContinueBtn:function(){
    $(this.sendBtnId).removeAttr('disabled');
    $(this.sendBtnId).removeClass('disabled-send');
  }

});

new ResetPwdView();

});

