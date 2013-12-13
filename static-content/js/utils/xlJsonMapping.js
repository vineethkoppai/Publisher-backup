 //ps - inavliD VALUE IS FOR FIELDS PRESENT IN DOWNLOADED REPORT BUT NOT REQUIRED FOR BULK UPLOAD
define(
['constants'
],

function(
constants
) {


	var Mapping = {

		name:'name',
		description:'description',
		url:'url',
		state:'state',
		'tag-list':'tag-list',
		'taxonomy-node-list':'taxonomy-node-list',
		'activity-list':'activity-list',
		 difficulty:'difficulty',
		 blooms:'blooms',
		'language-list':'language-list',
		'restrictions-list':'restrictions-list',
		'plugin-list':'plugin-list',
		'audio-support':'audio-support',
		'multi-player':'multi-player',
		'teaches-content':'teaches-content',
		'thumbnailurl':'thumbnailURL',
		'min-grade':'min-grade',
		'max-grade':'max-grade',
		'teacher-notes-list':'teacher-notes-list',
		'comments-list':'comments-list',
		'what-students-do':'what-students-do',
		'subject-mapping-list':'subject-mapping-list',
		'source-type':'source-type',
		'source-id':'source-id',
		'source-site':'source-site',
		'feedback-list':'feedback-list',
		 id:'invalid',  
		'created-date':'invalid',
		'modified-date':'invalid',
		'author':'invalid'
	}

	return Mapping;	

});//file end

