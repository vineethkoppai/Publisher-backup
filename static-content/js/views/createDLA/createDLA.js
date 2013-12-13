define([
'jquery',
'underscore',
'backbone',
'text!templates/createDLA/createDLA.html',
'constants',
'models/dla',
'models/createDLAForm',
'views/editDLA/moreInfo',
'views/createDLA/general',
'views/createDLA/classification',
'views/createDLA/websiteFeatures',
'views/createDLA/teachersEvaluation',
'views/createDLA/keywords',
'views/createDLA/comments',
'views/spinner'],

function (
$,
_,
Backbone,
createDLATemplate,
constants,
DLAModel,
DLAForm,
MoreInfoview,
General,
Classification,
WebFeatures,
TeachersEvaluation,
Keywords,
Comments,
Spinner) {

        var CreateDLA = Backbone.View.extend({

                el: '#divAddDLA',
                template: _.template(createDLATemplate),

                events: {
                    'click #btn_cancel': 'cancelCreateDLA',
                    'click #btn_save': 'save',
                    'click #btn_readyForReview': 'ReadyToReview',
                    'click #btn_readyToPuclish': 'readyToPublish',
                    'click #btn_publish': 'validatePublish',
                    'click #btn_backToDraft': 'backToDraft',
                    'click #btn_unpublishedDisqualified':'unpublishedDisqualified',
                    'click #more_info': 'moreInfo',
                    'click #back': 'closeMoreInfo',
                    'keyup input':'enableSave',
                    'change #txt_dlaName':'isTitleUnique'
                },

                initialize: function (options) {
                    this.titleId = '#txt_dlaName';
                    this.urlId = '#txt_url';
                    this.activityId = '#activity_span';
                    this.difficultyId = '#difficulty_span';
                    this.languagesId = '#language_span';
                    this.restrictionId = '#restriction_span';
                    this.pluginId = '#plugin_span';
                    this.audioSupportName = 'radioAutosupport';
                    this.acctReqdName = 'radioAcctrequired';
                    this.multiPlayerName = 'radioMultiplayer';
                    this.teachesContentName = 'radioTeacherscontent';
                    this.bloomsTaxonomyId = '#blooms_span';
                    this.feedbackId = '#feedback_span';
                    this.bulletsId = '#div_studentLearn';
                    this.commentsId = '#addComments';
                    this.deleteBtnId = '#btn_delete';
                    this.cancelBtnId = '#btn_cancel';
                    this.saveBtnId = '#btn_save';
                    this.backToDraftId = '#btn_backToDraft';
                    this.readyToReviewId = '#btn_readyForReview';
                    this.publishBtnId = '#btn_publish';
                    this.unPublishBtnId='#btn_unpublishedDisqualified';
                    this.mode = 'create';
                    // MODEL FOR THE FORM, TO SET METADATA ID ETC
                    this.formModel = new DLAForm();
                    var me = this;
                    //fetch the model, on success callback render the view
                    this.formModel.fetch({
                            success: function (jsonData) {
                                me.render(options);
                            },
                            error: function (e) {
                                console.log(e);
                            }
                        });


                },

                render: function (options) {
                    var self = this;
                    // create a dla model in which you are goin to store the user entered data
                    this.formModelJson = this.formModel.toJSON();
                    // get the id for content type and set it inside dla model
                    $('#listViewContainer').hide();
                    $('#scrollableDiv').hide();
                    $('#divAddDLA').show();

                    this.$('#createDLADiv').html(this.template({
                                createDLAForm: this.formModelJson
                            }));        

                    //CREATE CHILD VIEWS, WHICH WILL RENDER BY THEM SELVES
                    this.generalView = new General({
                            model: this.formModelJson
                        });
                    this.classificationView = new Classification({
                            model: this.formModelJson
                        });
                    this.webFeaturesView = new WebFeatures({
                            model: this.formModelJson
                        });
                    this.teachersEvaluationView = new TeachersEvaluation({
                            model: this.formModelJson
                        });
                    this.keywordsView = new Keywords();
                    this.commentsView = new Comments({
                            model: this.formModelJson
                        });

                    $('#divAddDLA').layout({
                            west: {
                                minWidth: 400
                            }
                        });

                    $("#accordion").accordion({
                            heightStyle: "content",
                            // active: true,
                            collapsible: true

                        });

                    $(".resizable").resizable({
                            grid: [1, 10000]
                        });

                    //call back to inform tat render is complete
                    if (options) options.onComplete();
                    $(this.unPublishBtnId).hide();
                    $(this.backToDraftId).hide();
                    $(this.publishBtnId).hide();
                    $(this.deleteBtnId).hide();

                    setInterval(function () {
                        self.changeWidth();
                    }, 5);
                }, // END RENDER

                //METHOD TO CHECK IF URL IS UNIQUE
                isTitleUnique: function() {
                    var title = $(this.titleId).val().trim(),
                         self = this;
                    if(title.length < 1)
                        return;

                    var title ='"'+title+'"';
                   
                    title = encodeURIComponent(title);
                    $.ajax({
                        type: 'GET',
                        contentType: 'application/json',
                        url: constants.uniqueTitle + title,
                        success: function(resp) {
                            if (resp.response['content-list'] && resp.response['content-list'].length > 0) {
                                self.uniqueTitle = false;
                                self.existingDlaId = resp.response['content-list'][0].id;
                                self.generalView.confirmation(self.existingDlaId, 'title');
                            }else{                                
                                self.uniqueURL = true;
                            }
                        },
                        error: function(e) {
                            console.log(e);
                        }
                    });
                },

                //TO SHOW MORE INFO
                moreInfo: function () {
                    if (!this.moreInfoview) {
                       this.moreInfoview = new MoreInfoview({ mode:this.mode, dla:this.model|| null }); 
                    }else{
                        this.moreInfoview.show();
                    }                    
                },
             
                //FUNCTION TO UPDATE THE MORE INFO MODEL ON CHANGE OF DLA
                updateMoreinfo:function(){
                    if (this.moreInfoview)
                        this.moreInfoview.refresh();
                },

                closeMoreInfo: function () {
                    this.moreInfoview.close();
                    delete this.moreInfoview;
                },

                changeWidth: function () {
                    if ($('#moreInfoWrapper')) {
                        $("#moreInfoWrapper").css('position', 'relative');
                        $("#moreInfoWrapper").css('margin-left', $('#createDLADiv').width());
                    }
                },

                getWebsiteFeatures: function (option) {
                    var val = $(option).text().trim().toUpperCase();
                    var dto = null
  
                    var metaDataId = $(option).attr('metadataId');
                    var isMultivalued = $(option).attr('is-multivalued');
        
                        try {
                            dto = _.find(this['meta-attribute-list'], function (o) {
                                return o['attribute-description-id'] == metaDataId;
                            });
                        } catch (e) {

                        }

                       if (!dto && $(option).text().trim().toUpperCase() !='SELECT' ) {
                            dto = {
                                "attribute-description-id": metaDataId
                            };
                            this['meta-attribute-list'].push(dto);
                        }else if(dto && $(option).text().trim().toUpperCase()=='SELECT'){
                            this.findAndRemove(this['meta-attribute-list'], 'attribute-description-id', metaDataId);
                            dto = null;
                        }

                        if(dto){
                            if (!isMultivalued)
                                dto.value = $(option).text().trim();
                            else
                                dto['value-list'] = $(option).text().trim().split(',');
                        }            
                },
                //METHOD TO REMOVE THE META ATTRIBUTE IF THE VALE IS REMOVED IN EDIT MODELS
                findAndRemove:function(array, property, value) {
                   $.each(array, function(index, result) {
                      if(result && result[property] == value) {
                          array.splice(index, 1);
                      }    
                   });
                },

                //ON CLICK OF SAVE
                save:function(){
                    this.disableSave();   
                    this.userAction = 'save';
                    if(this.model && this.model.toJSON().stage===constants.publish){
                        this.validatePublish(this.userAction);
                    }else{
                        delete this.dlaState;
                        this.validateForm();
                    }
                                     
                },

                validateForm: function (e) { 
                    var self = this;
                    if ($.trim($(this.urlId).val()).length < 1) {
                        alert("Please enter a valid URL");
                        delete this.dlaState;
                        this.userAction = 'statechange';
                        return;
                    } else if ($.trim($(this.titleId).val()).length < 1) {
                        alert("Please enter the name for DLA");
                        delete this.dlaState;
                        this.userAction = 'statechange';
                        return;
                    } 
                  
                    if (!this.model && !this.generalView.uniqueURL) {
                        this.generalView.isUrlUnique({
                                onComplete: function () {
                                    if (self.generalView.uniqueURL)
                                        self.saveDLA();
                                    else {
                                         delete this.dlaState;
                                         this.userAction = 'statechange';
                                         return false;
                                    }
                                }
                            });
                    }else if(this.generalView.uniqueURL && this.mode == 'create'){
                        this.generalView.isUrlUnique({
                                onComplete: function () {
                                    if (self.generalView.uniqueURL)
                                        self.saveDLA();
                                    else {
                                         delete this.dlaState;
                                         this.userAction = 'statechange';
                                         return false;
                                    }
                                }
                        });
                    }else{
                        this.saveDLA();
                    }

                },
                
                //METHOD TO SAVE TO SERVER
                saveDLA: function () {
                    var self = this;
                    this.showSpinner();
                    if (!this.model) {
                        this.model = new DLAModel();
                        this['meta-attribute-list'] = [];
                       // this.model.set('stage', this.dlaState || constants.draft);
                    } else {
                        this['meta-attribute-list'] = this.model.toJSON()['meta-attribute-list'];
                    }

                    var contentType = {
                        name: this.formModelJson.name
                    };

                    this.model.set({
                            "content-type": contentType
                        });

                    this.generalView.getValues(this['meta-attribute-list'], this.model);
                    //GET SUBJECTS, SUBTOPICS AND STANDARDS FROM CLASSIFICATION VIEW
                    this.classificationView.getValues(this['meta-attribute-list'], this.model);

                    if (this.keywordsView.keywords) {                      
                        this.keywordsView.keywords.sortKeywords();
                        this.model.set({
                                "tag-list": _.pluck(this.keywordsView.keywords.toJSON(), 'name')
                            });
                    }



                    if (this.commentsView.comments.length > 0)
                        this.parseCollectionToString(this.commentsView.comments, this.commentsId);

                    this.getWebsiteFeatures(this.activityId);
                    this.getWebsiteFeatures(this.difficultyId);
                    this.getWebsiteFeatures(this.languagesId);
                    this.getWebsiteFeatures(this.restrictionId);
                    this.getWebsiteFeatures(this.pluginId);

                    //GET DATA FROM TEACHERS EVALUATION
                    this.getWebsiteFeatures(this.bloomsTaxonomyId);
                    this.getWebsiteFeatures(this.feedbackId);
                    this.getRadioValue(this.teachesContentName);
                    this.teachersEvaluationView.getWhatStudentsDO(this['meta-attribute-list']);
                    if (this.teachersEvaluationView.bullets.length > 0)
                        this.parseCollectionToString(this.teachersEvaluationView.bullets, this.bulletsId);

                    this.getRadioValue(this.audioSupportName);
                    this.getRadioValue(this.acctReqdName);
                    this.getRadioValue(this.multiPlayerName);

                    this.model.set({
                        'meta-attribute-list': this['meta-attribute-list']
                    });                   
                       
                    this.model.save({}, {
                        success: function (dla, response) {
                            self.updateMoreinfo();
                            self.disableSave();
                            var dlaId = response.response['content'].id;
                            self.model.set('id', dlaId);
                            self.postSavechanges(dlaId);
                        },
                        error: function (e) {
                            console.log(e);
                        }
                    }); // end of save model

                },

                postSavechanges:function(dlaId){
                    var self = this;
                    //EVENT TO NOTIFY THE COLLECTION THAT UNDERNEATH MODELS CHANGED
                    constants.eventbus.trigger('collectionChange');
                    $('#contentId').attr('value', dlaId);
                    if ($("#img").val()) {
                        this.generalView.imageUpload({
                            onComplete:function(){
                                if( (self.userAction && self.userAction == 'statechange') || self.mode == 'create'){
                                   self.changeDLAState(); 
                                   delete self.userAction;
                                }else{
                                    alert("Your changes have been successfully saved");
                                }                                                   
                            }
                        });
                    }else if( (this.userAction && self.userAction == 'statechange') || self.mode == 'create'){
                        self.changeDLAState(); 
                        delete self.userAction;
                    }else {                                        
                        alert("Your changes have been successfully saved");
                    }
                    self.hideSpinner();
                },

                changeDLAState: function (stage) {
                    var self = this;
                    this.model.set('stage', this.dlaState || constants.draft);
                    var url = constants.changeState + this.model.toJSON().id + '/stage/' + this.model.toJSON().stage;
                    this.showSpinner();
                    $.ajax({
                            type: "PUT",
                            contentType: 'application/json',
                            url: url,
                            success: function (data) {
                                delete this.dlaState;
                                //TO REFRESH THE COUNT IN SEE ALL IN DASH BOARD
                                constants.eventbus.trigger('refreshCount');
                                //EVENT TO NOTIFY THE COLLECTION THAT UNDERNEATH MODELS CHANGED
                                constants.eventbus.trigger('collectionChange');
                                self.hideSpinner();                                
                                if(self.model.toJSON().stage == constants.draft && self.mode == 'create'){
                                    self.goTo('#editdla/' + self.model.toJSON().id);
                                    alert("Your changes have been successfully saved");
                                }
                                else
                                    self.goTo('#');
                            },
                            error: function (e) {}
                        });
                        

                },
               
                getRadioValue: function (option) {
                    var val = $('input[name=' + option + ']:checked').val();
                    var dto = null;
                    if (val) {
                        var metadataId = $('input[name=' + option + ']:checked').attr('metadataId');
                        try {
                            dto = _.find(this['meta-attribute-list'], function (o) {
                                return o['attribute-description-id'] == metadataId;
                            });
                            if (!dto) {
                                dto = {
                                    "attribute-description-id": metadataId
                                };
                                dto.value = val;
                                this['meta-attribute-list'].push(dto);
                            } else {
                                dto.value = val;
                            }
                        } catch (e) {}
                    }
                },

                parseCollectionToString: function (collection, option) {
                    var metadataId = $(option).attr('metadataid');
                    try {
                        dto = _.find(this['meta-attribute-list'], function (o) {
                            return o['attribute-description-id'] == metadataId;
                        });
                    } catch (e) {}

                    if (!dto) {
                        dto = {
                            "attribute-description-id": metadataId
                        };
                        dto['value-list'] = _.pluck(collection.toJSON(), 'name');
                        this['meta-attribute-list'].push(dto);
                    } else {
                        dto['value-list'] = _.pluck(collection.toJSON(), 'name');

                    }
                },

                ReadyToReview: function () {
                    this.disableReadyToReview();
                    this.userAction = 'statechange';
                    if (this.model && this.model.toJSON().author.id != constants.userId && constants.userRole.toUpperCase() != constants.admin.toUpperCase()) {
                        alert("only author of this content can push to READY FOR REVIEW");
                    } else {
                         this.dlaState = constants.readyToReview;
                        if($(this.saveBtnId).is(':enabled') ){
                            this.validateForm();  
                        }else{
                           this.changeDLAState(); 
                        }
                          
                    }
                },

                readyToPublish: function () {
                    this.userAction = 'statechange';
                    if (this.model.toJSON().author.id != constants.userId && constants.userRole.toUpperCase() != constants.admin.toUpperCase()) {
                        alert("only Admin can push to READY TO PUBLISH");
                    } else {
                         this.dlaState = constants.readyToPublish;
                         if($(this.saveBtnId).is(':enabled'))
                            this.validateForm();
                         else
                           this.changeDLAState();
                    }
                },


                //method to check the mandatory fields before publishing
                validatePublish:function(userAction){
                    if(userAction !== 'save' ){
                        this.userAction = 'statechange';
                    }else{
                        this.userAction = userAction;
                    }
                        
                    var errorArray=[];
                    if ($.trim($(this.titleId).val()).length < 1) 
                        errorArray.push("* Give a Proper Title<br/>");                    
                    if ($.trim($(this.urlId).val()).length < 1) 
                        errorArray.push("* Give an unique URL<br/>");                        
                    if(!$("#thumbnailSample").attr('src') && !this.generalView.isImageSelected)
                        errorArray.push("* Select an Image<br/>");                         
                    if ($('#subject_span').text().toUpperCase().trim() == 'SELECT' && this.classificationView.subjectCount<1) 
                        errorArray.push("* Select a Subject<br/>");                        
                    if ($(this.activityId).text().toUpperCase().trim() == 'SELECT') 
                        errorArray.push("* Select any Activity Type"); 
                    var errorString='';   
                    for(var i=0;i<errorArray.length;i++)
                        errorString+=errorArray[i];
                   
                    if(errorString!=''){
                       jAlert(errorString); 
                       delete this.userAction;
                    }else{
                        this.dlaState = constants.publish;
                        if($(this.saveBtnId).is(':enabled') || this.userAction =='save'){
                            this.saveDLA();
                        }else{
                            this.changeDLAState();
                        }                  
                      }
                  },

                backToDraft: function () {
                     this.userAction = 'statechange';
                     this.dlaState = constants.draft;
                    if($(this.saveBtnId).is(':enabled'))
                        this.validateForm();
                    else
                      this.changeDLAState();
                },
                unpublishedDisqualified:function(){
                    this.userAction = 'statechange';
                     this.dlaState = constants.unpublishedDisqualified;
                    if($(this.saveBtnId).is(':enabled'))
                        this.validateForm();
                    else
                      this.changeDLAState();
                },

                show: function () {
                    $('#iframeDiv').show();
                    this.setDefaults();
                    this.enableSave();
                    this.$el.show();
                },

                cancelCreateDLA: function () {
                        this.goTo('#');                 
                },

                showSpinner:function(){
                     if (!this.spinner)
                            this.spinner = new Spinner({
                                    el: $('#divSpinner')
                                });
                        this.spinner.show();
                },

                hideSpinner:function(){
                       if (this.spinner)                            
                        this.spinner.hide();
                },

                enableSave:function(){
                    $(this.saveBtnId).removeAttr('disabled');
                    $(this.saveBtnId).removeClass('disabledSave');
                    $(this.readyToReviewId).removeAttr('disabled');
                    $(this.readyToReviewId).removeClass('disablereadyToReview');
                },

                disableSave:function(){
                    $(this.saveBtnId).attr('disabled','disabled');
                    $(this.saveBtnId).addClass('disabledSave');                  
                },

                disableReadyToReview:function(){
                    $(this.readyToReviewId).attr('disabled','disabled');
                    $(this.readyToReviewId).addClass('disablereadyToReview'); 
                },

                setDefaults: function () {
                    if (this.mode == 'create') {
                        this.webFeaturesView.setDefaults();
                        this.teachersEvaluationView.setDefaults();
                    }
                },

                hide: function () {
                    this.closeView();
                    this.$el.hide();
                    $('#iframeDiv').hide();
                    if (this.moreInfoview) {
                        this.closeMoreInfo();
                        delete this.moreInfoview;
                    }
                },

                //to unbind all the events froom this view when u hide this view
                closeView: function () {
                    this.unbind();
                    if(this.model)
                         delete this.model;
                  //  this.undelegateEvents();
                    this.clearForm();
                    //CLOSE CHILD VIEWS
                    this.generalView.close();
                    this.classificationView.close();
                    this.webFeaturesView.close();
                    this.teachersEvaluationView.close();
                    this.commentsView.close();
                    this.keywordsView.close();
                },

                clearForm: function () {

                    $("input:radio").removeAttr("checked");         

                    $(this.deleteBtnId).hide();
                    $(this.backToDraftId).hide();
                    $(this.publishBtnId).hide();
                    $(this.saveBtnId).show();
                    $(this.readyToReviewId).show();
                    // delete varibales creted for this view
                    delete this.dlaStatus;
                    $('#draft').removeClass();
                    $('#draft').text('Draft');
                    $('#draft').addClass('draft');
                    $('#noFile').show();
                    constants.eventbus.trigger('clearAll');
                    $('li').removeClass('selected');
                    $('#accordion').accordion('destroy').accordion({
                            heightStyle: "content",
                            collapsible: true
                        });
                }
            }); // end of create dla view

        return CreateDLA;

    });