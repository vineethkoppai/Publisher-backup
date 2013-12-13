define([
'jquery',
'underscore',
'backbone' ,
'views/pageHeader' ,
'views/subnav/subnavView' ,
'views/grid/gridView' ,
'views/list/listView' ,
'views/loadingIconView',
'models/dla' ,
'views/addUsers',
'views/createDLA/createDLA',
'views/editDLA/editDLA',
'models/user',
'collections/dlaCollection',
'constants' ],

function(
$,
_, 
Backbone,
PageHeader ,
SubNavView ,
GridView ,
ListView ,
LoadingView ,
DLAModel ,
addUsersView,
CreateDLAView,
EditDLA,
UserModel,
DLACollection,
constants) {

var PageView = Backbone.View.extend({

el:'body',

initialize:function(){
  var self=this;
  var uname = $('#username').val();
  var role = $('#userrole').val();
  this.subNav = new SubNavView({model:new Backbone.Model()});
  //PASS SUBNAV MODEL TO COLLECTION SO WE CAN SHOW SEARCH COUNT IN SUBNAV
  this.collection = new DLACollection({subnavModel:this.subNav.model});
  //ON ENTER OF SEARCH KEY LET THE PAGE VIEW KNOW THE EVENT
  this.subNav.on('search',this.search, this);
  this.user = new UserModel({ username:uname , role:role});
  this.header = new PageHeader({model: this.user}); 
  //EVENT FROM HEADEER WHEN USER WANTS TO ADD USER 
  this.header.on('renderAddUsers', this.addUsers , this);
 
  this.gridview = new GridView({collection:this.collection});
  this.listView = new ListView({collection:this.collection});
  //EVENT WHEN MODEL CHANGED/ADDED FROM EDIT/CREATE VIEW
  constants.eventbus.on('collectionChange', this.modifyCollection, this);
   _.bindAll(this);
  this.hidePageload();
},

showHome:function(){
  //GRID WITH ALL FILTER IS THE HOME PAGE
  if(!this.route )
   this.goTo("#/grid/all");
  else
     this.goTo(this.route);
},

getheight:function(){
    var D = document;
    return Math.max(
        Math.max(D.body.scrollHeight, D.documentElement.scrollHeight),
        Math.max(D.body.offsetHeight, D.documentElement.offsetHeight),
        Math.max(D.body.clientHeight, D.documentElement.clientHeight)
    );
},

addUsers:function(){
  this.popup = new addUsersView();
  this.popup.showAddUsers();
},

loadListView:function(filterValue){
  this.hideOtherViews();     
  this.listView.show();
  this.filterView(filterValue);
  this.subNav.show();
},

loadGridView:function(filterValue){  
  this.hideOtherViews();
  this.subNav.show();
  this.gridview.show();
  this.filterView(filterValue);
},

 
showAddDLA:function(){ 
  var self = this;
  this.hideOtherViews();

  if(!this.createDLAView){
    this.createDLAView = new CreateDLAView({
      onComplete:function(){
        self.createDLAView.show();
      }
    });
  }else{
    this.createDLAView.show();
  }

},

// set the height of gridview div
setHeight:function(){
var headerHeight = ( $('#pageHeader').height() + $('#subNavBar').height() + 10);
this.gridview.setHeight(this.getheight() - headerHeight);
},

// function to show edit DLA view
showEditDLA:function(){
  var self = this;
  this.hideOtherViews();

  if(!this.editDLA){
    if(!this.createDLAView){
      this.createDLAView = new CreateDLAView({
        onComplete:function(){
          self.editDLA = new EditDLA({ createDLAForm:self.createDLAView, user:self.user }); 
          self.editDLA.show();
        }
      }); 
    }else{
      this.editDLA = new EditDLA({ createDLAForm:this.createDLAView, user:this.user });
      this.editDLA.show();
    }         
   }else{
      this.editDLA.show();
   }  
}, 

  clearSearchbox:function(){
    $('#search').val('');
  },

  search:function(val){
    if(!this.searchValue || this.searchValue !=val){
      this.searchValue = val;
      this.collection.filterAndSearch(this.filterVal, this.searchValue);
    }    
  },

  filterView:function(filterValue){
     var input = $.trim($('#search').val());   
     var result = false, val = '';
     for(var i=0;i<constants.availableTags.length;i++){
          val=input.substr(0,input.indexOf(':'))+':';
          if(val && val==constants.availableTags[i])
              result=true;                            
      }
      if(!result)
          input = 'title:'+input;         

       
    if(!this.filterVal || this.filterVal !=filterValue || this.searchValue != input){
      this.filterVal = filterValue;
      this.searchValue = input;
      this.collection.filterAndSearch(this.filterVal, this.searchValue);
      this.collection.isUptodate = true;
    }else if(this.collection.isUptodate === false){
      this.collection.fetch();
      this.collection.isUptodate = true;
    } 
  //SAVE ROTE IN MEMEORY FOR FUTURE USE
  this.route = window.location.hash;
  },
  
  //METHOD TO SET SOME PROPERTIES FOR COLLCTION WHEN ITS NOT UPTODATE SO WE CAN REFETCH
  modifyCollection:function(){
     console.log("modify colledction");
     this.collection.isUptodate = false;
     this.collection.pageIndex = 0;
     if(this.collection.length > 0){
       this.collection.each(function(dla) {
           dla.trigger('remove');
      });
      this.collection.reset(undefined,{silent:true});
    }    
  },

   hideOtherViews:function(){
    if(this.subNav)
    this.subNav.hide();

    if(this.gridview)
    this.gridview.hide();

    if(this.listView)
      this.listView.hide();

    if(this.createDLAView)
      this.createDLAView.hide();  
    
    if(this.editDLA)
       this.editDLA.hide();
  },

  //METHOD WHEN HOME LOGO IS CLICKED
  resetToDefault:function(){
    $('#search').val('');
    delete this.route;
    delete this.filterVal;
    this.listView.resetToDefault();
    this.collection.resetToDefault();
  },

  //TO HIDE PAGE LOADER GIF AFTER LOADING IS COMPLETED
  hidePageload:function(){
     $('body').css('background-image','none');
  }

});

return PageView;

});


