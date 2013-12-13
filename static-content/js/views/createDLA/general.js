//VIEW FOR GENERAL SECTION IN FORM
define([
'jquery',
'underscore',
'backbone',
'text!templates/createDLA/general.html',
'ajaxform',
'constants',
'messages',
'models/sourceSites'],

function(
$,
_,
Backbone,
template,
ajaxform,
constants,
messages,
SourceSites) {

        var Comments = Backbone.View.extend({

            el: '#divGeneral',
            tagName: 'div',
            template: _.template(template),

            events: {
                'change #txt_url': 'loadIframe',
                'change #img': 'showPreview',
                'click #btnImgChange': 'changeImage',
                'keyup #txt_desc_general': 'enableSave',
                'change #txt_sourceSite':'validateSourcesite'
                // 'change #txt_dlaName':'validateName'
            },

            initialize: function(options) {
                var self = this;
                if (options)
                    this.formModel = options.model;               
                this.sourceSites = new SourceSites({
                    onComplete:function(){
                        self.render();
                    }
                }); 
            },

            render: function() {
                var self = this;
                this.$el.append(this.template({
                    formModel: this.formModel,
                    constants: constants
                }));
                this.setDomvariables(); 

                this.$ifaremeId.load(function() {
                    $('#showLoadingImg').removeClass('addBack_iframe_dla');
                });
                $('#upLoadImage').click(function() {
                    $('#fileForm #img').trigger('click');
                });

                this.$sliderId.slider({
                    range: true,
                    min: 0,
                    max: 12,
                    values: [0, 12],
                    slide: function(event, ui) {
                        $('#amount').val(ui.values[0] + ' - ' + ui.values[1]);
                        self.enableSave();
                    }
                });

                // Call Autocomplete function for the sourcesite field
                 this.sourcesiteAutocomplete(); 
                 var myFrame = document.getElementById("iframe_dla");
                //Get the window of that frame, overwrite the confirm
                myFrame.contentWindow.confirm = function(msg){ alert("I overwrote it! : " + msg); }
            },

            //TO BE CALLED AFTER RENDER SO WE CAN CACHE ALL JQUERY OBJECTS
            setDomvariables:function(){
                this.$titleId   =   $('#txt_dlaName');
                this.$urlId     =   $('#txt_url');
                this.$ifaremeId =   $('#iframe_dla');
                this.$imageForm =   $('#fileForm');
                this.$sourceId  =   $('#txt_sourceSite');
                this.$descId    =   $('#txt_desc_general');
                this.$sliderId  =   $('#slider-range');
                this.$saveButton =  $('#btn_save');
                this.$thumbnailSample = $('#thumbnailSample');
                this.$errorImage        = $('#errorImage');
            },
            
            //METHOD TO CHECK IF THE UPLOADED IMG IS CURRIPTED
            //REMOVING THIS, BECAUSE OF SAFARI ISSUE
            // bindMethods:function(){                
            //     this.$thumbnailSample.error(function(e){  
            //            if(e.currentTarget.src.length>0){
            //                var $this = $(this);
            //                $this.hide().removeAttr('src'); 
            //                $this.siblings('#noFile').hide();  
            //                $this.siblings('#errorImage').show();                     
            //                $('#img').val('');
            //            }                      
            //     }); 
            // },

            // Autocomplete function for the sourcesite field
            sourcesiteAutocomplete: function() {
                this.$sourceId.autocomplete({
                    minLength: 0,
                    source: this.sourceSites.toJSON().list,
                    appendTo: $('#autocomplete')
                })
            },

            loadIframe: function() {
                var self = this;               
                this.isUrlUnique({
                    onComplete: function() {
                        var input1 = self.$urlId.val().trim();
                        if (input1.length > 0) {
                            if (self.uniqueURL) {
                                if (input1.indexOf('youtube.com/watch') >= 0) {
                                    var vid = input1.match('[\?&]v=([^&#]*)')[1]; // end up with v=oHg5SJYRHA0     
                                    input1 = 'http://www.youtube.com/embed/' + vid;
                                }
                                if (input1.match(/\bhttps(.)*/) || input1.match(/\bhttp(.)*/))
                                    self.$ifaremeId.attr('src', input1);
                                else {
                                    input1 = 'http://' + input1;
                                    self.$urlId.val(input1);
                                    self.$ifaremeId.attr('src', input1);
                                }
                                self.$urlId.val(input1);
                            }else {
                                self.confirmation(self.dlaAlreadyID, 'URL');
                            }
                        } else {
                            self.$ifaremeId.attr('src', input1);
                        }
                    } // on complete
                }) // this.uniqueurl
            },

            //method to show confirm box on unique url or inique title
            confirmation: function(dlaID, attribute) {
                var self = this;
                setTimeout(function() {
                    $('#popup_panel #popup_ok').addClass('pop_up_ok');
                    $('#popup_panel #popup_cancel').addClass('pop_up_cancel');
                }, 100);

                jConfirm('A DLA with this '+ attribute +' already exists. Would you like to go to that DLA ?', 'Confirmation Dialog', function(r) {

                    if (r == true) {
                        self.goTo('#editdla/' + dlaID);
                    } else {
                        self.$urlId.val('');
                        self.$ifaremeId.attr('src', '');
                    }
                });
            },

            validateSourcesite:function(){
                var sourceSite = this.$sourceId.val();
                if( !_.contains(this.sourceSites.toJSON().list, sourceSite.trim())) 
                    this.$sourceId.val('');
            },

            //method to check if the entered URL is unique
            isUrlUnique: function(option) {
                if (!this.dlaAlreadyID)
                    this.dlaAlreadyID = '';
                var input = this.$urlId.val();
                if (input.match(/\bhttps(.)*/))
                    input = input.substring(8);
                else if (input.match(/\bhttp(.)*/))
                    input = input.substring(7);
                input = encodeURIComponent(input);
                var self = this;
                $.ajax({
                    type: 'GET',
                    contentType: 'application/json',
                    url: constants.uniqueURL + input + '&profile=list&page-index=0&max-count=30',
                    success: function(resp) {
                        if (resp.response['content-list'] && resp.response['content-list'].length > 0) {
                            self.uniqueURL = false;
                            self.dlaAlreadyID = resp.response['content-list'][0].id;
                        } else
                            self.uniqueURL = true;
                        option.onComplete();
                    },
                    error: function(e) {
                        console.log(e);
                    }
                });
            },
            checkYoutubeUrl: function(url) {
                if (url.indexOf('youtube.com/watch') >= 0) {
                    var vid = url.match('[\?&]v=([^&#]*)')[1];
                    url = 'http://www.youtube.com/embed/' + vid;
                }
                this.$urlId.val(url);
            },

            getValues: function(contentTypeMetaDataDTO, dlaModel) {

                this['meta-attribute-list'] = contentTypeMetaDataDTO;
                this.dlaModel = dlaModel;
                this.dlaModel.set({
                    url: this.$urlId.val(),
                    title: this.$titleId.val(),
                    description: this.$descId.val()
                });
                this.getSourceSite();
                this.getGrades();
            },

            getSourceSite:function(){
                var sourceSite = this.$sourceId.val(); 
                var metadataId = this.$sourceId.attr('metadataid');
                var dto = null;
                try{
                      var   dto = _.find(this['meta-attribute-list'], function(o) {
                        return o['attribute-description-id'] == metadataId;
                    });
                }catch(e){}
                if(dto){
                    if( _.contains(this.sourceSites.toJSON().list, sourceSite.trim()) || sourceSite.trim().length ==0 )
                        dto.value = sourceSite;
                }else{
                    if( sourceSite && _.contains(this.sourceSites.toJSON().list, sourceSite.trim()) && sourceSite.length > 0 ){
                        dto = {
                            'attribute-description-id': metadataId
                        };
                        dto.value = sourceSite;
                        this['meta-attribute-list'].push(dto);
                    }
                }
            },

            //TO UPLOAD IMAGE VIA AJAX
            imageUpload: function(option) {
                var self = this;
                var contentId = this.dlaModel.toJSON().id;
                $('#contentId').val(contentId);
                this.$imageForm.ajaxForm({
                    url: constants.imageUpload,
                    success: function() {
                        option.onComplete();
                    }
                }).submit();
            },

            //TO SHOW IMG THUMBNAIL WHEN USER SELECTS ONE
            showPreview: function() {
                var self = this,
                    input = $('#img'),
                    $nofile = $('#noFile');

                input = input[0];
                if (input.files && input.files[0]) {
                    var reader = new FileReader;
                    reader.onload = function(e) {
                        var img = new Image;
                        img.onload = function() {
                            self.imgWidth = img.width;
                            self.imgHeight = img.height;
                            if(self.imgHeight !== constants.thumbnailHeight || self.imgWidth !==constants.thumbnailWidth ){
                                self.$errorImage.text(messages.thumbnailImgSizeInvalid).show();
                                self.$thumbnailSample.hide();
                                $nofile.show();
                            }
                        };
                        img.src = reader.result;                        
                        self.$thumbnailSample.attr('src', e.target.result).show();
                        $nofile.hide();
                       self.$errorImage.hide();
                    }
                    reader.readAsDataURL(input.files[0]);                    
                }
                
                $nofile.hide();
                this.isImageSelected = true;
            },

            getGrades: function() {
                var dto = null;
                var metadataId;
                var val;

                val = this.$sliderId.slider('values', 0);
                try {
                    metadataId = _.find(this.model.contentTypeMetaData, function(o) {
                        return o.name == constants.minGrade;
                    }).id;
                    dto = _.find(this['meta-attribute-list'], function(o) {
                        return o['attribute-description-id'] == metadataId;
                    });
                    if (!dto) {
                        dto = {
                            'attribute-description-id': metadataId
                        };
                        dto.value = val;
                        this['meta-attribute-list'].push(dto);
                    } else {
                        dto.value = val;
                    }


                    dto = null;
                    val = this.$sliderId.slider('values', 1);
                    metadataId = _.find(this.model.contentTypeMetaData, function(o) {
                        return o.name == constants.maxGrade;
                    }).id;

                    dto = _.find(this['meta-attribute-list'], function(o) {
                        return o['attribute-description-id'] == metadataId;
                    });
                    if (!dto) {
                        dto = {
                            'attribute-description-id': metadataId
                        };
                        dto.value = val;
                        this['meta-attribute-list'].push(dto);
                    } else {
                        dto.value = val;
                    }
                } catch (e) {}
            },

            setValues: function(model) {
                var data = model.toJSON();
                this.metadata = data['meta-attribute-list'];
                this.setTxtBoxes(this.$titleId, data.title);
                this.setTxtBoxes(this.$descId, data.description);

                this.checkYoutubeUrl(data.url);
                this.setIframe();
                this.setSourceSite();
                this.setImage();
                this.setSlider();
            },

            //Set Textboxes
            setTxtBoxes: function(obj, val) {
                obj.val(val).trigger('keydown');
            },

            setIframe: function() {
                var input = this.$urlId.val();
                if(!input)
                    return false;

                if (input.match(/\bhttps(.)*/)) {

                } else if (input.match(/\bhttp(.)*/)) {
                    this.$ifaremeId.attr('src', input);
                } else {
                    input = 'http://' + input;
                    this.$ifaremeId.attr('src', input);
                }
            },

            setSourceSite: function() {
                var metaDataId = this.$sourceId.attr('metadataid');
                var source = null;
                try {
                    source = _.find(this.metadata, function(o) {
                        return o['attribute-description-id'] == metaDataId
                    }).value;
                    this.$sourceId.val(source);
                } catch (e) {};
            },

            setImage: function() {

                var metaDataId = $('#imgMetadataId').val();
                var imgUrl = null;
                var contentMetaDataId = null;
                try {
                    imgUrl = _.find(this.metadata, function(o) {
                        return o['attribute-description-id'] == metaDataId
                    }).value;
                    contentMetaDataId = _.find(this.metadata, function(o) {
                        return o.id == metaDataId
                    }).contentMetaDataId;
                } catch (e) {};

                if (imgUrl) {
                    //ADD MATH.RANDOM TO INAVALIDATE CACHE
                    imgUrl = imgUrl +'?random='+Math.random();
                    $('#contentImgMetaDataId').val(contentMetaDataId);
                    this.$thumbnailSample.show().attr('src', imgUrl);
                    $('#noFile').hide();
                } else {
                    // show file upload
                }

            },

            changeImage: function() {
                $('#imgUpload').show();
                $('#imgEdit').hide();
                this.$errorImage.hide();
            },

            setSlider: function() {
                var minVal = 0,
                    maxVal = 12;
                try {
                    minVal = _.find(this.metadata, function(o) {
                        return o.name == constants.minGrade
                    }).value;
                    maxVal = _.find(this.metadata, function(o) {
                        return o.name == constants.maxGrade
                    }).value;
                } catch (e) {};
                if (minVal === null) minVal = 0;
                if (maxVal === null) maxVal = 12;
                this.$sliderId.slider({
                    range: true,
                    min: 0,
                    max: 12,
                    values: [minVal, maxVal]
                });
            },

            enableSave: function() {
                this.$saveButton.removeAttr('disabled');
                this.$saveButton.removeClass('disabledSave');
            },
            close: function() {
                this.$imageForm[0].reset();
                this.setTxtBoxes(this.$titleId, '');
                this.setTxtBoxes(this.$descId, '');
                this.$urlId.val('');
                this.$sourceId.val('');
                this.$sliderId.slider({
                    range: true,
                    min: 0,
                    max: 12,
                    values: [0, 12]
                });
                this.$ifaremeId.attr('src', '');
                this.changeImage();
                $('#contentImgMetaDataId').val('');
                this.$errorImage.hide();
                this.$thumbnailSample.removeAttr('src').hide();
                this.isImageSelected = false;
            }


        }); // end comments view

        return Comments;

    });