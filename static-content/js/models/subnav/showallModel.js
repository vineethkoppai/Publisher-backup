define(
['jquery',
'underscore',
'backbone',
'constants'],

function(
$,
_,
Backbone,
constants) {

var ShowallCount = Backbone.Model.extend({

  defaults: {
  all:0,
  dla: 0,
  teacherPlan: 0,
  playlist: 0,
  draft: 0,
  readyToPublish: 0,
  readyToReview: 0,
  published: 0,
  ownedByMe: 0,
  bookmarked: 0,
  error:0,
  unpublishedDisqualified:0
},

 url:constants.showAllCounturl,

 parse:function(response){
 	var all = 0;
 	if(response[constants.dla]){
 		all = all + response[constants.dla];
 		this.set('dla',response[constants.dla]);
 	} 		

 	 if(response[constants.playlist]){
 	 	all = all + response[constants.playlist];
 	 	this.set('playlist',response[constants.playlist]);
 	 }    	

 	if(response[constants.teacherPlan]){
 		all = all + response[constants.teacherPlan];
 		this.set('teacherPlan', response[constants.teacherPlan] );
 	}    	

    if(response[constants.draft])
    	this.set('draft',response[constants.draft]);

    if(response[constants.readyToPublish])
    	this.set('readyToPublish', response[constants.readyToPublish]);

    if(response[constants.readyToReview])
    	this.set('readyToReview',response[constants.readyToReview]);

    if(response[constants.publish])
    	this.set('published',response[constants.publish]);

    if(response[constants.ownedByMe])
    	this.set('ownedByMe',response[constants.ownedByMe]);

    if(response[constants.bookmarked])
    	this.set('bookmarked',response[constants.bookmarked]);
   
    if(response[constants.error]){
      this.set('error',response[constants.error]);
    }

    if(response[constants.unpublishedDisqualified]){
      this.set('unpublishedDisqualified',response[constants.unpublishedDisqualified]);
    }
    	

    this.set('all',all);

   return response;
 }


});
return ShowallCount;
});

		

// {
//   "DLA": 187,
//   "Teacher Plan": 33,
//   "Published": 40,
//   "Draft": 135,
//   "Playlist": 30,
//   "Ready To Publish": 32,
//   "Ready To Review": 43,
//   "owned by me": 243,
//   "bookmarked": 22
// }