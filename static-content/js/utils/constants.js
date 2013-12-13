 //file to keep all URL and other constants

define(
['jquery',
'underscore',
'backbone'
],

function(
$,
 _ ,
Backbone 
) {


	var constants = {

		userId:$('#userid').val(),
		username:$('#user-disp').text(),
		userRole:$('#userrole').val(),

		profileList:'list',

		//status for content
		draft:'DRAFT',
		readyToReview:'READY_FOR_REVIEW',
		readyToPublish:'READY_TO_PUBLISH',
		publish:'PUBLISHED',
		unpublishedDisqualified:'UNPUBLISHED_DISQUALIFIED',
		error:'ERROR',
		edited:'Edited',

		//subjects
		ela:'LANGUAG', 
		math:'MATH',

		//type
		dla:'DLA',
		ownedByMe:'owned by me',
		bookmarked:'bookmarked',
		Bookmarked:'Bookmarked', // for history table(moreInfo.html)
		dla:'DLA',
		teacherPlan:'TEACHER_PLAN',
		playlist:'PLAYLIST',

		//META ATTRIBUTES
		sourceSite:"source-site",
		thumbnailURL:"thumbnailURL",
		minGrade:"min-grade",
		maxGrade:"max-grade",
		activity:"activity",
		difficulty:"difficulty",
		language:"language",
		restrictions:"restrictions",
		plugin:"plugin",
		audioSupport:"audio-support",
		acctRequired:"acct-required",
		multiPlayer:'multi-player',
		ipadRequired:'ipad-required',
		subject:"subject",
		subtopic:"subtopic",
		teachesContent:"teaches-content",
		blooms:"Blooms",
		whatStudentsDo:"what-students-do",
		whatStudentsLearn:"teacher-notes",
		comments:"comments",
		feedback:"feedback",

		filterStatus:"filter-status",
		filterContentType:"filter-content-type",
		filterOwnedByme:"filter-author-id",
		filterBookmarked:"filter-bookmarked",
		filterUrl:"filter-url",

		sort:"sort-by",
		sortByDate:"created-Time",
		sortByTitle:"title",
		sortByStatus:"status",
		sortByContent:"content-type",
		sortByAuthor:"author-name",
		sortBysubject:"subject",
		sortBySubtopic:"subtopic",
		sortByGrade:"grade",

		searchKeyword:"search-keyword",
		searchSourcesite:"search-source-site",
		searchTitle:"search-title",
		searchDesc:"search-description",
		searchStandaed:"search-standard",
		searchAuthor:"search-author-name",

		author:'author',
		admin:'admin',

		//
		english:'LANGUAG',
		math:'MATH',

		//validations for image
		thumbnailHeight:80,
		thumbnailWidth:140,

		availableTags:["title:", "description:", "source-site:", "keywords:", "standard:","author:"],

		// to add/delete user
		user:'/contentrepository/api/cms/user/', 
		userRoles:'/contentrepository/api/cms/role',
		userMgmntURL:'/contentrepository/api/cms/',
		//to create content
		contentRepositoryURL:'/contentrepository/api/cms/content/',
		// data for create DLA form
		contentPropertiesURL:"/contentrepository/api/cms/metadata?type=DLA",
		//to get all DLA
		getConetnts:"/contentrepository/api/cms/content/search?profile=combined&",
		//GET SINGLE DLA
		getConetnt:"/contentrepository/api/cms/content/",
		//to get the tree 
		getTaxonomy:'/contentrepository/api/cms/taxonomy/',

	//	getNodes:'/contentrepository/api/cms//taxonomy/nodes/',

		getSubtopics:'/contentrepository/api/cms/subject/',

		moreInfo:'/contentrepository/api/cms/content/',

		getUsername:'/contentrepository/api/cms/user/?user-ids=',

		keywordSearch:'/contentrepository/api/cms/content?search=',

		bookmark:'/contentrepository/api/cms/bookmark',

		showAllCounturl:'/contentrepository/api/cms/content/filterDetails',

		serachTaxonomy:'/solr/cfycr/select?',

		searchTaxonomyEndurl:"&sort=path+asc&rows=10000&fl=node_type%2Cid%2Cname%2Cdescription%2Cpath&wt=json&indent=true&hl=true&hl.fl=name%2Cdescription&hl.simple.pre=<em>&hl.simple.post=<%2Fem>&hl.fragsize=0",

		imageUpload:'/contentrepository/api/cms/content/thumbnail',

		uniqueURL:'/contentrepository/api/cms/content/search?filter-url=',

		uniqueTitle:'/contentrepository/api/cms/content/search?profile=combined&search-title=',

		changeState:"/contentrepository/api/cms/content/",

		bulkupload:'/contentrepository/api/cms/content/bulk-upload/',
		
		sourceSites:'/contentrepository/api/cms/metadata/source-site',

		masterReport:'/contentrepository/api/cms/content/report',

		//ERROR MESSAGES
		errorOnDelete:"Author can only delete DLAs created by him which is in draft mode",

		//
		 eventbus:_.extend({}, Backbone.Events)



	}

	return constants;


	

});//file end

