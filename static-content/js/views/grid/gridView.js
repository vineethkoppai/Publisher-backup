define([
'jquery',
'underscore',
'backbone',
'models/dla',
'text!templates/gridViewDLA.html',
'views/loadingIconView',
'views/grid/dla',
'collections/dlaCollection',
'constants',
'datejs',
'messages',
'ellipsis'],

function (
$,
_,
Backbone,
DLA,
dlaTemplate,
LoadingIconView,
DLAView,
DLACollection,
constants,
date,
messages) {


        var GridviewContainer = Backbone.View.extend({
            el: '#dlaContainer',
            events: {
                
            },

            initialize: function (options) {
                this.$scrollableDiv = $('#scrollableDiv');

                var self = this;
                //this.atBottom = false;
                this.$scrollableDiv.scroll(function () {
                    var $this = $(this);
                    var height = this.scrollHeight - $this.innerHeight(); // Get the height of the div
                    var scroll = $this.scrollTop(); // Get the vertical scroll position
                    if (scroll >= (height - 3)) {
                        var addHieght = height + 50;
                        self.reachedBottom();
                    }
                });

                this.collection = options.collection;
                //ON PAGE LOAD DO A FETCH WITH RESET TO LOAD DATA TO PAGE
                this.collection.bind('reset', this.render, this);
                //ON SCROLL DOWN MORE MODELS GOING TO ADD TO COLLECTION, SO APPEND THEM TO DOM
                this.collection.bind('add', this.rendeDLA, this);
                this.$noResultGrid = $('#noResultGrid');
            },

            render: function () {
                var self = this;
                var location=window.location.href;
                if (this.collection.length < 1) {
                    var errorMsg = "No results were found for ";
                    if (this.collection.searchValue && this.collection.searchValue.length > 0)
                        errorMsg = errorMsg +'"'+ this.collection.searchValue+'" in '+messages[location.substring(location.lastIndexOf('/')+1)];
                    else
                        errorMsg = errorMsg + "filter " + messages[this.collection.filterValue];
                    
                    errorMsg=decodeURIComponent(errorMsg);
                    this.$noResultGrid.html(errorMsg);
                } else {
                    this.$noResultGrid.html('');
                    this.collection.each(function (dla) {
                        self.rendeDLA(dla);
                    });
                }

                var filter = window.location.href.substring(window.location.href.lastIndexOf('/') + 1);
                $('.th-list').removeClass('selected');
                $('.th-list[name="' + filter + '"]').addClass('selected');

                if (this.loadingIcon)
                    this.loadingIcon.hide();

                // ENTER KEY ON CHAT WINDOW
                // $("#chatTextArea").keypress(function (e) {
                //     if (e.keyCode == 13) {
                //         console.log('You pressed enter!');
                //         e.preventDefault();
                //         console.log($(this).val());
                //         $("#chatMsgs").append("<div class='current-msg'><span>Me : </span>"+$(this).val()+"</div>")
                //         $(this).val('');
                //     }
                // });
                // $("#chatClose").click(function(e){
                //     self.closeChatWindow();
                // });
                // $("#chatMinimize").click(function(e){
                //     self.minimizeChatWindow();
                // });
            },

            // closeChatWindow:function(){
            //     console.log("closeChatWindow");
            //     $('div#chatWindow').hide();
            // },
            // minimizeChatWindow:function(){
            //     console.log("minimizeChatWindow");
            //     $("#chatMsgBottomContainer").toggleClass("minimize-chat");
            // },

            rendeDLA: function (dla) {
                if (!_.isEmpty(dla.toJSON())) {
                    var dlaView = new DLAView({
                        model: dla
                    });
                    this.$el.append(dlaView.render().el);
                   
                    var title=$("div#"+dla.toJSON().id+" p.titleGrid").text();
                    var words=title.split(" ");
                if(words.length>1)
                    $("div#"+dla.toJSON().id+" p.titleGrid").ellipsis();
                    this.$noResultGrid.html('');
                } else {
                    this.$noResultGrid.html('No results were found for ' + this.collection.searchValue);
                }
            },           
          
            //giving hyphen to broken words
            hyphenatingTitle:function(id){
                $("#"+id+" .titleGrid").each(function () {  
                    var wordtext = $(this).text().split(" ");
                    $(this).html("");
                    var currentDiv = $(this);
                    var altstring = "";
                    var textchar = "";
                    var count=0;
                    $.each(wordtext, function (m, element) {
                        if (element != "") {
                            $("#"+id+" .titleGrid").html(element);
                                textchar = element.split("");
                                $.each(textchar, function (n, elem) {
                                    if (elem != textchar.length-1) {
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
                this.$scrollableDiv.hide();
                this.unbind();
                this.undelegateEvents();
            },

            show: function () {
                this.$el.show();
                this.$scrollableDiv.show();
                this.delegateEvents();
            },

            setHeight: function (h) {
                // this.$el.height(h-800);
            },

            getHeight: function () {
                return this.$el.height()
            },

            reachedBottom: function () {
                var self = this;
                this.collection.pageIndex++;
                if (!this.loadingIcon) {
                    this.loadingIcon = new LoadingIconView();
                    this.$el.append(self.loadingIcon.render().el);
                }

                this.loadingIcon.show();
                self.fetchMoreDLA();
            },

            fetchMoreDLA: function (options) {
                var self = this;
                if (this.collection.length == this.collection.maxCount + this.collection.maxCount * (this.collection.pageIndex - 1)) {
                    this.collection.fetch({
                        add: true
                    }).complete(function () {
                        self.loadingIcon.hide();
                    });
                } else {
                    this.collection.pageIndex--;
                    self.loadingIcon.hide();
                }
            },

            //to remove rendered DLAs frpm DOM
            remove: function () {
                this.$scrollableDiv.off('scroll');
                this.unbind();
                this.undelegateEvents();
                $('#dlaContainer').empty()
            }

        });
        return GridviewContainer;
    });