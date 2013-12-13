define([
'jquery',
'underscore',
'backbone',
'models/dla',
'text!templates/gridViewDLA.html',
'constants',
'datejs'],

function (
$,
_,
Backbone,
DLA,
dlaTemplate,
constants,
date) {

        var DLAView = Backbone.View.extend({
                tagName: "div",
                className: "span2 thumbnail dla dlaBg",
                template: dlaTemplate,

                events: {
                    'click ': 'editDLA',
                    'mouseover' : 'showMouseOver',
                    'mouseleave'   : 'mouseoutInfo'
                },

                initialize: function (options) {
                    this.model = options.model;
                    this.model.bind('remove',this.clear, this);
                    this.model.bind('change', this.render, this);
                },

                render: function () {
                    var templ = _.template(this.template);
                    var dlaModel = this.model.toJSON(); 
                    var mydate = dlaModel['modified-date'] || dlaModel['created-date'];
                    var str = Date.parse(mydate.substring(0, 8)).toString("MM/dd/yy");
                    dlaModel['modified-date'] = str;
                   

                    dlaModel.imgurl = "imgs/thumbnail.gif";
                    if (dlaModel['meta-attribute-list'] && dlaModel['meta-attribute-list'].length > 0) {
                        try {
                            dlaModel.imgurl = _.find(dlaModel['meta-attribute-list'], function (obj) {
                                return obj.name == constants.thumbnailURL
                            }).value;
                            dlaModel.imgurl = dlaModel.imgurl+'?random='+Math.random();
                        } catch (e) {}
                    } else {
                        dlaModel.imgurl = "imgs/thumbnail.gif";
                    }

                    if (dlaModel.stage && dlaModel.stage.toUpperCase() == constants.error.toUpperCase()) {
                       // this.model.set('stage', constants.readyToReview);
                        dlaModel.imgurl = "imgs/ErrorUrlimg.png";
                    }
                    this.$el.attr('id', this.model.toJSON().id);
                    this.$el.html(templ({
                                model: dlaModel,
                                constants: constants
                            }));

                    return this;
                },

                editDLA: function (e) {
                    // $("div#" + this.model.toJSON().id).attr('name', 'grid');
                    if (e.target.className == 'pull-right bookMark') {
                        this.bookmark(e.target.id);
                    } else {
                        this.goTo("#editdla" + "/" + this.model.toJSON().id);
                    }

                },

                bookmark: function (id) {
                    if (this.model.toJSON().bookmarked) {
                        this.bookmarkAPI('DELETE', false);
                    } else {
                        this.bookmarkAPI('POST', true);
                    }
                },

                showMouseOver:function(e){
                    var that = this;
        
                    if(this.isHovered){                       
                        return;
                    }else{
                        this.isHovered = true;
                         var offset = $(e.currentTarget).offset(),                      
                             _window = $(window),
                             tootip = this.$('.mouse-info');

                         var dlaTop = this.$el.offset().top,
                             dlaHeight = this.$el.height()/2,
                             windowHeight =  _window.height(),
                             tooltipHeight = parseInt(tootip.css('height')),
                             tootipTop = dlaTop,
                             bottom = 'auto',
                             dlaLeft = this.$el.offset().left,
                             dlaWidth = this.$el.width()/2,
                             windowWidth =  _window.width(),
                             tooltipWidth = parseInt(tootip.css('width')),
                             tootipLeft = 'auto',
                             dlaContainerTop = $('#scrollableDiv').offset().top;                    
                       
                        if(windowHeight - dlaTop - dlaHeight > tooltipHeight ){  
                             tootipTop = dlaTop + dlaHeight;
                            if(tootipTop < dlaContainerTop)
                                tootipTop = dlaContainerTop;                                
                        }else{
                            tootipTop = 'auto';
                            bottom = 1;
                        }

                        if(windowWidth - dlaLeft - dlaWidth > tooltipWidth ){  
                             tootipLeft = dlaLeft + dlaWidth;
                        }else{
                            tootipLeft = dlaLeft + dlaWidth - tooltipWidth;
                        }


                        setTimeout(function(){
                            if(!that.isHovered)
                                return;
                            tootip
                                .css('top', tootipTop)
                                .css('left', tootipLeft) 
                                .css('bottom', bottom)                                               
                                .show(0);
                        },900)
                    }
                  
                },

                mouseoutInfo:function(){
                   this.$('.mouse-info').hide();
                   this.isHovered = false;
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
                                self.model.set({bookmarked:value})
                            },
                            error: function (e) {
                                console.log(e);;
                            }
                        });
                },

                clear:function(){
                    this.remove();
                }

            });

        return DLAView;

    });