//VIEW FOR CLASSIFICATION SECTION INSIDE FORM
define([
'jquery',
'underscore',
'backbone',
'text!templates/createDLA/classification.html',
'views/createDLA/subtopics',
'views/createDLA/addSubject',
'models/taxonomy',
'views/lookup/lookup',
'views/createDLA/descriptionView',
'views/lookup/standardNodeView',
'views/spinner',
'constants',
'collections/standardsCollection'],

function (
$,
_,
Backbone,
template,
SubtopicsView,
NewSubject,
Taxonomy,
LookupView,
DescriptionView,
StandardNodeView,
Spinner,
constants,
StandardsCollection) {

        var Classification = Backbone.View.extend({

            el: '#divClassification',
            tagName: "div",
            template: _.template(template),

            events: {
                'click #lookUpTaxonomy': 'showLookUp',
                'click #slct_subjects': 'selectSubject',
                'click #btn_anotherSubject': 'addNewSubject'
                // 'keyup' :"keyPress"
            },

            initialize: function (options) {
                this.model = options.model;
                this.subjectId = '#subject_span';
                this.newSubjectDiv = '#addSubjectDiv';
                this.subtopicId = '#subtopic_span';
                this.nodelistId = '#desc_classification';
                this.lookupBtnId = '#lookUpTaxonomy';
                this.addSubjectBtnId = '#btn_anotherSubject';
                this.saveButton = $('#btn_save');
                this.selectedNodesCollection = new Backbone.Collection();

                this.bindRenderingStandards();

                //EVENT COMING FROM ADDED NEW SUBJECT
                constants.eventbus.on('showLookupEvent', this.showLookUp, this);
                //EVENT FROM ADD NEW SUBJECT
                constants.eventbus.on('checkSubjectrepeat', this.checkSubjectrepeat, this,this.event);
                constants.eventbus.on('addIframeback', this.addIframeback, this);
                constants.eventbus.on('removeIframe', this.removeIframe, this);
                this.render();
            },

            render: function () {
                //Sorting the Subject
                var data = this.model.subjects;
                data.sort(function (a, b) {
                    var x = a.id;
                    var y = b.id;
                    return ((x < y) ? -1 : ((x > y) ? 1 : 0));
                });
                var self = this;
                this.$el.append(this.template({
                    model: this.model,
                    constants: constants
                }));
                new DropDown($('#slct_subjects'));
                new DropDown($('#slct_sub_top'));
                this.disableSubtopic('');
                $('#subtopic_span').bind('click', function () {
                    var sub = $(self.subjectId).text().substring(0, 7).toUpperCase().trim();
                    if (sub == constants.ela || sub == constants.math)
                        $('#slct_sub_top_ul').hide();
                    else
                        $('#slct_sub_top_ul').show();
                });

                $("#slct_subjects li").click(function () {
                    // Highlighting the selected subject 
                    self.enableSave();
                    this.duplicateSubject = $(this);
                    self.checkSubjectrepeat($(this).text(), 0, this,this.event);
                    if ($(self.subjectId).text().trim().toUpperCase() == 'SELECT') {
                        $(self.subjectId).text('Select');
                        // $(self.subjectId).attr("title", "SELECT");
                        self.disableSubtopic('');
                    } else {
                        var sub = $(self.subjectId).text().substring(0, 7).toUpperCase().trim();
                        if (sub == constants.ela || sub == constants.math) {
                            self.enableLookup();
                            self.disableSubtopic('');
                        } else if (sub == 'WORLD L' || sub == 'BRAIN G') {
                            self.disableSubtopic('');
                            self.disableLookup('');
                        } else {
                            self.enableSubtopic();
                            self.disableLookup('');
                        }
                        self.enableAddnewSubject();
                        self.selectSubject();
                        $("#subtopic_span").text('Select');
                        // $(self.subjectId).attr("title", $(self.subjectId).text());
                    }
                });



                $(this.subjectId).click(function () {
                    self.checkForScrollBar();
                });

                $("#slct_subjects ul.dropdown li").click(function () {
                    self.checkForScrollBar();
                });

                $(this.addSubjectBtnId).attr('disabled', 'disabled');

                // view for subtopic, this will listen to even on select of subject and populate subtopics
                if (!this.subtopicsView)
                    this.subtopicsView = new SubtopicsView();

                //KEEP SUBJECTS IN A ARRAY TO PASS IT TO ADDED SUBJECT DROPDOWN
                this.subjects = this.model.subjects;
                //KEEP COUNT OF HOW MANY SUBJECTS ADDED
                this.subjectCount = 0;
                this.tooltip();
            },
             //REGISTER A FUNCTION TO SHOW A TOOLTIP
            tooltip:function(){
                var self = this;

                $(".degree-of-alignment .icon-question-sign").popover({ 
                  delay:{ 
                            show: "800", 
                            hide: "800"
                        },
                  html : true,
                  trigger:'hover',
                  title:"Rating Scoring Guide",
                  placement:'top',
                  content:"<div class='row-fluid help-data'>"+
                              "<div class='span3'><b>3</b>: Lorem ipsum dolor sit"+
                                "amet, consectetur adipisicing elit."+
                              "</div>"+
                               "<div class='span3'><b>2</b>: Lorem ipsum dolor sit"+
                                "amet, consectetur adipisicing elit."+
                              "</div>"+
                               "<div class='span3'><b>1</b>: Lorem ipsum dolor sit"+
                                "amet, consectetur adipisicing elit."+
                              "</div>"+
                               "<div class='span3'><b>0</b>: Lorem ipsum dolor sit"+
                                "amet, consectetur adipisicing elit."+
                              "</div>"+
                            "</div>"
                });
             },
            keyPress:function(e){
                 if (e.keyCode === 27){
                        //TO ADD IFRAME CONTENT BACK TO DIV, THIS EVEN WILL BE LISTENED FROM CLASSIFICATION.JS
                       e.preventDefault();
                    }
            },
            remove:function(){
                this.subjectCount--;
            },

            selectSubject: function () {
                this.subtopicsView.refresh();
            },

            checkForScrollBar: function () {
                if ($("#slct_subjects").hasClass("active")) {
                    $("#slct_subjects ul.dropdown").css('overflow', 'hidden');
                } else {
                    $("#slct_subjects ul.dropdown").css('overflow', 'auto');
                }
            },

            showLookUp: function (subject, subjectId, subjectDivId) {
                $("#desc_classification").html("");
                // $("#divClassification .standards").html('');

                if (subjectDivId) {} else {
                    subjectDivId = '';
                }
                var sub = $("#subject_span" + subjectDivId).text().trim().toUpperCase();
                if (sub == 'SELECT')
                    return;
                else if (sub == 'LANGUAGE ARTS' || sub == 'MATH') {
                    if (!this.spinner)
                        this.spinner = new Spinner({
                            el: $('#divSpinner')
                        });
                    this.spinner.show();
                    this.removeIframe();
                    var self = this,
                        newTaxonomy = true,
                        type = 'strand';
                    if (!subjectDivId)
                        var subjectDivId = '';
                    if (typeof subject !== 'string' || !subject instanceof String) {
                        var $subjectId = $(this.subjectId);
                        var subject = $subjectId.text().substring(0, 7).trim().toUpperCase();
                        var subjectId = $subjectId.val();
                    }

                    if (subject !== constants.math && subject !== constants.ela) {
                        this.spinner.hide();
                        this.disableLookup('');
                        return;
                    }

                    if (subject === constants.math)
                        type = 'domain';

                    if (!this.taxonomyId) {

                        this.taxonomyId = this.getTaxonomyId(subjectId);
                        newTaxonomy = true;
                    } else if (this.taxonomyId === this.getTaxonomyId(subjectId)) {
                        newTaxonomy = false;
                    } else {
                        this.taxonomyId = this.getTaxonomyId(subjectId);
                        newTaxonomy = true;
                    }
                    // get the taxonomy tree from server then show lookup
                    // using oncomplete for callback
                    if (newTaxonomy === true) {
                        var collectionArray = [];
                        this.taxonomy = new Taxonomy({
                            taxonomyId: this.taxonomyId,
                            type: type,
                            onComplete: function () {
                                if (newTaxonomy === true)
                                    self.lookUpView = new LookupView({
                                        model: self.taxonomy
                                    });
                                //           .error(function(){
                                //                  self.spinner.hide();
                                // });
                                                    // Cloning collection
                                self.selectedNodesCollection.each(function(standardModel) {
                                  self.lookUpView.selectedNodes.add(new Backbone.Model(standardModel.toJSON()));
                                });   
                              
                                // FILTER COLLECTION ACCORDING TO TYPE
                                // if(type==="domain"){
                                //     var filtered = new Backbone.Collection(self.selectedNodesCollection.filter(function(model) {
                                //         return model.get('type') === 'MATH';
                                //     }));

                                //     console.log("collectionArray else filtered MATH new taxonomy");
                                //     console.log(filtered);
                                // }
                                //     collectionArray = _.filter(self.selectedNodesCollection.models, function(node){
                                //          console.log(node.attributes.type);
                                //          return node.attributes.type == "MATH";  
                                //     });

                                //     console.log("collectionArray");
                                //     console.log(collectionArray);
                                // }
                                
                                // FILTER COLLECTION ACCORDING TO TYPE

                                 // else if(type==="strand"){
                                 //     var filtered = new Backbone.Collection(self.selectedNodesCollection.filter(function(model) {
                                 //        return model.get('type') === 'LANGUAG';
                                 //    }));

                                 //    console.log("collectionArray else filtered ELA new taxonomy");
                                 //    console.log(filtered);
                                 // }
                                //     console.log("type = LANGUAG");
                                //     var collectionArray = _.filter(self.selectedNodesCollection.models, function(node){
                                //                                 console.log(node.attributes.type);
                                //                                 return node.attributes.type == "LANGUAG"; 
                                //                             });
                                //      console.log(collectionArray);
                                //      for (var i = collectionArray.length - 1; i >= 0; i--) {
                                //         selectedNodesCollectionCopy.add(collectionArray[i]);
                                         
                                //      }
                                // }   
                                // var filteredCollection = new this.selectedNodesCollection(publishedBooks);
                                
                                // self.lookUpView.showLookup(subject, subjectDivId, selectedNodesCollectionCopy);
                                self.lookUpView.showLookup(subject, subjectDivId, self.selectedNodesCollection);
                                self.lookUpView.on('associateTaxonomy', self.renderDescription, self);
                                self.lookUpView.on('restoreTaxonomy',self.restoreTaxonomy,self);
                                self.spinner.hide();
                                // self.removeIframe();
                            }
                        });
                    } else {
                        var collectionArray = [];
                        var selectedNodesCollectionCopy = new Backbone.Collection();

                        // FILTER COLLECTION ACCORDING TO TYPE
                        // if(type==="domain"){
                        //     var filtered = new Backbone.Collection(this.selectedNodesCollection.filter(function(model) {
                        //         return model.get('type') === 'MATH';
                        //     }));

                        //     console.log("collectionArray else filtered MATH");
                        //     console.log(filtered);
                        // }
                        //     console.log("type = MATH");
                        //      collectionArray = _.filter(self.selectedNodesCollection.models, function(node){
                        //                                 console.log(node.attributes.type);
                        //                                 return node.attributes.type == "MATH"; 
                        //                             });
                        //      console.log(collectionArray);
                        //      for (var i = collectionArray.length - 1; i >= 0; i--) {
                        //         selectedNodesCollectionCopy.add(collectionArray[i]);
                                 
                        //      }
                        // }

                        // FILTER COLLECTION ACCORDING TO TYPE
                        // else if(type==="strand"){
                        //     var filtered = new Backbone.Collection(this.selectedNodesCollection.filter(function(model) {
                        //         return model.get('type') === 'LANGUAG';
                        //     }));

                        //     console.log("collectionArray else filtered ELA");
                        //     console.log(filtered);
                        // }
                        //     console.log("type = LANGUAG");
                        //     collectionArray = _.filter(self.selectedNodesCollection.models, function(node){
                        //                                 console.log(node.attributes.type);
                        //                                 return node.attributes.type == "LANGUAG"; 
                        //                             });
                        //      console.log(collectionArray);
                        //      for (var i = collectionArray.length - 1; i >= 0; i--) {
                        //         selectedNodesCollectionCopy.add(collectionArray[i]);
                                 
                        //      }
                        // }   

                        
                        // self.lookUpView.showLookup(subject, subjectDivId, selectedNodesCollectionCopy);
                        self.lookUpView.showLookup(subject, subjectDivId, this.selectedNodesCollection);
                        self.spinner.hide();
                        // self.removeIframe();
                    }
                    
                }


            },

            removeIframe: function () {
                this.iframeHtml = $('#iframeDiv').html();
                $('#iframeDiv').html('');
            },

            addIframeback: function () {
                $('#iframeDiv').html(this.iframeHtml);
            },

            //DEPENDING ON SUBJECT ID RETURN TAXONOMY ID
            getTaxonomyId: function (subjectId) {
                var taxonomyId = _.find(this.model.subjects, function (o) {
                    return o.id == subjectId;
                }).taxonomyId;
                return taxonomyId;
            },

            //function to be executed when removing subject
            removeSubject: function () {                
                this.subjectCount--;
                // CALL TO  CREATE DLA
                constants.eventbus.trigger("enableSave");

            },
            //TO RENDER THE SELECTED NODES ON FORM
            renderDescription: function () {
                this.promises = [];

                  while(this.selectedNodesCollection.length > 0) {
                    // promises.push( this.selectedNodesCollection.models[0].destroy() );
                    
                    this.selectedNodesCollection.remove(this.selectedNodesCollection.models[0]);
                  }
                  
                var self = this;
                if (this.lookUpView) {
                    this.lookUpView.standards.each(function (obj) {
                        self.selectedNodesCollection.add(obj);
                    });
                }
                console.log("rendering to classification");
                console.log(this.selectedNodesCollection);
                
                if(this.selectedNodesCollection){
                    this.selectedNodesCollection.each(function(obj){
                        self.promises.push(obj);
                    });
                }
                return;
            },
            restoreTaxonomy:function(){
                this.selectedNodesCollection.reset();
                
                for (var i = $(this.promises).length - 1; i >= 0; i--) {
                    this.selectedNodesCollection.add(this.promises[i]);
                }
            },

            enableSave: function() {
                this.saveButton.removeAttr('disabled');
                this.saveButton.removeClass('disabledSave');
            },

            enableAddnewSubject: function () {
                $(this.addSubjectBtnId).removeClass("btnAddAnotherSub");
                $(this.addSubjectBtnId).addClass("btnAddAnotherSub_enabled");
                $(this.addSubjectBtnId).removeAttr("disabled");
            },

            disableAddnewSubject: function (buttonId) {
                $(this.addSubjectBtnId).removeClass("btnAddAnotherSub_enabled");
                $(this.addSubjectBtnId).addClass("btnAddAnotherSub");
                $(this.addSubjectBtnId).attr('disabled', 'disabled');
            },

            enableSubtopic: function () {
                $("#btn-disable").hide();
                $("#slct_sub_top").show();
            },

            disableSubtopic: function (id) {
                $("#btn-disable" + id).show();
                $("#slct_sub_top" + id).hide();
            },

            enableLookup: function () {
                $(this.lookupBtnId).removeAttr('disabled').removeAttr('title').css('cursor', 'pointer');
            },

            disableLookup: function (id) {
                $(this.lookupBtnId + id).attr('disabled', 'disabled').attr('title', 'Select MATH or ENGLISH to enable').css('cursor', 'no-drop');
            },

            addNewSubject: function (defaultSubject, selectedSubtopics) {
                var self = this;
                constants.eventbus.trigger("enableSave");
                if (this.subjectCount >= 8) {
                    alert("Cannot add more than 9 subjects");
                    this.disableAddnewSubject();
                    return;
                }
                try{
                    var idDiv=$('div.subject')[$('div.subject').length-1].id;
                    var lstid=idDiv.substring(idDiv.lastIndexOf('_')+1,idDiv.length);
                }catch(e){}
                this.subjectCount++;
                var id=this.subjectCount;
                if(lstid&&lstid!=null)
                    id=parseInt(lstid)+1;             
                if (typeof defaultSubject != 'string' || !defaultSubject instanceof String)
                    var defaultSubject = null;

                this.addNewSubjects = new NewSubject({
                    subjects: this.subjects,
                    id: id,
                    defaultSubject: defaultSubject,
                    selectedSubtopics: selectedSubtopics
                });

               
                this.addNewSubjects.on('remove', this.removeSubject, this);
                this.disableAddnewSubject();
            },

            checkSubjectrepeat: function (val, id, event) {
                if (id > 0) {
                    if ($(this.subjectId).text().trim() == val)
                        this.alreadyExist(id);
                    this.checkOtherSubject(id, val);
                } else
                    this.checkOtherSubject(id, val);
            },

            checkOtherSubject: function (id, val) {
                for (var k = 1; k <= this.subjectCount; k++) {
                    if (k != id) {
                        if ($(this.subjectId + k).text().trim() == val)
                            this.alreadyExist(id);
                    }
                }
            },

            //TO CHECK IF SUBJECT IS ALREADY SELECTED
            alreadyExist: function (id) {
                if (id == 0){
                    $(this.subjectId).text('Select');
                    // $("#slct_subjects ul.dropdown li").removeClass("selected");
                }
                else{
                    // $("#new_slct_subjects"+ id +" ul.dropdown li").removeClass("selected");
                    $(this.subjectId + id).text('Select');
                }
                $('#subtopic_span' + id).text('Select');
                
               
                alert("Subject already selected, select another Subject");

            },

            getValues: function (contentTypeMetaDataDTO, model) {
                this['meta-attribute-list'] = contentTypeMetaDataDTO;
                //this.model = model;

                //get subject and subtopic
                this.getSubject(this.subjectId, 'subject');
                this.getSubject(this.subtopicId, 'subtopic');
                if (this.selectedNodesCollection) {
                    model.set({
                        "taxonomy-node-list": this.selectedNodesCollection
                    });
                }
            },

            getSubject: function (option, type) {
                var dto = null;
                var metaDataId = $(option).attr('metadataId');
                try {
                    dto = _.find(this['meta-attribute-list'], function (o) {
                        return o['attribute-description-id'] == metaDataId;
                    });
                } catch (e) {}

                if (!dto) {
                    dto = {
                        "attribute-description-id": metaDataId
                    };
                    this['meta-attribute-list'].push(dto);
                }
                if ($(option).text().trim().toUpperCase() != 'SELECT' || this.subjectCount > 0) {
                    dto['value-list'] = this.getAllsubjects(option, type);
                     this.subjectsAdded = dto['value-list'];
                } else {
                    dto['value-list'] = [];
                } // end if
            },

            getAllsubjects: function (option, type) {
                var value = null;
                var self = this;
                if (type == 'subject') {
                    value = $(option).text();

                    if (value.toUpperCase() == 'SELECT')
                        value = null;
                    if (this.subjectCount > 0) {
                        for (var k = 0; k < this.subjectCount; k++) {
                            try{
                                var divId=$('div.subject')[k].id;
                                var id=divId.substring(divId.lastIndexOf('_')+1,divId.length);
                            }catch(e){}
                            if ($(this.subjectId + id).text().trim().toUpperCase() == 'SELECT') {

                            } else if (value == null)
                                value = $(this.subjectId +id).text();
                            else
                                value = value + ',' + $(this.subjectId + id).text();
                        }
                        //  this.subjectCount = this.subjectCount-count;
                    }
                    return value.split(',');
                } else {
                    value = [];
                    if ($(option).text().trim().toUpperCase() !== 'SELECT')
                        $.each($(option).text().split(','), function (index, val) {
                            if (val.trim().toUpperCase() !== 'SELECT') {
                                value.push(self.subjectsAdded[0]+"|"+val);
                            }

                        });
                    if (this.subjectCount > 0) {
                        for (var k = 0; k < this.subjectCount; k++) {
                            try{
                                var divId=$('div.subject')[k].id;
                                var id=divId.substring(divId.lastIndexOf('_')+1,divId.length);
                            }catch(e){}
                            if ($(this.subtopicId + id).text().trim().toUpperCase() !== 'SELECT') {

                                $.each($(this.subtopicId + id).text().split(','), function (index, val) {
                                    if (val.trim().toUpperCase() !== 'SELECT') {
                                        value.push($('#subject_span'+id).text().trim()+"|"+val);
                                    }

                                });
                            }

                        }
                    }
                    return value;
                }
            },

            //TO SET ALL VALUES IN EDIT MODE
            setValues: function (model) {
                this.metadata = model.toJSON()['meta-attribute-list'];                 
                try {
                    this.subtopics = _.find(this.metadata, function (o) {
                        return o.name == 'subtopic'
                    })['value-list'];
                } catch (e) {};
                this.setSubject(this.subjectId, 'subject');
              //  this.highlightSubtopics(this.subtopicId, 'subtopic');
                this.setNodelist(model);
            },

            setSubject: function (option, type) {
                try {
                    var val = _.find(this.metadata, function (o) {
                        return o.name == type
                    })['value-list'];
                    if (val&& val.length > 0&& val[0]!=null)
                        this.renderSubjects(option, val, type);

                } catch (e) {};
                this.enableAddnewSubject();
            },

            renderSubjects: function (option, val, type) {
                var self = this;
                this.enableSubtopic();
                $(option).text(val[0]);
                var idd=$('#divClassification').find('li').filter(function() {
                    return $(this).text() === val[0];
                });
                var id = idd[0].id;
                $(option).val(id);
                if (!this.subtopicsView)
                    this.subtopicsView = new SubtopicsView();
                if(this.subtopics && this.subtopics.length > 0){
                  this.subtopicsView.selectedSubtopics = this.getSubtopicsForSubject(val[0]);  
                }
                this.subtopicsView.refresh(id);
                //constants.eventbus.trigger('fetchSubtopics', id);
                for (var k = 1; k < val.length; k++){
                    this.addNewSubject( val[k], this.getSubtopicsForSubject(val[k]) );
                }                    

                setTimeout(function () {
                    for (var k = 0; k < val.length; k++) {
                        var id = $('span:contains(' + val[k] + ')').attr('id').match(/\d/);
                        if (id == null)
                            id = [""];

                        if (val[k] === "Math" || val[k] === "Language Arts") {
                            $("#slct_sub_top_ul" + id[0]).hide();
                        } else
                            self.disableLookup(id[0]);
                        // $('#slct_subjects' + id + ' ul li:contains(' + val[k].trim() + ')').addClass('selected');
                        // $('#new_slct_subjects' + id + ' ul li:contains(' + val[k].trim() + ')').addClass('selected');
                    }
                }, 500);

            },

            getSubtopicsForSubject:function(subject){
                var arr = [];
                try{
                    for(var k=0; k< this.subtopics.length;k++){
                        if(this.subtopics[k].substring(0, this.subtopics[k].indexOf('|') ).trim() == subject)
                        arr.push(this.subtopics[k].substring(this.subtopics[k].indexOf('|')+1 ).trim());
                    }
                }catch(e){};                
                return arr;
            },

            highlightSubtopics: function (option, type) {
                var self = this;
                try {
                    var val = _.find(this.metadata, function (o) {
                        return o.name == type
                    })['value-list'];
                } catch (e) {};
                setTimeout(function () {
                    if (val && val.length > 0) {
                        for (var i = 0; i < val.length; i++) {
                            try {
                                var spanid = $('li:contains("'+val[i].trim()+'")')[0].parentElement.previousElementSibling.id;
                                $('li:contains("'+val[i].trim()+'")').addClass('selected');
                                var spanText = $('span#' + spanid).text().toUpperCase();
                                if (spanText == "SELECT")
                                    $('span#' + spanid).text(val[i]);
                                else
                                    $('span#' + spanid).text($('span#' + spanid).text() + "," + val[i]);
                            } catch (e) {};
                        }
                    }
                },1000);
            },

            setNodelist: function (model) {
                var self = this;
                this.nodelist = new Backbone.Collection(model.toJSON()['taxonomy-node-list']);
                if (this.nodelist) {
                    this.nodelist.each(function (obj) {
                        self.selectedNodesCollection.add(obj);
                    })
                }
            },

            bindRenderingStandards: function () {
                var self = this;
                this.$("#desc_classification").html("");
                this.selectedNodesCollection.bind('add', function (model) {

                    self.stdView = new StandardNodeView({
                        model:model
                    });
                    var r = self.stdView.model.attributes.rating;
                    var mid = self.stdView.model.id;
                    // nodeId = self.stdView.model.attributes.id;
                   
                    // this.$('#facebox label[for$="'+clusterId+'"]').hide();
                    
                    // for (var i = self.stdView.model.collection.length - 1; i >= 0; i--) {

                    // $(':radio[id="rating'+r+mid+'"]').attr('checked', 'checked');
                    // };
                    self.stdView.on('deleteAddedNode', function () {
                        this.$el.remove();
                        self.selectedNodesCollection.remove(this.model);
                    });
                    this.$("#desc_classification").append(this.stdView.render().el);
                    $('#divClassification :radio[id="rating'+r+mid+'"]').attr("checked","checked");
                    // $('#divClassification label[for="rating'+r+mid+'"]').trigger("click");

                    if(self.stdView.model.attributes.node_type){
                        console.log("HAVE NODE TYPE CLUSTER");
                        this.$('#desc_classification label[for$="'+mid+'"]').hide();
                        console.log(this.$('#desc_classification label[for$="'+mid+'"]').parent().parent());
                        this.$('#desc_classification label[for$="'+mid+'"]')
                                        .parent().find('span.nodeText').css("width","83%");
                    }
                }, this);
            },

            close: function () {
                $(this.subjectId).text('Select');
                this.subjectCount = 0;
                $(this.subtopicId).text('Select');
                this.subtopicsView.clearSubtopics();
                $(this.newSubjectDiv).html('');
                $(this.nodelistId).empty('');
                this.disableLookup('');
                this.disableSubtopic('');
                if (this.selectedNodesCollection)
                    this.selectedNodesCollection.reset();

            }


        }); // end  view

        return Classification;

    });