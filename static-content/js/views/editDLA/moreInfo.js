define([
'jquery',
'underscore',
'backbone',
'text!templates/moreinfo.html',
'models/moreinfo',
'constants'],

function (
$,
_,
Backbone,
moreInfoTemplate,
moreinfo,
constants) {


        var moreInfoNew = Backbone.View.extend({

            template: _.template(moreInfoTemplate),

            initialize: function (options) {
                var self = this;
                if(options.mode=='create'){
                    this.model = new moreinfo({
                        author: $('#user-disp').text()
                    });
                    this.render();
                    this.show();
                }else{
                    this.model = new moreinfo({
                                  dlaId: this.options.dla.id
                              });
                    this.model.fetch().complete(function(){self.show()});
                }
                 this.model.bind('change', this.render, this);
            },

            render: function () {
                var self = this;
                $('#moreInfoWrapper').html('');
                $('#moreInfoWrapper').append(this.template({
                    model: this.model.toJSON(),
                    constants: constants
                }));
                setTimeout(function () {
                    self.hyphenatingTitle();
                });
            },

            hyphenatingTitle: function () {

                $("#DLA_name").each(function () {
                    var wordtext = $(this).text().split(" ");
                    $(this).html("");
                    var currentDiv = $(this);
                    var altstring = "";
                    var textchar = "";
                    $.each(wordtext, function (m, element) {
                        if (element != "") {
                            $("#DLA_name").html(element);
                            textchar = element.split("");
                            $.each(textchar, function (n, elem) {
                                if (elem != textchar.length - 1) {
                                    if (n != 0) altstring += elem + "­";
                                    else altstring += elem;
                                }
                            });

                            altstring += " ";
                        }
                    });
                    $(this).html(altstring);
                });
            },

            hide: function () {
                this.$el.hide();
            },

            close: function () {
                $('#moreInfoWrapper').hide();
                $('.ui-layout-resizer-west-open').css('margin-left', '0');
                $('.ui-layout-center').css('margin-left', '0');
                $('.ui-layout-center').css('width', $('.ui-layout-center').width() + '+350px');
            },

            show: function () {
                $('div#DLA_name').text($('#txt_dlaName').val());
                this.hyphenatingTitle();
                $('#moreInfoWrapper').show();
                $('#moreInfoWrapper').css('margin-left', $('#createDLADiv').width());
                $('.ui-layout-resizer-west-open').css('margin-left', '350px');
                $('.ui-layout-center').css('margin-left', '350px');
                $('.ui-layout-center').css('width', $('.ui-layout-center').width() + '-350px');

                $('.ui-layout-toggler').bind('click', function () {
                    $('#moreInfoWrapper').hide();
                    $('.ui-layout-resizer-west-closed').css('margin-left', '0');
                    $('.ui-layout-center').css('margin-left', '0');
                    $('.ui-layout-center').css('width', $('.ui-layout-center').width() + '+350px');
                });
            },

            refresh:function(){
                    this.model.fetch();
            },

            clear: function () {}

        }); // end view


        return moreInfoNew;

    });