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

var ForgotPwdView = Backbone.View.extend({
	el:'#forgotPwd',

    events:{
		'click #forgot_cancel':'cancelForgot' ,
		'click #forgot_send'  :'checkUserPresence',
		'keyup'               :'triggerClickOnSend'
    },

    initialize:function(){
          Placeholders.init();
    },
    
    cancelForgot:function(){
      this.trigger('cancel');
    },

    checkUserPresence:function(){
      var self = this; 
      this.disableSendBtn();  
      var len = $.trim($('#forgot-email').val()).length;
      if(len<3){
        this.showError("Please enter a valid mail id");
        self.enableSendBtn();
        return false;
      }else{
        var data = { username:$('#forgot-email').val()};
        jQuery.ajax({
            url: constants.userMgmntURL+'isUserExists',
            type: "post",
            data:JSON.stringify(data) ,
            dataType: "json",
            contentType: "application/json",
            success: function(result) {
               if(result===false){
                 self.showError('This email is not in our database');
                 self.enableSendBtn();
               }                    
               else{
                 self.hideError();
                 self.sendEmail();           
               }
            },
            error:function(error){
              return false;
            }
        });
      }
    },

    sendEmail:function(){    
        var self = this;        
        var data = { username:$('#forgot-email').val()};
        jQuery.ajax({
          url: constants.userMgmntURL+'forgotpwdmail',
          type: "POST",
          data:JSON.stringify(data) ,
          dataType: "json",
          contentType: "application/json",
          success: function(result) {
           self.showSuccessMsg();
           self.enableSendBtn();
          },
          error:function(error){
          }
         });    
    },

    remove:function(){
		    this.$el.hide();
	  },

	show:function(){
    $("#forgot-email").val('');
    Placeholders.init();
		this.$el.show();
    
	},

  showError:function(msg){
    $('#result').addClass('noEmailExists');
    $('#result').html('<span id="makeRed">'+msg+'<span> <a href="#" id="contactUs">Contact us</a>.');
  },

  hideError:function(){
    $('#result').removeClass('noEmailExists');
    $('#result').html('');
  },

  showSuccessMsg:function(){
    $('#result').addClass('emailSent');
    $('#result').html('An email has been sent to you');
  },
  hideSuccessMsg:function(){
    $('#result').removeClass('emailSent');
    $('#result').html('');
  },

disableSendBtn:function(){
    $("#forgot_send").attr("disabled", "disabled");
    $("#forgot_send").addClass("removeImg");
    $("#forgot_send").addClass("disabled-send");
  },

  enableSendBtn:function(){
    $("#forgot_send").removeAttr('disabled');
    $("#forgot_send").removeClass("removeImg");
     $("#forgot_send").removeClass("disabled-send");
  },

  triggerClickOnSend:function(e){
    if(e.which == 13)
      $('#forgot_send').trigger("click");
  }

});// end of forgot pwd view

return ForgotPwdView;

});