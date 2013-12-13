define([
'views/createDLA/teachersEvaluation',
'util/formMetadata',
'models/createDLAForm',
'dropdown'
],

function(
View,
formMetadata,
Model,
dropdown
) {

describe("VIEW --teacher evaluation under create dla form", function() {  
    //STORE THE DATA FROM AJAX CALL IN A FILE formMetadata.JS
    //USE THIS DATA TO FORM THE MODEL AND RENDER THE VIEW FOR TESTING

     beforeEach(function() {
     	var self = this;
     	this.$feedBack = $('#slct_feedback');
     	this.model = new Model();
     	this.model.parse(formMetadata);
     	this.view = new View({ el:$('#sandbox'), model:this.model.toJSON() }); 
     	
     	waitsFor(function() {
	      return this.view;
	     }, "could not get the view", 750);  

	    this.feedbackOptions = [
                        "None",
                        "Gives hints",
                        "Marks right or wrong",
                        "Gives score",
                        "Gives explanations",
                        "Includes quiz"
        ];

		this.metadata = [{
				"name": "feedback",
				"value-list": [
					"Gives hints",
					"Marks right or wrong"
				],
				"attribute-description-id": 63
		}]

	 });     

	  afterEach(function() {
	   delete this.view;
	   $('#sandbox').html('');
	  }); 

    it('The feedback div should be present', function(){
     	expect(this.view.$el.has('div#slct_feedback').length).toBe(1);
  	}) 

  	it('The feedback dropdown should have expected options and in order', function(){
  		var self = this;
    	this.view.$el.find('div#slct_feedback ul li').each(function(i){
    		 expect($(this).text().trim()).toBe(self.feedbackOptions[i]);
    	})
  	})  

  	it('none should be default in feedback dropdown', function(){
  		this.view.setDefaults();
  		expect(this.view.$el.find('div#slct_feedback ul li.selected').text().trim()).toBe('None');
  	})

  	it('Clicked option should be selecetd', function(){ 
  		this.view.$el.find('div#slct_feedback ul li').eq(2).click();
  		expect(this.view.$el.find('div#slct_feedback ul li').eq(2).hasClass('selected')).toBe(true);
  	})	

  	it('Clicked options should come to span div', function(){ 
  		this.view.$el.find('div#slct_feedback ul li').eq(1).click();
  		this.view.$el.find('div#slct_feedback ul li').eq(2).click();
  		expect(this.view.$el.find('div#slct_feedback span').text().trim()).toBe(this.feedbackOptions[1]+','+this.feedbackOptions[2]);
  	})

  	it('When none is clciked , it should deselect other options', function(){ 
  		this.view.$el.find('div#slct_feedback ul li').eq(1).click();
  		this.view.$el.find('div#slct_feedback ul li').eq(2).click();
  		//CLICK NONE
  		this.view.$el.find('div#slct_feedback ul li').eq(0).click();
  		expect(this.view.$el.find('div#slct_feedback span').text().trim()).toBe(this.feedbackOptions[0]);
  	})

  	it('Feedback option should have metadata values sent on edit mode', function(){ 
  		this.view.setValues(this.metadata);
  		expect(this.view.$el.find('div#slct_feedback span').text().trim()).toBe(this.metadata[0]['value-list'].join(','));
  	})

  	it('User should be able to deselect the option in edit mode', function(){  
  		this.view.setValues(this.metadata);
  		this.view.$el.find('div#slct_feedback ul li.selected').click();
  		expect(this.view.$el.find('div#slct_feedback span').text().trim()).toBe('Select');
  	})

  		


});



});