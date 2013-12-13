define(

['jquery',
'underscore',
'backbone' ,
'text!templates/removeUser.html' 
],
function(
$,
 _  ,
Backbone ,
removeUserTemplate){

var removeUserView = Backbone.View.extend({
     el:'body',
     
     template:_.template( removeUserTemplate ),
     
     events:{
          'click #delete_btn':'deleteUser'
     },
     
     initialize:function(){
          this.render();
     },
     
     render:function(){
        this.$('#removeUserDiv').html(this.template(this.model.toJSON()));
        this.showFacebox();
     },
     
     showFacebox:function(){
      $.facebox({
            div: '#removeUserDiv',
            loadingImage : '../imgs/loading.gif',
            closeImage   : '../imgs/closelabel.png'
        });
    },
    
     deleteUser:function(){
         // $('#removeUserDiv').trigger('close.facebox') ;
    	 
           this.$('#addedUserMainDiv').remove();
         $.facebox.close('#addedUserMainDiv');
   }
   
});

return removeUserView;

});