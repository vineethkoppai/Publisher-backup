define(
[
'views/page',
'constants'
],

function( 
PageView ,
constants
) {


Router = Backbone.Router.extend({

    routes: {
        "": "home",
        "createdla": "showCreateDlaForm",
        'grid/:filterValue':'showGridview',
        'list/:filterValue':'showListview',
        'editdla/:id':'editDLA'
    },

    initialize: function () {
       this.app =new PageView();      
    },

    home: function () {
        this.app.showHome();
    },

    showCreateDlaForm: function () {
        this.app.showAddDLA();
    },

    showGridview:function(filterValue){
        if(filterValue=='home'){
          this.app.resetToDefault();
          this.app.showHome();
        }else
          this.app.loadGridView(filterValue);
    },

    showListview:function(filterValue){
        if(filterValue=='home'){
          delete this.app.route;
          this.app.clearSearchbox();
          this.app.showHome();
        }else
        this.app.loadListView(filterValue);
    },

    editDLA:function(){
        this.app.showEditDLA();
    }
    
})

return Router;

});

