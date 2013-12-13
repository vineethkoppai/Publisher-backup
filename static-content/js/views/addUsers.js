define(
['jquery',
'underscore',
'backbone' ,
'text!templates/addUsers.html',
'text!templates/addedUser.html',
'views/removeUser',
'models/user',
'constants',
'views/spinner',
'jqueryfacebookalert'
],

function(
$,
 _  ,
Backbone ,
addUsersTemplate,
userTemplate,
RemoveUser,
userModel,
constants,
Spinner) {

// model for added user
// var userModel = Backbone.Model.extend({
//   defaults: {
//     id:null,
//     username: '',
//     role:'',
//   },

// urlRoot:constants.userMgmntURL+'user',


// });
//view for added user
var userView  = Backbone.View.extend({
  
  tagName: "li",
  id:"lii",
  events:{
      'mouseover #addedUserMainDiv':'showDeleteIcon',
      'click #iconDeleteUser':'deleteUser',
      'mouseout #addedUserMainDiv':'hideDeleteIcon',
      'keyup':'loadUrl'

    },
  template:_.template( userTemplate ),

  render: function() {
    this.$el.html(this.template(this.model.toJSON()));
    return this;
  },

   deleteUser:function(){
     this.$('body').css('background-color','red');
     var self = this;
     jConfirm('Are you sure you want to remove <span style="color:#FB4947;"> '+this.model.get('username')+'</span> as a user?', 'Confirmation Dialog', 
          function(r) {
        if(r==true)
        {
          self.trigger('deleteUser',self);
        }
        });
   },
   showDeleteIcon:function(){
      this.$('.deleteUser').show();
   },
   
   hideDeleteIcon:function(){
      this.$('.deleteUser').hide();
   },
   loadUrl:function(){
      if(e.keyCode == 27){
        constants.eventbus.trigger('addIframeback');
        history.back();
        this.undelegateEvents();
      }
   }

});
// collection for added users
var UserList = Backbone.Collection.extend({
    model:userModel
   // url:'http://localhost:8080/PMLPublisher/rest-services/user-services/createNewUser',
});

var addUsersView = Backbone.View.extend({
    el:'body',
    template:_.template( addUsersTemplate ),

    events: {
       'click #add' : 'getUser',
       'click #done': 'closeBox',
       'keyup'      : 'goBack'
    },

    initialize: function() {
        this.render();
        
        var thisView = this;
        this.userlist = new UserList;
       this.userlist.bind('add',this.renderEachUser, this);
       this.getUserRoles();
    },

    getUser: function() {
        if(!this.spinner)
          this.spinner = new Spinner({el:$('#facebox #userLoadingImg')});
        this.spinner.show();
        
        var user_name = $('#facebox #inputEmail').val();
        var user_role = $('#facebox #user-role').val();
        // $('#facebox #user-role').val('Select');
        
       // $("#facebox #user-role option:first").attr('selected','selected');

        if(user_name==""){
          this.userNameError(true);
        }
        if(user_role == ""){
          this.userRoleError(true);
        }
        else if($.trim(user_name).length>0 && this.validateEmail(user_name) && $.trim(user_role).length>0 ){
           this.userNameError(false); 
           this.userRoleError(false);          
           this.user = new userModel({username:user_name,role:user_role});
           //this.userlist.add( this.user );
           var self =this;
           this.user.save({}, {
               success:function(response, model){
                $('#facebox #inputEmail').val('');
                $("#facebox #user-role option:first").attr('selected','selected');
                self.user.set('id',model.response.user.id);                
                self.userlist.add(self.user);
                self.spinner.hide();
               },
               error:function(){
                self.userNameError(true); 
               }
           });// end of save model
           //this.userlist.create( {username: user_name,role:user_role} );
          // this.userlist.add( {username: user_name,role:user_role} );
//           this.userlist.add({role:user_role});
        }


    },

    render: function() {
        constants.eventbus.trigger('removeIframe');
        this.$('#addUsersDiv').html(this.template);
        this.showAddUsers();
    },

    renderEachUser: function( user ) {
        this.u = new userView({model: user});
        this.u.on('deleteUser', this.deleteUser );
        this.$("#facebox #user-list").append(this.u.render().el);
        
    },

    showAddUsers:function(){
      //to avoid closing facebox when user clicks on the screen 
      $.extend($.facebox.settings, { modal : true });
      $(document).bind('loading.facebox', function() {
          $("#facebox_overlay").unbind("click").click(function(){
             if (!$.facebox.settings.modal) {
               $(document).trigger('close.facebox');
             }
          })
      })
      
      $.facebox({
            div: '#addUsersDiv',
            loadingImage : '../imgs/loading.gif',
            closeImage   : '../imgs/closelabel.png'
        });
      $('.content').addClass("centerFacebox");
    },
    closeBox:function(){
      $('#addUsersDiv').trigger('close.facebox') ;
      // history.back();
      this.undelegateEvents();
      constants.eventbus.trigger('addIframeback');
    },
    
    goBack:function(e){

      if(e.keyCode == 27){
        constants.eventbus.trigger('addIframeback');
        // history.back();
        this.undelegateEvents();
      }

      if(e.keyCode == 13){

        $("#add").trigger("click");
      }
    },
    
    deleteUser:function(){
      this.model.destroy();
      this.$el.remove();
    },
    
    //function to validate the email entered
    validateEmail:function(elementValue){        
    var emailPattern = /^[a-zA-Z0-9._]+[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[a-zA-Z]{2,4}$/; 
      if(!emailPattern.test(elementValue)){
        this.spinner.hide();
        this.userNameError(true);
      }
      
    return emailPattern.test(elementValue);   
    },

    getUserRoles:function(){

      $.ajax({
              url: constants.userRoles,
              type: 'get',
              dataType: 'json',
              jsonp: false,
             // jsonpCallback: callback123(),
              success: function(data){
                  data = data.response["role-list"];
                  $.each(data, function(k){
                    //$('#facebox #user-role').append('<option>Author</option>');
                    $('#facebox #user-role').append('<option value="' + data[k].name + '">' + data[k].name + '</option>');
                  });
              },
              error:function(e){
                console.log(e);
              }
      });

    },
   //function to make username text box boarder red
   userNameError:function(error){
    if(error){
     this.spinner.hide(); 
     $('#facebox #inputEmail').css('border', 'solid 1px #FD2626');
    } 
    else
     $('#facebox #inputEmail').css('border', '0px');
   },

   //function to make userrole boarder red
   userRoleError:function(error){
    if(error){
     this.spinner.hide(); 
     $('#facebox #user-role').css('border', 'solid 1px #FD2626');
    } 
    else
     $('#facebox #user-role').css('border', '0px');
   }


});

return addUsersView;
});
