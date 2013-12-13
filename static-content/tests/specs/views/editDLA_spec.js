define([
'views/editDLA/editDLA',
'models/dla',
'views/createDLA/createDLA',
'models/user',
'models/createDLAForm',
'models/sourceSites',
'util/formMetadata',
'util/sourceSitesData',
'util/dlaData',
'constants',
'sinon',
'dropdown',
'text!testTemplates/body.html'
],

function(
View,
Model,
CreateDLAView,
User,
createDLAFormModel,
sourceSitesModel,
formMetadata,
sourceSitesData,
dlaData,
constants,
sinon,
dropdown,
bodyTemplate
) {


describe("VIEW -- EDIT DLA ", function() { 
  
	beforeEach(function() { 
		var self = this; 
		//ATTACH THE CONTAINER SO ALL el WILL BE PRESENT FOR VIEWS
		$('#sandbox').append(bodyTemplate);
		this.server = sinon.fakeServer.create();   	 
		var user = new User({ username:'admin@cfy.com',role:constants.admin});
		this.formModel = new createDLAFormModel();
		this.formModel.parse(formMetadata);
		this.createDLAView = new CreateDLAView();
		this.createDLAView.formModel = this.formModel;
		this.createDLAView.render( {onComplete:function(){
			  self.createDLAView.generalView.sourceSites = new sourceSitesModel(sourceSitesData);
			  self.createDLAView.generalView.render();
		      self.view = new View({ createDLAForm:self.createDLAView, user:user }); 
		    } });
		this.model = new Model(dlaData); // DLA MODEL
		this.deleteBtn 			= '#btn_delete';
        this.cancelBtn 			= '#btn_cancel';
        this.saveBtn 			= '#btn_save';
        this.backToDraftBtn 	= '#btn_backToDraft';
        this.readyToReviewBtn	= '#btn_readyForReview';
        this.readyToPublishBtn 	= '#btn_readyToPuclish';
        this.publishBtn 		= '#btn_publish';
        this.unpublishBtn 		= '#btn_unpublishedDisqualified';

		waitsFor(function() {
			return  this.view && this.createDLAView;
		}, "both create and edit dla shd present", 1500);

	});        

	afterEach(function() {
	  this.view.remove();
	  delete this.view;
	  $('#sandbox').html('');
	});  

	it('in DRFAT mode buttons visible shd be save,cancel,ready for review and delete', function(){
		this.model.set('stage', constants.draft);
		this.view.model = this.model;
		this.view.render();
		expect($(this.backToDraftBtn).is(':visible')).toBe(false);
		expect($(this.cancelBtn).is(':visible')).toBe(true);
		expect($(this.readyToReviewBtn).is(':visible')).toBe(true);
		expect($(this.readyToPublishBtn).is(':visible')).toBe(false);
		expect($(this.publishBtn).is(':visible')).toBe(false);
		expect($(this.unpublishBtn).is(':visible')).toBe(false);
		expect($(this.deleteBtn).is(':visible')).toBe(true);
		expect($(this.saveBtn).is(':visible')).toBe(true);
	})

	it('in READY FOR REVIEW mode buttons visible should be Cancel, Save, Backto dratf, Ready to Publish and unpublish', function(){ 
		this.model.set('stage', constants.readyToReview);
		this.view.model = this.model;
		this.view.render();
		expect($(this.backToDraftBtn).is(':visible')).toBe(true);
		expect($(this.cancelBtn).is(':visible')).toBe(true);
		expect($(this.readyToReviewBtn).is(':visible')).toBe(false);
		expect($(this.readyToPublishBtn).is(':visible')).toBe(true);
		expect($(this.publishBtn).is(':visible')).toBe(false);
		expect($(this.unpublishBtn).is(':visible')).toBe(true);
		expect($(this.deleteBtn).is(':visible')).toBe(false);
		expect($(this.saveBtn).is(':visible')).toBe(true);
	})

	it('In READY TO PUBLISH mode buttons visible should be Save, Cancel, Back To Draft, Publish and Unpublish	', function(){ 
		this.model.set('stage', constants.readyToPublish);
		this.view.model = this.model;
		this.view.render();
		expect($(this.backToDraftBtn).is(':visible')).toBe(true);
		expect($(this.cancelBtn).is(':visible')).toBe(true);
		expect($(this.readyToReviewBtn).is(':visible')).toBe(false);
		expect($(this.readyToPublishBtn).is(':visible')).toBe(false);
		expect($(this.publishBtn).is(':visible')).toBe(true);
		expect($(this.unpublishBtn).is(':visible')).toBe(true);
		expect($(this.deleteBtn).is(':visible')).toBe(false);
		expect($(this.saveBtn).is(':visible')).toBe(true);
	})

	it('In PUBLISH mode buttons visible should be Save, Cancel, Back to Draft, Unpublish', function(){ 
		this.model.set('stage', constants.publish);
		this.view.model = this.model;
		this.view.render();
		expect($(this.backToDraftBtn).is(':visible')).toBe(true);
		expect($(this.cancelBtn).is(':visible')).toBe(true);
		expect($(this.readyToReviewBtn).is(':visible')).toBe(false);
		expect($(this.readyToPublishBtn).is(':visible')).toBe(false);
		expect($(this.publishBtn).is(':visible')).toBe(false);
		expect($(this.unpublishBtn).is(':visible')).toBe(true);
		expect($(this.deleteBtn).is(':visible')).toBe(false);
		expect($(this.saveBtn).is(':visible')).toBe(true);
	})

	it('In unpublished mode buttons visible should be Save, Cancel, Delete, Back To Draft and Publish', function(){ 
		this.model.set('stage', constants.unpublishedDisqualified);
		this.view.model = this.model;
		this.view.render();
		expect($(this.backToDraftBtn).is(':visible')).toBe(true);
		expect($(this.cancelBtn).is(':visible')).toBe(true);
		expect($(this.readyToReviewBtn).is(':visible')).toBe(false);
		expect($(this.readyToPublishBtn).is(':visible')).toBe(false);
		expect($(this.publishBtn).is(':visible')).toBe(true);
		expect($(this.unpublishBtn).is(':visible')).toBe(false);
		expect($(this.deleteBtn).is(':visible')).toBe(true);
		expect($(this.saveBtn).is(':visible')).toBe(true);
	})


	it('In error state dla buttons visible shd be Save, Cancel, Back To Drfat, Publish and Unpublish', function(){ 
		this.model.set('stage', constants.error);
		this.view.model = this.model;
		this.view.render();
		expect($(this.backToDraftBtn).is(':visible')).toBe(true);
		expect($(this.cancelBtn).is(':visible')).toBe(true);
		expect($(this.readyToReviewBtn).is(':visible')).toBe(false);
		expect($(this.readyToPublishBtn).is(':visible')).toBe(false);
		expect($(this.publishBtn).is(':visible')).toBe(true);
		expect($(this.unpublishBtn).is(':visible')).toBe(true);
		expect($(this.deleteBtn).is(':visible')).toBe(false);
		expect($(this.saveBtn).is(':visible')).toBe(true);
	})

});

});