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


		describe("VIEW -- EDIT DLA (AS A AUTHOR) ", function() {

			beforeEach(function() {
				var self = this;
				//ATTACH THE CONTAINER SO ALL el WILL BE PRESENT FOR VIEWS
				$('#sandbox').append(bodyTemplate);
				this.server = sinon.fakeServer.create();
				var user = new User({
					username: 'author@cfy.com',
					role: constants.author
				});
				this.formModel = new createDLAFormModel();
				this.formModel.parse(formMetadata);
				this.createDLAView = new CreateDLAView();
				this.createDLAView.formModel = this.formModel;
				this.createDLAView.render({
					onComplete: function() {
						self.createDLAView.generalView.sourceSites = new sourceSitesModel(sourceSitesData);
						self.createDLAView.generalView.render();
						self.view = new View({
							createDLAForm: self.createDLAView,
							user: user
						});
					}
				});
				this.model = new Model(dlaData); // DLA MODEL
				this.deleteBtn = '#btn_delete';
				this.cancelBtn = '#btn_cancel';
				this.saveBtn = '#btn_save';
				this.backToDraftBtn = '#btn_backToDraft';
				this.readyToReviewBtn = '#btn_readyForReview';
				this.readyToPublishBtn = '#btn_readyToPuclish';
				this.publishBtn = '#btn_publish';
				this.unpublishBtn = '#btn_unpublishedDisqualified';

				waitsFor(function() {
					return this.view && this.createDLAView;
				}, "both create and edit dla shd present", 1500);

			});

			afterEach(function() {
				this.view.remove();
				delete this.view;
				$('#sandbox').html('');
			});



			it('In DRAFT state buttons disabled for author shd be Save', function() {
				this.model.set('stage', constants.draft);
				this.view.model = this.model;
				this.view.render();
				expect($(this.cancelBtn).is(':disabled')).toBe(false);
				expect($(this.readyToReviewBtn).is(':disabled')).toBe(false);
				expect($(this.deleteBtn).is(':disabled')).toBe(false);
				expect($(this.saveBtn).is(':disabled')).toBe(true);
			})

			it('In READY FOR REVIEW state buttons disabled for author shd be Save', function() {
				this.model.set('stage', constants.readyToReview);
				this.view.model = this.model;
				this.view.render();
				expect($(this.backToDraftBtn).is(':disabled')).toBe(true);
				expect($(this.cancelBtn).is(':disabled')).toBe(false);
				expect($(this.readyToPublishBtn).is(':disabled')).toBe(true);
				expect($(this.saveBtn).is(':disabled')).toBe(true);
				expect($(this.unpublishBtn).is(':disabled')).toBe(true);
			})

			it('In READY TO PUBLISH state buttons disabled for author shd be Save, Back To Draft, Unpublish, Ready To Publish', function() {
				this.model.set('stage', constants.readyToPublish);
				this.view.model = this.model;
				this.view.render();
				expect($(this.backToDraftBtn).is(':disabled')).toBe(true);
				expect($(this.cancelBtn).is(':disabled')).toBe(false);
				expect($(this.publishBtn).is(':disabled')).toBe(true);
				expect($(this.saveBtn).is(':disabled')).toBe(true);
				expect($(this.unpublishBtn).is(':disabled')).toBe(true);
			})

			it('In PUBLISH state buttons disabled for author shd be Save, Back To Draft, Unpublish, Publish', function() {
				this.model.set('stage', constants.publish);
				this.view.model = this.model;
				this.view.render();
				expect($(this.cancelBtn).is(':disabled')).toBe(false);
				expect($(this.saveBtn).is(':disabled')).toBe(true);
				expect($(this.backToDraftBtn).is(':disabled')).toBe(true);
				expect($(this.unpublishBtn).is(':disabled')).toBe(true);
			})

			it('In ERROR state buttons disabled for author shd be Save, Back To Draft, Unpublish, Publish', function() {
				this.model.set('stage', constants.error);
				this.view.model = this.model;
				this.view.render();
				expect($(this.cancelBtn).is(':disabled')).toBe(false);
				expect($(this.saveBtn).is(':disabled')).toBe(true);
				expect($(this.backToDraftBtn).is(':disabled')).toBe(true);
				expect($(this.publishBtn).is(':disabled')).toBe(true);
				expect($(this.unpublishBtn).is(':disabled')).toBe(true);
			})

			it('In UNPUBLISHED state buttons disabled for author shd be Delete, Cancel, Save, Back To Draft and Publish', function() {
				this.model.set('stage', constants.unpublishedDisqualified);
				this.view.model = this.model;
				this.view.render();
				expect($(this.deleteBtn).is(':disabled')).toBe(true);
				expect($(this.cancelBtn).is(':disabled')).toBe(false);
				expect($(this.saveBtn).is(':disabled')).toBe(true);
				expect($(this.backToDraftBtn).is(':disabled')).toBe(true);
				expect($(this.publishBtn).is(':disabled')).toBe(true);
			})

		});

	});