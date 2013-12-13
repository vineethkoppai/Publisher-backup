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
'views/list/listElement',
'messages',
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
constants,
DLAView,
messages) {



        // Container for ListElements
        var ListView = Backbone.View.extend({

            el: '#listViewContainer',
            template: _.template(listviewHeader),
            isFirstInit: false,

            events: {
                'click #chbx1': 'selectAllDLA',
                'mouseover .trh>th': 'showDeleteIcon',
                'mouseout  .trh>th': 'hideDeleteIcon',
                'click #deleteHeader': 'deleteSelectedDLA',
                'click tr.Trh th': 'sort'
            },

            initialize: function (options) {

                var self = this;
                this.filterPresent = false;
                this.headerCheckbox = '#chbx1';

                if (options) {
                    this.filterPresent = true;
                    this.options = options;
                }

                this.renderHeader();
                this.atBottom = false;
                this.collection = options.collection;
                this.collection.bind('reset', this.render, this);
                this.collection.bind('add', this.rendeDLA, this);
               // this.collection.bind('destroy', this.fetchNxtDla, this);
                this.pageIndex = 0;
                this.pageCount = 0;
                this.maxCount = 20;
                this.dlaCount = this.collection.length;
                $("#dlaContainer").hide();
                this.$noResultList = $('#noResultList');
            },

            showDeleteIcon: function () {
                this.$('#deleteHeader').show();
            },

            hideDeleteIcon: function () {
                this.$('#deleteHeader').hide();
            },

            renderHeader: function () {
                var self = this;
                this.$el.html(this.template);
                this.$chbxHeader = $('#chbx1');
            },

            render: function () {
                 var self = this;
                 var location=window.location.href;
                 this.hideSpinner();
                if(this.$chbxHeader.is(':checked'))
                    this.$chbxHeader.removeAttr('checked');
                if (this.collection.length < 1) {
                    var errorMsg = "No results were found for ";
                    if (this.collection.searchValue && this.collection.searchValue.length > 0)
                        errorMsg = errorMsg +'"'+ this.collection.searchValue+'" in '+messages[location.substring(location.lastIndexOf('/')+1)];
                    else
                        errorMsg = errorMsg + "filter " + messages[this.collection.filterValue];
                    errorMsg = decodeURIComponent(errorMsg);
                    this.$noResultList.html(errorMsg);
                    return;
                } else {
                    this.$noResultList.html('');
                    this.collection.each(function (dla) {
                        self.rendeDLA(dla);
                    });
                }


                setTimeout(function () {
                    if (!self.isFirstInit) {

                        //Calling only once. if called multiple times, will split the table again
                        self.isFirstInit = true;
                        $("#fixedTable").fixheadertable({
                            colratio: [40, 32, 32, 130, 130, 130, 160, 60, 86, 86, 93],
                            height: 574,
                            zebra: true,
                            resizeCol: true
                        });
                        $(".Trh th").removeClass('ui-widget-content');
                        $('.body').scroll(function () {

                            var $this = $(this);
                            var height = this.scrollHeight - $this.innerHeight(); // Get the height of the div
                            var scroll = $this.scrollTop(); // Get the vertical scroll position
                            if (scroll >= (height - 3)) {
                                var addHieght = height + 50;
                                self.reachedBottom();
                            }
                        });
                    }
                }, 200);
            },

            rendeDLA: function (dla) {
                if (!_.isEmpty(dla.toJSON())) {
                    this.$noResultList.html('');
                    var self = this;
                    var dlaView = new DLAView({
                        model: dla
                    });
                    //REGISTER A CHANGE FUNCTION SO WE CAN TOGGLE SELECT ALL CHECKBOX ON CHAMGE OF CHILD VIEW
                    dlaView.on('change', this.refreshHeader, this);
                    dlaView.on('destroyDLA', this.fetchNxtDla, this);
                    self.$('#tableBody').append(dlaView.render().el);
                }
            },

            //WHEN CHILD VIEW CHANGES REFRESH THE HEADER ACCORDINGLY
            refreshHeader: function () {
                if (this.collection.getCheckedCount().length !== this.collection.length) {
                    this.$chbxHeader.removeAttr('checked');
                } else {
                    this.$chbxHeader.attr('checked', 'checked');
                }
            },

            deleteSelectedDLA: function (dla) {
                this.selectedCount = this.collection.getCheckedCount().length;
                if (this.selectedCount < 1) {
                    alert("No items have been selected ");
                    return;
                }
                var self = this;
                jConfirm('Are you sure you want to delete ' + this.selectedCount + ' items', 'Confirmation Dialog', function (r) {
                    if (r == true) {
                        self.selectedDlas = self.collection.getCheckedCount().length;
                        $.each(self.collection.getCheckedCount(), function (index, value) {
                            if (constants.userRole.toUpperCase() == constants.author.toUpperCase()) {
                                if (value.toJSON().stage.toUpperCase() != constants.draft.toUpperCase() || value.toJSON().author.id != constants.userId) {
                                    alert(constants.errorOnDelete);
                                    return;
                                }
                            }
                            var url = constants.getConetnt + value.id;
                            value.url = url
                            value.destroy({
                                        success:function(){
                                           if(self.selectedDlas-1 == index){
                                                self.collection.clear();
                                                self.collection.fetch();
                                                constants.eventbus.trigger('refreshCount');
                                            }  
                                        }
                                     });                           
                        }); //END OF FOR EACH LOOP                          
                    }
                }); //JCONFIRM END
            },

            //TO SELECT ALL DLA ON CLCIK OF CHECKBOX ON HEADER
            selectAllDLA: function () {
                var val = $(this.headerCheckbox).is(':checked');
                this.collection.each(function (dla) {
                    dla.set('checked', val);
                });
            },

            reachedBottom: function () {
                var self = this;
                this.collection.pageIndex = this.collection.pageIndex + 1;
                this.collection.pageCount = this.pageIndex;
                this.maxCount = 20;
                this.showSpinner();               
                this.fetchMoreDLA();
            },

            showSpinner:function(){
                if (!this.loadingIcon) {
                    if (!this.loadingIcon) this.loadingIcon = new LoadingIconView();
                    this.$el.append(this.loadingIcon.render().el);
                }
                this.loadingIcon.show();
            },

            hideSpinner:function(){
                if(this.loadingIcon)
                this.loadingIcon.hide();
            },

            fetchMoreDLA: function (options) {               
                var self = this;
                if (this.collection.length == this.collection.maxCount + this.collection.maxCount * (this.collection.pageIndex - 1)) {
                    this.collection.fetch({
                        add: true
                    }).complete(function () {
                        self.hideSpinner();
                        self.refreshHeader();
                        self.atBottom = false;
                    });
                } else {
                    this.collection.pageIndex--;
                    this.hideSpinner();
                }
            },

            fetchNxtDla: function () {
                if (this.collection.length == this.collection.maxCount + this.collection.maxCount * (this.collection.pageIndex - 1)) {
                        var self = this;
                        this.collection.prevMaxCount = this.collection.maxCount;
                        this.collection.pageCount = (this.collection.pageIndex + 1) * this.collection.maxCount - 1;
                        this.collection.pageCount++;
                        this.collection.maxCount = 1;
                        this.collection.fetch({
                            add: true
                        }).complete(function () {
                            self.refreshHeader();
                            delete self.collection.pageCount;
                            self.collection.maxCount = self.collection.prevMaxCount;
                        });
                }              
            },

            hide: function () {
                this.$el.hide();
                $('#listViewWrapper').hide();
            },

            show: function () {
                this.$el.show();
                $('#listViewWrapper').show();
            },

            sort: function (e) {
                var header = $(e.currentTarget),
                    $obj   = $('tr.Trh th');              
                if (header.attr('value') && header.attr('value').length > 0) {
                    this.showSpinner();
                    this.sortBy = header.attr('value');
                    if (header.context.className.indexOf('headerSortUp') > 0) {
                        $obj.removeClass('headerSortDown headerSortUp');
                        header.removeClass('headerSortUp');
                        header.addClass('headerSortDown');
                        this.isAsc = false;
                    } else if (header.context.className.indexOf('headerSortDown') > 0) {
                        $obj.removeClass('headerSortDown headerSortUp');
                        header.removeClass('headerSortDown');
                        header.addClass('headerSortUp');
                        this.isAsc = true;
                    } else {
                        $obj.removeClass('headerSortDown headerSortUp');
                        header.addClass('headerSortUp');
                        this.isAsc = true;
                    }
                    this.collection.sort(this.sortBy, this.isAsc);
                }
            },

            remove: function () {
                $('#listViewContainer').empty();
            },

            resetToDefault:function(){
                $('tr.Trh th').removeClass('headerSortDown headerSortUp');                 
            }

        });

        return ListView;

    });