define([
'jquery',
'underscore',
'backbone',
'text!templates/createDLA/createDLA.html',
'views/createDLA/createDLA',
'constants',
'models/dla',
'models/createDLAForm',
'views/createDLA/buttonPanel'],

function (
$,
_,
Backbone,
editDLATemplate,
CreateDLA,
constants,
DLAModel,
DLAForm,
ButtonsView) {

          // view for the create dla form +iframe
          var EditDLA = Backbone.View.extend({
                  el: '#divAddDLA',
                  template: _.template(editDLATemplate),

                  events: {
                      'click #btn_delete': 'deletDLA',
                      'keyup input[type="text"]': 'enableBtn',
                      'keyup textarea': 'enableBtn',
                      'click #subject_span': 'enableBtn',
                      'click input[type="radio"]': 'enableBtn',
                      'click #upLoadImage': 'enableBtn'
                  },

                  initialize: function (options) {
                      var self = this;

                      this.$deleteBtnId = $('#btn_delete');
                      this.$saveBtnId = $('#btn_save');
                      this.$readyToReviewId = $('#btn_readyForReview');
                      this.$readyToPublishBtn = $('#btn_readyToPuclish');
                      this.$publishBtnId = $('#btn_publish');
                      this.$createDLADiv = $('#createDLADiv');
                      this.$publishMandatory = $('.publishMandatory');
                      this.$unpublishBtn  = $('#btn_unpublishedDisqualified');
                      
                      //REFERENCE TO THE CREATE DLA VIEW
                      this.createDLAForm = options.createDLAForm;
                      this.user = options.user;
                      this.formModel = this.createDLAForm.formModelJson.contentTypeMetaData;
                      
                      //EVENT FROM SUBJECT TO ENABLE SAVE BTN
                      constants.eventbus.on('enableSave', this.enableBtn, this);
                  },

                  render: function () {
                      val = "";
                      this.role = this.user.toJSON().role.toUpperCase();
                      this.dlaStatus = this.model.toJSON().stage.toUpperCase();
                      if(this.dlaStatus==constants.readyToPublish)
                        this.$publishMandatory.show();
                      else
                        this.$publishMandatory.hide();
                      
                      if(this.dlaStatus=='DELETED'){
                        alert("This DLA is not availabe.");
                        history.go(-1);
                      }else{
                        //IF meta-attribute-list IS NULL ADD A EMPTY ARRAY SO USER CAN ADD VALUES
                        if( !this.model.toJSON()['meta-attribute-list'])
                            this.model.set('meta-attribute-list', new Array());
                        this.createDLAForm.model = this.model;
                        this.metadata = this.model.toJSON()['meta-attribute-list'];

                        //SET GENERAL VIEW
                        this.createDLAForm.generalView.setValues(this.model);
                        //SET CLASSIFICATION VIEW
                        this.createDLAForm.classificationView.setValues(this.model);
                        //SET WEB FEATURES
                        this.createDLAForm.webFeaturesView.setValues(this.metadata);
                        //SET TEACHERS EVALUATION
                        this.createDLAForm.teachersEvaluationView.setValues(this.metadata);
                        //SET KEYWORDS

                        this.createDLAForm.keywordsView.setKeywords(this.model.toJSON()["tag-list"])
                        //SET COMMENTS
                        this.createDLAForm.commentsView.setComments(this.metadata);
                        this.buttonsView = new ButtonsView();
                        this.buttonsView.setButtons(this.role, this.dlaStatus);

                        if (this.role == constants.author.toUpperCase() && this.dlaStatus != constants.draft.toUpperCase()) {
                            this.disableFormFields();
                        } else {
                            this.enableFormFields();
                        }
                        this.$saveBtnId.attr('disabled', 'disabled');
                        this.$saveBtnId.addClass('disabledSave');

                        // set the fetched DLA model for the create dla view so u can do update
                        this.createDLAForm.model = this.model;

                        var self = this;
                        $('li').click(function () {
                            self.enableBtn();
                        });

                      }
                      
                  },

                  enableBtn: function () {
                      //if admin OK
                      //else if he is the creator and state in draft or ready to review if(this.role==constants.author.toUpperCase() && this.dlaStatus != constants.draft.toUpperCase()){     
                      if (this.role == constants.admin.toUpperCase() || (this.role == constants.author.toUpperCase() && (this.dlaStatus == constants.draft.toUpperCase() || this.dlaStatus == constants.readyToReview.toUpperCase()))) {
                          this.$saveBtnId.removeAttr('disabled');
                          this.$saveBtnId.removeClass('disabledSave');
                      } else {
                          return false;
                      }

                  },

                  disableBtn: function () {
                      this.$saveBtnId.attr('disabled', 'disabled');
                      this.$saveBtnId.addClass('disabledSave');
                  },

              disableFormFields: function () {
                this.$createDLADiv.find('input').attr('disabled','disabled');
                  // this.$createDLADiv.find('input').attr('readonly', 'readonly');
                  this.$createDLADiv.find('textarea').attr('disabled','disabled');
                  // this.$createDLADiv.find('textarea').attr('readonly', 'readonly');
                  this.$createDLADiv.find('#lookUpTaxonomy').attr('disabled', 'disabled');
                  this.$createDLADiv.find('#lookUpTaxonomy').css('cursor', 'no-drop');
                  this.$createDLADiv.find('.disableSub').show();
                  this.$createDLADiv.find('.disableWebFeatures').show();
                  this.$createDLADiv.find('.disableTeacherEval').show();
                  this.$createDLADiv.find('.disableStandards').show();
                  this.$createDLADiv.find('.disablekeywords').show();
                  this.$createDLADiv.find('#btn_addBullet').attr('disabled', 'disabled');
                  this.$createDLADiv.find('#btn_addBullet').css('cursor', 'no-drop');
                  this.$createDLADiv.find('#btn_addKeyword').attr('disabled', 'disabled');
                  this.$createDLADiv.find('#btn_addKeyword').css('cursor', 'no-drop');
                  this.$createDLADiv.find('#btn_addComment').attr('disabled', 'disabled');
                  this.$createDLADiv.find('#btn_addComment').css('cursor', 'no-drop');
              },

              enableFormFields: function () {
                  
                  this.$createDLADiv.find('input').removeAttr('disabled');
                  this.$createDLADiv.find('textarea').removeAttr('disabled');
                  this.$createDLADiv.find('#lookUpTaxonomy').removeAttr('disabled');
                  this.$createDLADiv.find('#lookUpTaxonomy').css('cursor', 'pointer');
                  this.$createDLADiv.find('.disableSub').hide();
                  this.$createDLADiv.find('.disableWebFeatures').hide();
                  this.$createDLADiv.find('.disableTeacherEval').hide();
                  this.$createDLADiv.find('.disableStandards').hide();
                  this.$createDLADiv.find('.disablekeywords').hide();
                  this.$createDLADiv.find('#btn_addBullet').removeAttr('disabled');
                  this.$createDLADiv.find('#btn_addBullet').css('cursor', 'pointer');
                  this.$createDLADiv.find('#btn_addKeyword').removeAttr('disabled');
                  this.$createDLADiv.find('#btn_addKeyword').css('cursor', 'pointer');
              },            

                 

                  deletDLA: function () {
                      var self = this;
                      //AUTHOR CANT DELETE DLA CREATED BY OTHERS
                      if(constants.userRole.toUpperCase()==constants.author.toUpperCase() ){
                                    if(self.model.toJSON().stage.toUpperCase() != constants.draft.toUpperCase() || self.model.toJSON().author.id != constants.userId){
                                        alert(constants.errorOnDelete);
                                            return;
                                    }
                      }
                      jConfirm('Are you sure you want to delete this?', 'Confirmation Dialog', function (r) {
                          if (r == true) {
                              self.model.destroy({
                                      success: function () {
                                              //SINCE MODEL IS DELETED, TRIGGER A EVENT SO COLLECTION WILL LISTEN
                                              constants.eventbus.trigger('collectionChange');
                                              constants.eventbus.trigger('refreshCount');     
                                              self.goTo('#');
                                      },
                                      error: function () {

                                      }
                                  })
                          }
                      });

                  },

                  show: function () {
                      var self = this;
                      this.createDLAForm.mode = 'edit';
                      this.createDLAForm.show();
                      //get the id of dla from the url and append it to the url of model
                      var arr = window.location.href.split('/');
                      var len = arr.length;
                      this.dlaId = arr[len - 1];
                      this.model = new DLAModel();
                      this.model.url = this.model.url + this.dlaId;
                      this.model.fetch({
                              success: function (response) {
                                  self.render();
                                  self.delegateEvents();
                              }
                          })
                  },

                  hide: function () {
                      this.$publishMandatory.hide();
                      this.createDLAForm.hide();
                      this.$el.hide();
                      $('#iframeDiv').hide();
                      this.closeView();                    
                      this.createDLAForm.mode = 'create';
                  },

                  closeView: function () {
                      this.unbind();
                    //  this.undelegateEvents();
                      this.enableBtn();
                      this.enableFormFields();
                      this.$saveBtnId.removeAttr("disabled");
                      this.$deleteBtnId.removeAttr("disabled");
                      this.$readyToReviewId.removeAttr("disabled");
                      this.$publishBtnId.removeAttr("disabled");
                      this.$readyToPublishBtn.hide();
                      this.$unpublishBtn.hide();

                      $('li').removeClass('selected');
                  }

              }); // end of create dla view

          return EditDLA;

      });