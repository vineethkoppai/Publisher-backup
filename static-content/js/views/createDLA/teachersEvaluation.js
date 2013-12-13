//VIEW FOR TEACHER EVAlUATION DIV INSIDE FORM
define([
'jquery',
'underscore',
'backbone',
'constants',
'text!templates/createDLA/teachersEvaluation.html',
'views/createDLA/bulletView'],

function (
$,
_,
Backbone,
constants,
template,
bulletView   ) {

        var TeacherEvaluation = Backbone.View.extend({

            el: '#divTeachersEvaluation',
            tagName: "div",
            template: _.template(template),

            events: {
                'click #btn_addBullet': 'addBullet',
                'keyup': 'addBulletOnEnter',
                'keydown': 'addBulletOnEnter'
            },

            initialize: function (options) {
                this.model = options.model;
                this.mode = 'create';
                this.teachesContentName = 'radioTeacherscontent';
                this.bloomsTaxonomyId = '#blooms_span';
                this.watStudentsDo = '#txt_WatShdDo';
                this.bulletsId = '#div_studentLearn';
                this.bulletTxtId = '#txt_addBulletTxt';
                this.blooms = '#slct_blooms';
                this.feedBack = '#slct_feedback';
                this.feedBackSpan = '#feedback_span';
                this.$saveBtn =  $('#btn_save');
                this.feedBackArray = [];
                this.bullets = new Backbone.Collection();
                this.render();
                this.bindRenderingBullet();
                this.bindMultiselect(this.feedBack, this.feedBackSpan, this.feedBackArray);
            },

            render: function () {
                var self = this;
                this.$el.append(this.template({
                    model: this.model,
                    constants: constants
                }));
                new DropDown($(this.blooms));
                new DropDown($(this.feedBack));
                $(this.blooms + ' ul.dropdown li').bind('click', function () {
                    self.deselectOption(this, self.blooms);
                });
            },

            //multiselect for dropdown
            bindMultiselect: function (dropdown, span, array) {
                var self = this;
                var dropdownLi = $(dropdown + ' ul.dropdown li');
                $(dropdown + ' ul.dropdown li').bind("click", function () {
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


            deselectOption: function (tag, divId) {
                var selectedText = $(tag).text().trim();
                if ($(tag).hasClass("selected") && $(tag).text().trim() == selectedText) {
                    $(tag).removeClass("selected");
                    $(this.bloomsTaxonomyId).text("Select");
                } else {
                    $(divId + ' ul li').removeClass('selected');
                    $(tag).addClass("selected");
                }
            },
            //setting default values 
            setDefaults: function () {
                if (this.mode == 'create') {
                    try {
                        $('input:radio[name=' + this.teachesContentName + ']')[1].checked = true;
                    } catch (e) {};
                    $(this.feedBack + " ul.dropdown").find("li:contains('None')").trigger("click");

                }
            },

            addBulletOnEnter: function (event) {
                if (event.keyCode == 13)
                    this.addBullet();

            },

            addBullet: function () {
                var self = this;
                //if user is adding keywords create a collection and bind the render event to it
                try {
                    if ($(this.bulletTxtId).val().trim() !== '') {
                        this.bullets.add(new Backbone.Model({
                            name: $(this.bulletTxtId).val().trim()
                        }));
                        this.setTextBoxes(this.bulletTxtId, '');
                    } else
                        this.setTextBoxes(this.bulletTxtId, '');


                } catch (e) {};
            },

            getWhatStudentsDO: function (contentTypeMetaDataDTO) {
                var val = $(this.watStudentsDo).val().trim();
                var dto = null;
                if (val !== null &&     val.trim().length > 0) {
                    var metadataId = $(this.watStudentsDo).attr('metadataid');
                    try {
                        dto = _.find(contentTypeMetaDataDTO, function (o) {
                            return o["attribute-description-id"] == metadataId;
                        });
                        if (!dto) {
                            dto = {
                                "attribute-description-id": metadataId
                            };
                            dto.value = val;
                            contentTypeMetaDataDTO.push(dto);
                        } else
                            dto.value = val;

                    } catch (e) {
                        console.log("exception here");
                    }
                } // end if
            },
            //setting values for all fields in edit mode
            setValues: function (metadata) {
                this.metadata = metadata;
                this.setRadioOption();
                this.setWhatStudentsDo();
                this.setBullets();
                this.setDropdown(this.bloomsTaxonomyId);
                this.setDropdown(this.feedBackSpan);
            },

            setRadioOption: function () {
                var metaDataId = $('input[name=' + this.teachesContentName + ']').attr('metadataId');
                var val = null;
                try {
                    val = _.find(this.metadata, function (o) {
                        return o["attribute-description-id"] == metaDataId
                    }).value;
                } catch (e) {};
                if (val == 'true') {
                    $('input:radio[name=' + this.teachesContentName + ']')[0].checked = true;
                } else {
                    $('input:radio[name=' + this.teachesContentName + ']')[1].checked = true;
                }
            },
            //set All drop down values in edit mode
            setDropdown: function (option) {
                var metaDataId = $(option).attr('metadataId');
                var isMultivalued = $(option).attr('is-multivalued');
                try {
                    if (isMultivalued)
                        var options = _.find(this.metadata, function (o) {
                            return o['attribute-description-id'] == metaDataId
                        })['value-list'];
                    else
                        var options = _.find(this.metadata, function (o) {
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
            setArray: function (option, val) {
                if (option === this.feedBackSpan) {
                    for (var k = 0; k < val.length; k++)
                        this.feedBackArray.push(val[k]);
                }                 
            },
            setWhatStudentsDo: function () {
                var val = "";
                var metaDataId = $(this.watStudentsDo).attr('metadataId');
                try {
                    var val = _.find(this.metadata, function (o) {
                        return o["attribute-description-id"] == metaDataId
                    }).value;
                } catch (e) {};
                this.setTextBoxes(this.watStudentsDo, val.trim());
            },

            setBullets: function () {
                this.bulletsArray = null;
                var  self = this;

                var metaDataId = $(this.bulletsId).attr('metadataId');
                try {
                    this.bulletsArray = _.find(this.metadata, function (o) {
                        return o["attribute-description-id"] == metaDataId
                    })['value-list'];
                } catch (e) {};

                if (this.bulletsArray && this.bulletsArray.length > 0) {
                    for (var k = 0; k < this.bulletsArray.length; k++) {
                        self.bullets.add({
                            name: this.bulletsArray[k]
                        });
                    };
                }
            },

            setTextBoxes: function (id, val) {
                $(id).val(val);
                $(id).trigger('keydown');
            },

            bindRenderingBullet: function () {
                var self = this;
                this.bullets.bind('add', function (model) {
                    var bView = new bulletView({
                        model: model
                    });

                    bView.on('deleteAddedBullet', function () {
                        this.$el.remove();
                        self.bullets.remove(this.model);
                        self.$saveBtn.removeAttr('disabled');
                        self.$saveBtn.removeClass('disabledSave');
                        if(self.bullets.length==0)
                            self.bulletsArray.length = 0;
                    });
                    this.$(this.bulletsId).append(bView.render().el);
                }, this);
            },

            clearDropdowns: function () {                
                $(this.feedBackSpan).text('Select');
                $(this.bloomsTaxonomyId).text('Select');
                this.feedBackArray.length = 0;
            },

            close: function () {
                this.clearDropdowns();                
                this.setTextBoxes(this.watStudentsDo, '');
                this.setTextBoxes(this.bulletTxtId, '');
                $(this.bulletsId).empty();
                this.bullets.reset();
            }


        }); // end  view

        return TeacherEvaluation;

    });