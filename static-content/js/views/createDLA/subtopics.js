define([
'jquery',
'underscore',
'backbone',
'constants'],

function (
$,
_,
Backbone,
constants) {

        var SubtopicView = Backbone.View.extend({
            tagName: "li",
            template: _.template("<a href='#' class='dropdown-li' ><%=name %></a>"),
            events: {
                // 'click #slct_sub_top': 'select_sub'
            },

            initialize: function () {
                _.bindAll(this, 'render');
            },

            render: function () {
                $(this.el).attr('id', this.model.get('id')).html(this.template(this.model.toJSON()));
                return this;
            }
        });




        var Subtopics = Backbone.View.extend({

            el: "#slct_sub_top_ul",

            events: {
                'click #slct_sub_top ul.dropdown li': 'multiSubtopic'
            },

            initialize: function () {
                this.seriesSelected = [];
                _.bindAll(this, 'addOne', 'render', 'refresh', 'bindMultiselect');
                constants.eventbus.on('fetchSubtopics', this.refresh);
                constants.eventbus.on('clearAll', this.clearAll, this);
                // EVENT COMING FROM EDIT DLA TO SET THE SUBTOPICS
                constants.eventbus.on('setSubtopics', this.setSubtopics, this);
                var Subtopic = Backbone.Model.extend();
                var Subtopics = Backbone.Collection.extend({
                    url: '',
                    model: Subtopic,
                    parse: function (data) {
                        return data.response['subtopic-list']
                    }
                });

                this.collection = new Subtopics();
                this.collection.bind('reset', this.render, this);


                // this.render();
            },

            multiSubtopic: function (target) {
                var self = target.currentTarget;
                if (this.seriesSelected[0] && this.seriesSelected[0].toUpperCase() == 'SELECT' && this.seriesSelected.length == 1)
                    this.seriesSelected = [];
                $(self).toggleClass("selected");
                if ($(self).hasClass('selected')) {
                    this.seriesSelected.push($(self).text());
                    $("#slct_sub_top").trigger('click');
                    $('#subtopic_span').text(this.seriesSelected);
                } else {
                    var seriesToRemove = $(self).text();
                    $("#slct_sub_top").trigger('click');

                    this.seriesSelected.splice(this.seriesSelected.indexOf(seriesToRemove), 1);
                    $('#subtopic_span').text(this.seriesSelected);
                }
                if (this.seriesSelected.length == 0) {
                    $('#subtopic_span').text('Select');
                    // $('#subtopic_span').attr("title", "SELECT");
                }
                 // else
                //     $('#subtopic_span').attr("title", this.seriesSelected);

                $("#btn_save").removeAttr('disabled');
                $("#btn_save").removeClass('disabledSave');
                //TRIGGER THE EVENT TO ENABLE SAVE BTN
                constants.eventbus.trigger('enableSave');
            },


            render: function () {
                var self = this;
                $(this.el).empty();
                this.subtopics = new Array();
                this.collection.each(this.addOne);
                if(this.subtopics.length > 0){
                    $(this.el).parent().children(':first-child').text(this.subtopics.join(', '));
                }
                this.selectedSubtopics = [];  
                this.isRendered = true;
                setTimeout(function () {
                    self.seriesSelected = $('#subtopic_span').text().split(',');
                }, 1000);
                $('#slct_subjects ul.dropdown li').bind('click', function () {
                    self.clearAll();
                });
            },

             addOne: function (subtopic) {
                var arr = new Array();
                $(this.el).append(new SubtopicView({
                    model: subtopic
                }).render().el);
                if(this.selectedSubtopics && _.indexOf(this.selectedSubtopics, subtopic.get('name')) > -1){
                    $('li:contains("'+subtopic.get('name')+'")').addClass('selected');
                    this.subtopics.push(subtopic.get('name'));
                };                

                $("#slct_sub_top li").click(function () {
                    $("#subtopic_span").text($(this).text());
                    $("#subtopic_span").val($(this).attr('id'));
                });
            },

            refresh: function (subjectId, divId) {
                var self = this;
                if (!subjectId) {
                    this.collection.url = constants.getSubtopics + $('#subject_span').val() + "/subtopic";
                } else {
                    this.collection.url = constants.getSubtopics + subjectId + "/subtopic";
                }

                this.collection.fetch().complete(function () {
                    if (divId)
                        self.bindMultiselect(divId);
                })

            },           

            addAll: function () {
                this.collection.each(this.addOne);
            },

            clearSubtopics: function () {
                delete this.subtopics;
                delete this.selectedSubtopics;
                $(this.el).empty();
            },

            bindMultiselect: function (id) {
                var subject = $("#subject_span" + id).text().substring(0, 7).toUpperCase().trim();
                $('#subtopic_span' + id).bind('click', function () {
                    if (subject == constants.math.toUpperCase() || subject == constants.ela.toUpperCase() || subject == 'WORLD L' || subject == 'BRAIN G')
                        $('#slct_sub_top_ul' + id).hide();
                    else
                        $('#slct_sub_top_ul' + id).show();
                });
                if (!seriesSelected)
                    var seriesSelected = [];

                $('#slct_sub_top' + id + ' ul.dropdown li').bind('click', function (target) {
                    var self = target.currentTarget;
                    var me = this;

                    seriesSelected = $('#subtopic_span' + id).text().split(',');

                    if ($('#subtopic_span' + id).text().toUpperCase() == "SELECT")
                        seriesSelected = [];

                    $(self).toggleClass("selected");
                    if ($(self).hasClass('selected')) {
                        seriesSelected.push($(self).text());
                        $("#slct_sub_top" + id).trigger('click');
                        $('#subtopic_span' + id).text(seriesSelected);
                    } else {
                        seriesToRemove = $(self).text();
                        $("#slct_sub_top" + id).trigger('click');
                        seriesSelected.splice(seriesSelected.indexOf(seriesToRemove), 1);
                        $('#subtopic_span' + id).text(seriesSelected);
                    }
                    if (seriesSelected.length == 0) {
                        $('#subtopic_span' + id).text('Select');
                    }

                    $("#btn_save").removeAttr('disabled');
                    $("#btn_save").removeClass('disabledSave');
                    //TRIGGER THE EVENT TO ENABLE SAVE BTN
                    constants.eventbus.trigger('enableSave');
                })

            }, // bind multiselect

            // TO USE ON EDIT DLA TO SET SUBTOPICS
            setSubtopics: function (val, id) {
                var self = this;
                $('#subtopic_span' + id).text(val);
                var _id = $('li:contains(' + val + ')').attr('id');
                $('#subtopic_span' + id).val(_id);
                var arr = val.split(',');

                setTimeout(function () {
                    for (var k = 0; k < arr.length; k++) {
                        $('ul#slct_sub_top_ul' + id + ' li:contains(' + arr[k].trim() + ')').addClass('selected');
                        this.seriesSelected.push(arr[k].trim());
                    }
                }, 500);
                // this.seriesSelected=arr;
            },

            clearAll: function () {
                this.seriesSelected = [];
            }

        });

        return Subtopics;

    });