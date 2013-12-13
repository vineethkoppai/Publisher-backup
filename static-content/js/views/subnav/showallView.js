define(
['jquery', 
'underscore', 
'backbone' ,
'constants' , 
'text!templates/subnav/showallTemplate.html' , 
'models/subnav/showallModel'],

function(
$,
_ ,
Backbone ,
constants ,
showallTemplate ,
showallCount) {



var ShowallView = Backbone.View.extend({
  el:'#showAllDrop',
  template:showallTemplate,

  events:{
    'click .th-list':'highlightList',
    'click #hrefAll':'routeAll',
    'click #hrefBookmarked':'routeBookmarked',
    'click #hrefOwnedbyme':'routeOwnedByMe',
    'click #hrefDla':'routeDla',
    'click #hrefPlaylist':'routePlaylist',
    'click #hrefTeacherplan':'routeTeacherplan',
    'click #hrefDraft':'routeDraft',
    'click #hrefREADY_FOR_REVIEW':'routeREADY_FOR_REVIEW',
    'click #hrefREADY_TO_PUBLISH':'routeREADY_TO_PUBLISH',
    'click #hrefPublished':'routePublished',
    'click #hrefError':'routeError',
    'click #hrefUnpublishedDisqualified':'routeUnpublishedDisqualified'
  },

  initialize:function(){
   this.fetchShowAllCount();
  },

  render: function() {
    var templ = _.template(this.template);
    //var compiledTemplate = _.template( SubNavTemplate );
    var model = this.model.toJSON();
    this.$el.html(templ(model));  
    this.highlightOnShow();  
    //return this;
  },

   fetchShowAllCount:function(option){
    var self = this;
    this.model = new showallCount();
    this.model.fetch().complete(function(){
      self.render();
    });
   
   },

   //HIGHLIGHT SHOW ALL LIST ITEM WHILE CLICKING 
   highlightList:function(e){
      $('.th-list').removeClass('selected');
      $(e.currentTarget).addClass('selected');
   },

   highlightOnShow:function(){
      var filter=window.location.href.substring(window.location.href.lastIndexOf('/')+1);
      $('.th-list').removeClass('selected');
      $('.th-list[name="'+filter+'"]').addClass('selected');
   },

   route:function(route){
    var url =window.location.href;
    s = url.substring(url.lastIndexOf('#') + 2,url.lastIndexOf('/'));
    if(s == 'list' || s == 'grid') 
    this.goTo("//"+s+"/"+route);
    else
      this.goTo("//"+route);
   },

   routeAll:function(){
      this.route('all');
   },

    routeBookmarked:function(){
      this.route('bookmarked');
   },

    routeOwnedByMe:function(){
       this.route('ownedbyme');
   },

    routeDla:function(){
       this.route('dla');
   },

    routePlaylist:function(){
       this.route('playlist');
   },

    routeTeacherplan:function(){
       this.route('teacherplan');
   },

    routeDraft:function(){
       this.route('draft');
   },

    routeREADY_FOR_REVIEW:function(){
       this.route('READY_FOR_REVIEW');
   },

    routeREADY_TO_PUBLISH:function(){
       this.route('READY_TO_PUBLISH');
   },

   routePublished:function(){
     this.route('published');
   },

   routeUnpublishedDisqualified:function(){
     this.route('UNPUBLISHED_DISQUALIFIED');
   },

   routeError:function(){
     this.route('error');
   },

  //to remove sub nav bar
  hide:function(){
    this.$el.hide();
  } ,

  show:function(){
   // this.render();
    this.$el.show();
    this.highlightOnShow(); 
    
  }
 
});

return ShowallView;

});