define([
'views/createDLA/classification',
'util/formMetadata',
'models/createDLAForm',
'jqueryfacebookalert'],

function(
View,
formMetadata,
Model) {

describe("VIEW -- Classification", function() {  

  
	beforeEach(function() {     
		var self = this;     	
     	this.model = new Model();
     	this.model.parse(formMetadata);
     	this.view = new View({ el:$('#sandbox'), model:this.model.toJSON() }); 
     	
     	waitsFor(function() {
	      return this.view;
	    }, "could not get the view", 750);  		

	});     

	afterEach(function() {
		delete this.view;
	    $('#sandbox').html('');
	});  

	it('User can add new subject and delete it', function(){
		 this.$subjectSpan =  $('span#subject_span');
		 this.$addAnotherSubject = $('#btn_anotherSubject');
		 //CLICK ON SUBJECT
		 this.$subjectSpan.click();
		 //SELECT A SUBJECT
		 this.$subjectSpan.next().find('li:first').click();
		 //ADD ANOTHER SUBJECT
		 this.$addAnotherSubject.click();
		 //CHECK IF NEW SUBJECT DIV IS ADDED
		 expect($('#addSubjectDiv').find('div').length).toBeGreaterThan(0);		 
		 //CLICK ON DELETE SUBJECT BUTTON
		 $('.sub_red_icon').click();
		 //CONFIRM DELETE
		 $('div#popup_panel').find('input#popup_ok').click();
		 //CHECK IF ITS DLETED FROM DOM
		 expect($('#addSubjectDiv').find('div').length).toBe(0);	
	  })

});



});