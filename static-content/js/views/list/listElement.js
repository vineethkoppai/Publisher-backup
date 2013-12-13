define([
'jquery',
'underscore',
'backbone',
'text!templates/listviewHeader.html',
'text!templates/listViewRows.html',
'views/loadingIconView',
'fixedHeader',
'models/dla',
'jqueryui',
'constants',
'jqueryfacebookalert'],

function (
$,
_,
Backbone,
listviewHeader,
ListViewRows,
LoadingIconView,
fixedHeader,
DLA,
jqueryui,
constants) { // view for a row

        var DLAView = Backbone.View.extend({

                tagName: "tr",
                className: "tableRow ui-state-active",
                template: ListViewRows,

                events: {
                    'mouseover': 'showDeleteIcon',
                    'mouseout': 'hideDeleteIcon',
                    'click td#title': 'editDLA',
                    'click .goldStar': 'bookmarkIt',
                    'click #hidden': 'deleteDLA',
                    'change input.childCheck': 'checkboxChange'

                },

                initialize: function (options) {
                    this.checkboxArray = [];
                    this.viewArray = [];
                    this.model.bind('change', this.render, this);
                    //WHEN MODEL IS DESTROYED REMOVE IT FROM DOM
                    this.model.bind('destroy', this.clear, this);
                    //WHEN MODEL IS REMOVED FROM THE COLLECTION, REMOVE IT FROM DOM
                    this.model.bind('remove', this.clear, this);
                },

                render: function () {
                    var self = this,
                        maxGrade = 12,
                        minGrade = 'K';
                    var templ = _.template(this.template);
                    var dlaModel = this.model.toJSON();
                     dlaModel.grade = minGrade + " - " + maxGrade;

                    if (dlaModel["meta-attribute-list"]) {
                        _(dlaModel["meta-attribute-list"]).each(function (obj) {
                            if (obj.name === 'subject') {
                                    dlaModel.subject = obj['value-list'].join(',');
                            } else if (obj.name === 'subtopic') {
                                    dlaModel.subtopic = obj['value-list'].join(',');
                            } else if (obj.name === constants.minGrade && obj.value !== null && obj.value != 0) {
                                minGrade = parseInt(obj.value);
                            } else if (obj.name === constants.maxGrade && obj.value !== null) {
                                maxGrade = parseInt(obj.value);
                            }
                        });
                        dlaModel.grade = minGrade + " - " + maxGrade;
                    }

                    dlaModel.status = dlaModel.stage.toUpperCase();
                    this.$el.html(templ({
                                model: dlaModel,
                                constants: constants
                            }));

                    if(dlaModel.checked){
                        $('#childCheckbox'+dlaModel.id).attr('checked','checked');
                    }else{
                         $('#childCheckbox'+dlaModel.id).removeAttr('checked');
                    }
                
                    return this;
                },

                editDLA: function () {
                    this.goTo("#editdla" + "/" + this.model.toJSON().id);
                },

                showDeleteIcon: function () {
                    this.$('td.fntsz').css('padding-left', '20px');
                    this.$('#hidden').show();
                    this.$('#editStatus').show();
                    this.$('.table-row').css({
                            color: '#000000'
                        });
                    var status = this.model.toJSON().stage;
                    status = status.toLowerCase();
                    if (status == 'ready to review' || status == 'ready to publish')
                        this.$('#editStatus').addClass('gotop');

                    this.$('#idd').addClass('increaseWidth');
                },

                hideDeleteIcon: function () {
                    this.$('#hidden').hide();
                    this.$('#editStatus').hide();
                    this.$('.table-row').css({
                            color: '#999999'
                        });
                },

                checkboxChange: function (options) {
                    this.model.set('checked', !this.model.get('checked'));
                    //CHILD EVENT LISTENED BY LIST VIEW TO CHANGE ITS HEADER
                    this.trigger('change');
                },

                bookmarkIt: function (e) {
                    var bookMarked = this.model.toJSON().bookmarked;
                    if (bookMarked) {
                        this.bookmarkAPI('DELETE', false);
                    } else {
                        this.bookmarkAPI('POST', true);
                    }
                },

                bookmarkAPI: function (type, value) {
                    var self = this;
                    var contentId = this.model.toJSON().id;
                    var url = constants.bookmark;
                    $.ajax({
                            type: type,
                            contentType: 'application/json',
                            url: url,
                            data: JSON.stringify({
                                    "content-id": contentId
                                }),
                            success: function (data) {
                                constants.eventbus.trigger('refreshCount');
                                self.model.set('bookmarked',value);
                            },
                            error: function (e) {}
                        });
                },

                deleteDLA: function () {
                    var self = this;
                    var url = constants.getConetnt + this.model.id;
                    if(constants.userRole.toUpperCase()==constants.author.toUpperCase() ){
                        if(this.model.toJSON().stage.toUpperCase() != constants.draft.toUpperCase() || this.model.toJSON().author.id != constants.userId){
                            alert("Author can only delete DLAs cretaed by him and its in draft mode");
                            return;
                        }
                    }

                    jConfirm('Are you sure you want to delete this item ?', 'Confirmation Dialog', function (r) {
                        if (r == true) {
                            self.model.destroy({
                                url: url,
                                success:function(){
                                    self.trigger('destroyDLA');            
                                    constants.eventbus.trigger('refreshCount');
                                    //MAKE RESULT COUNT TO SHOW A LESS NO (HACK !)
                                    var $searchCount = $('.search-result-count');
                                    var newCount = parseInt($searchCount.text().trim()) - 1;
                                    $searchCount.text(newCount+' results');
                                }                              
                            });   
                                              
                        }
                    });//JCONFIRM END                    
                },

                //METHOD TO CLEAR DLA FROM DOM ON DESTROY OF MODEL
                clear:function(){
                    this.remove();
                }

            });

        return DLAView;

    });