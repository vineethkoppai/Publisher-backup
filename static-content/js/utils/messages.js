 
define(
['constants'
],

function(
constants
) {


	var messages = {

		all:'All',
		draft:'Draft',
		READY_FOR_REVIEW:'Ready to Review',
		READY_TO_PUBLISH:'Ready to Publish',
		published:'Published',
		error:'Error',
		ownedbyme:'Owned by Me',
		bookmarked:'Bookmarked',
		dla:'DLAs',
		teacherplan:'Teachers Plan',
		playlist:'Playlist',
		UNPUBLISHED_DISQUALIFIED:'Unpublished/Disqualified',
		
		iesettingMsg:'Unable to access local files due to browser security settings. ' + 
             'To overcome this, go to Tools->Internet Options->Security->Custom Level. ' + 
             'Find the setting for "Initialize and script ActiveX controls not marked as safe" and change it to "Enable" or "Prompt"',
        activexNotFound:'This feature is available for IE 10 or higher versions of IE',
        noFile:'Please select a file',
        bulkuploadSuccess:'Bulkupload is complete , please check your input sheet for the results',
        fileSettings:'Unable to access local file path due to browser security settings. ' + 
             'To overcome this, go to Tools->Internet Options->Security->Custom Level. ' + 
             'Find the setting for "Include local directory path when uploading files to server" and change it to "Enable"',
             invalidFile:"Invalid file, please make sure that column names are valid",
        fileAlreadyopen:'The file you have used is open, please close it and upload',

        incorrectFile:'Please upload excel file',
        uploadLimitError:'No of records are exceeding 200',
        thumbnailImgSizeInvalid:'please upload 140x80 size image'



	}

	return messages;	

});//file end

