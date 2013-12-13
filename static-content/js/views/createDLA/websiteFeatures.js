//VIEW FOR WEBSTE FEATURES SECTION INSIDE FORM
define([
'jquery',
'underscore',
'backbone',
'constants',
'text!templates/createDLA/websiteFeatures.html',
'views/createDLA/bulletView'  ],

function(
$,
_,
Backbone,
constants,
template,
bulletView  ) {

        var WebsiteFeatures = Backbone.View.extend({

            el: '#divWebsiteFeatures',
            tagName: "div",
            template: _.template(template),

            events: {
                'click #divWebsiteFeatures ul.dropdown li': 'toggleColor'
            },

            initialize: function(options) {
                this.model = options.model;
                this.mode = 'create';
                this.activityId = '#activity_span';
                this.difficultyId = '#difficulty_span';
                this.languagesId = '#language_span';
                this.restrictionId = '#restriction_span';
                this.pluginId = '#plugin_span';
                this.audioSupportName = 'radioAutosupport';
                // this.acctReqdName = 'radioAcctrequired';
                this.ipadRequiredName = 'radioWorksOnIpad';
                this.multiPlayerName = 'radioMultiplayer';
                this.render();
                this.activity_array = [];
                this.language_array = [];
                this.plugins_array = [];
                this.restriction_array = [];
                this.bindMultiselect("#slct_activity", this.activityId, this.activity_array);
                this.bindMultiselect("#slct_languages", this.languagesId, this.language_array);
                this.bindMultiselect_restriction("#slct_plug_ins", this.pluginId, this.plugins_array);
                this.bindMultiselect_restriction("#slct_restrictions", this.restrictionId, this.restriction_array);
            },

            render: function() {
                var self = this;
                this.$el.append(this.template({
                    model: this.model,
                    constants: constants
                }));
                new DropDown($('#slct_activity'));
                new DropDown($('#slct_difficulty'));
                new DropDown($('#slct_languages'));
                new DropDown($('#slct_restrictions'));
                new DropDown($('#slct_plug_ins'));
                $('#slct_difficulty ul.dropdown li').bind('click', function() {
                    self.toggleColor(this, "#slct_difficulty");
                });
            },

            toggleColor: function(tag, divId) {
                var $tag = $(tag),
                    selectedText = $tag.text().trim();
                if ($tag.hasClass("selected") && $tag.text().trim() == selectedText) {
                    $tag.removeClass("selected");
                    $tag.parent().siblings().text("Select");
                } else {
                    $tag.parent().find('li').removeClass('selected');
                    $tag.addClass("selected");
                }
            },

            bindMultiselect_restriction: function(dropdown, span, array) {
                var self = this;
                var dropdownLi = $(dropdown + ' ul.dropdown li');
                $(dropdown + ' ul.dropdown li').bind("click", function() {
                    var spanText = $(this).text().trim();
                    $(this).toggleClass("selected");
                    if (spanText == "None") {
                        if ($(this).hasClass("selected")) {
                            array = ["None"];
                            dropdownLi.removeClass('selected');
                            $(dropdown + ' ul.dropdown li:contains("None")').addClass('selected');
                        } else {
                            array = [];
                        }
                        $(dropdown).trigger("click");
                    } else {
                        if ($(this).hasClass("selected")) {
                            array.push(spanText);
                            if (_.contains(array, "None")) {
                                array.splice(array.indexOf("None"), 1);
                                $(dropdown + ' ul.dropdown li:contains("None")').removeClass('selected');
                            }
                        } else {
                            var seriesToRemove = spanText;
                            array.splice(array.indexOf(seriesToRemove), 1);
                            $(this).removeClass("selected");

                            if (array.length <= 0)
                                array = [];
                        }
                        $(dropdown).trigger("click");
                    }
                    if (array.length <= 0) {
                        $(span).text("Select");
                    } else {
                        $(span).text(array);
                    }
                });
            },
            bindMultiselect: function(dropdown, span, arr) {
                $(dropdown + ' ul.dropdown li').bind("click", function() {
                    $(this).toggleClass("selected");
                    if ($(this).hasClass("selected")) {
                        arr.push($(this).text().trim());
                        $(dropdown).trigger("click");
                        $(span).text(arr);
                    } else {
                        seriesToRemove = $(this).text();
                        $(dropdown).trigger('click');
                        arr.splice(arr.indexOf(seriesToRemove), 1);
                        $(span).text(arr);
                    }
                    if (arr.length == 0) {
                        $(span).text('Select');
                    }
                });
            },

            setDefaults: function() {
                if (this.mode == 'create') {
                    $('input:radio[name=radioAutosupport]')[1].checked = true;
                    $('input:radio[name=radioMultiplayer]')[1].checked = true;

                    $("#slct_plug_ins ul.dropdown").find("li:contains('None')").trigger('click');
                    $("#slct_restrictions ul.dropdown").find("li:contains('None')").trigger('click');
                    $("#slct_languages ul.dropdown").find("li:contains('English')").trigger('click');
                    $("#slct_difficulty ul.dropdown").find("li:contains('No Levels')").trigger('click');
                }
            },

            //TO SET ALL VALUES IN EDIT MODE
            setValues: function(metadata) {
                this.metadata = metadata;
                this.setDropdown(this.activityId);
                this.setDropdown(this.difficultyId);
                this.setDropdown(this.languagesId);
                this.setDropdown(this.restrictionId);
                this.setDropdown(this.pluginId);

                this.setRadioOption(this.audioSupportName);
                //   this.setRadioOption(this.acctReqdName);
                this.setRadioOption(this.multiPlayerName);
                this.setRadioOption(this.ipadRequiredName);
            },

            setDropdown: function(option) {
                var metaDataId = $(option).attr('metadataId');
                var isMultivalued = $(option).attr('is-multivalued')
                try {
                    if (isMultivalued)
                        var options = _.find(this.metadata, function(o) {
                            return o['attribute-description-id'] == metaDataId
                        })['value-list'];
                    else
                        var options = _.find(this.metadata, function(o) {
                            return o['attribute-description-id'] == metaDataId
                        }).value.split(',');
                    if (options.length > 1) {
                        $(option).empty();
                        for (var k = 0; k < options.length; k++) {
                            if (k == options.length - 1)
                                $(option).append(options[k]);
                            else
                                $(option).append(options[k] + ',');
                            $(option).parent().find('li:contains("' + options[k] + '")').addClass('selected');
                        }
                    } else {
                        $(option).text(options[0]);
                        $(option).parent().find('li:contains("' + options[0] + '")').addClass('selected');
                    }

                    this.setArray(option, options);
                } catch (e) {};
            },

            //TO SET THE VALUES OF MULTISELECT INTO THE ARRAYS
            setArray: function(option, val) {
                if (option === this.activityId) {
                    for (var k = 0; k < val.length; k++)
                        this.activity_array.push(val[k]);
                } else if (option === this.languagesId) {
                    for (var k = 0; k < val.length; k++)
                        this.language_array.push(val[k]);
                } else if (option === this.pluginId) {
                    for (var k = 0; k < val.length; k++)
                        this.plugins_array.push(val[k]);
                } else if (option === this.restrictionId) {
                    for (var k = 0; k < val.length; k++)
                        this.restriction_array.push(val[k]);
                }
            },

            setRadioOption: function(option) {
                var metaDataId = $('input[name=' + option + ']').attr('metadataId');
                try {
                        var val = _.find(this.metadata, function(o) {
                            return o['attribute-description-id'] == metaDataId
                        }).value;
                     } catch (e) {};

                    if (val == 'true') {
                        $('input:radio[name=' + option + ']')[0].checked = true;
                    }else {
                        $('input:radio[name=' + option + ']')[1].checked = true;
                    }               
            },

            close: function() {
                $(this.activityId).text('Select');
                $(this.difficultyId).text('Select');
                $(this.languagesId).text('Select');
                $(this.pluginId).text('Select');
                $(this.restrictionId).text('Select');
                this.activity_array.length = 0;
                this.language_array.length = 0;
                this.restriction_array.length = 0;
                this.plugins_array.length = 0;
            }


        }); // end  view

        return WebsiteFeatures;

    });