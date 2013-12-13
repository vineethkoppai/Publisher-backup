define([
'jquery',
'underscore',
'backbone',
'text!templates/addSubject.html',
'models/createDLAForm',
'views/createDLA/createDLA',
'views/createDLA/subtopics',
'views/createDLA/classification',
'constants'],

function (
$,
_,
Backbone,
addSubjectTemplate,
DLAForm,
createDLA,
SubtopicView,
ClassificationView,
constants) {


        var NewSubjects = Backbone.View.extend({

            template: _.template(addSubjectTemplate),

            initialize: function (options) {
                // DOM VARIABLES
                this.subjectSelector = '#subject_span';
                this.model = {};
                this.model.subjects = options.subjects;
                this.model.id = options.id;
                if (options.selectedSubtopics)
                    this.model.selectedSubtopics = options.selectedSubtopics;

                if (options.defaultSubject) {
                    this.defaultSubject = options.defaultSubject;
                    this.subjectId = _.find(options.subjects, function (subject) {
                        return subject.name == options.defaultSubject
                    }).id;
                } else {
                    this.subjectId = null;
                }

                this.render();
            },

            render: function () {

                var self = this;
                $('#addSubjectDiv').append(this.template({
                    model: this.model
                }));
                this.subtopics = new SubtopicView({
                    el: $('#slct_sub_top_ul' + this.model.id),
                    id: this.model.id
                })
                if (this.model && this.model.selectedSubtopics) {
                    this.subtopics.selectedSubtopics = this.model.selectedSubtopics;
                    delete this.model.selectedSubtopics;
                }

                new DropDown($('#new_slct_subjects_' + this.model.id));
                new DropDown($('#slct_sub_top' + this.model.id));

                $(".sub_red_icon").click(function (e) {
                    self.deleteSubject(e);
                });

                $('#new_slct_subjects_' + this.model.id + ' ul.dropdown li').bind('click', function () {
                    constants.eventbus.trigger('checkSubjectrepeat', $(this).text(), self.model.id);

                    // Highlighting the selected subjects in added subjects
                    // $('#new_slct_subjects'+self.model.id+' ul.dropdown li').removeClass('selected'); 
                    // $(this).toggleClass("selected");

                    if ($('#subject_span' + self.model.id).text().trim() == 'Select') {
                        $('#subject_span' + self.model.id).text('Select');
                        self.disableSubtopics();
                    } else {
                        var sub = $(this).text().substring(0, 7).toUpperCase().trim();
                        if (sub == constants.ela || sub == constants.math) {
                            self.enableLookupBtn();
                            // self.disableSubtopics();
                        } else if (sub == 'WORLD L' || sub == 'BRAIN G') {
                            self.disableSubtopics();
                        } else {
                            self.enaableSubtopics();
                            self.disableLookupBtn();
                        }

                        var subjectId = $(self.subjectSelector + self.model.id).val();
                        self.subtopics.refresh(self.subjectId || subjectId, self.model.id);
                        $('#subtopic_span' + self.model.id).text('Select');

                        var idDiv=$('div.subject')[$('div.subject').length-1].id;
                        var lstid=idDiv.substring(idDiv.lastIndexOf('_')+1,idDiv.length);
                        if(lstid==self.model.id)
                            self.enableAddAnother();
                        else
                            self.disableAddAnother();
                    }

                });

                // SET DEFAULT SUBJECT
                if (this.defaultSubject) {
                    var sub = this.defaultSubject.substring(0, 7).toUpperCase().trim();

                    this.enaableSubtopics();
                    $(this.subjectSelector + self.model.id).text(this.defaultSubject);
                    var id = $('li:contains(' + this.defaultSubject + ')').attr('id');
                    $(this.subjectSelector + self.model.id).val(id);
                    var subjectId = $(this.subjectSelector + self.model.id).val();
                    if (sub == constants.ela || sub == constants.math) {
                        this.enableLookupBtn();
                        self.subtopics.refresh(self.subjectId || subjectId, this.model.id);
                    } else {
                        self.subtopics.refresh(self.subjectId || subjectId, this.model.id);
                    }
                }

                //BIND ON CLICK EVENT FOR LOOKUP BUTTON
                $('#lookUpTaxonomy' + this.model.id).bind('click', function () {
                    self.triggerShowlookup();
                })
                this.subjectId = null;
            }, // end render

            //TO DELETE EACH ADDED SUBJECT 
            deleteSubject: function (e) {
                var self = this;

                if(e.target.className==="sub_red_icon"){
                  $('#new_slct_subjects_'+this.model.id).trigger("click");
                }
                jConfirm('Are you sure you want to delete this item', 'Confirmation Dialog', function (r) {
                    if (r == true) {
                        var idDiv=$('div.subject')[$('div.subject').length-1].id;
                        var lstid=idDiv.substring(idDiv.lastIndexOf('_')+1,idDiv.length);
                        var pidDiv=e.target.parentNode.id;
                        pidDiv=pidDiv.substring(pidDiv.lastIndexOf('_')+1,pidDiv.length);
                        if(lstid==pidDiv || $('#subject_span'+lstid).text().toUpperCase().trim()!='SELECT')
                            self.enableAddAnother();
                        else
                            self.disableAddAnother();
                        var parent_Node = e.target.parentNode;
                        // $(parent_Node).parents("div.main_addSub_Div").hide();
                        $(parent_Node).parents("div.main_addSub_Div").remove();
                        // CALL TO CLASSIFICATION.JS
                        self.trigger('remove');
                        $('#btn_save').removeAttr('disabled');
                        $('#btn_save').removeClass('disabledSave');
                    } 
                }); //JCONFIRM END
            },

            enableAddAnother:function(){
                $("#btn_anotherSubject").removeAttr("disabled");
                $("#btn_anotherSubject").removeClass("btnAddAnotherSub");
                $("#btn_anotherSubject").addClass("btnAddAnotherSub_enabled");
            },

            disableAddAnother:function(){
                $("#btn_anotherSubject").attr("disabled","disabled");
                $("#btn_anotherSubject").addClass("btnAddAnotherSub");
                $("#btn_anotherSubject").removeClass("btnAddAnotherSub_enabled");
            },

            enaableSubtopics: function () {
                $("#btn-disable" + this.model.id).hide();
                $("#slct_sub_top" + this.model.id).show();
            },

            disableSubtopics: function () {
                $("#btn-disable" + this.model.id).show();
                $("#slct_sub_top" + this.model.id).hide();
            },

            triggerShowlookup: function () {
                var subject = $(this.subjectSelector + this.model.id).text().substring(0, 7).trim().toUpperCase();
                if (subject != constants.math && subject != constants.ela) {
                    alert("Lookup available only for ELA and MATH");
                    return;
                } else {
                    //TRIGGER EVENT TO ENABLE SAVE BTN
                    constants.eventbus.trigger('enableSave');
                }
                var subjectId = $(this.subjectSelector + this.model.id).val();
                constants.eventbus.trigger('showLookupEvent', subject, self.subjectId || subjectId, this.model.id);
            },

            enableLookupBtn: function () {
                $("#lookUpTaxonomy" + this.model.id).removeAttr("disabled");
                $("#lookUpTaxonomy" + this.model.id).removeAttr("title");
                $("#lookUpTaxonomy" + this.model.id).css("cursor", "pointer");
            },
            disableLookupBtn: function () {
                $("#lookUpTaxonomy" + this.model.id).attr("disabled", "disabled");
                $("#lookUpTaxonomy" + this.model.id).attr("title", "Select MATH or ENGLISH to enable");
                $("#lookUpTaxonomy" + this.model.id).css("cursor", "no-drop");
            }




        }); // end view

        return NewSubjects;

    });