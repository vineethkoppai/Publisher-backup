define([
'jquery',
'underscore',
'backbone',
'constants',
'text!templates/subnav.html',
'views/subnav/showallView',
'views/subnav/bulkUpload'  
],

function (
$,
_,
Backbone,
constants,
SubNavTemplate,
Showall,
BulkUpload) {

var SubNavView = Backbone.View.extend({
        el: '#subNavBar',
        tagName: "div",
        className: "top-nav navbar navbar-inner",
        template: _.template(SubNavTemplate),

        events: {
            'click #divCreateDLAIcon': 'createDLA',
            "click #selectGridView": "goToGridView",
            'click #selectListView': 'goToListView',
            'click .lence': 'searchDLA',
            'keypress': 'searchDLA',
            'mouseover .div_thumb':'hideAutoComplete',
            'mouseover #showALL':'hideAutoComplete',
            'click #bulkUploadBtn':'showBulkUpload',
            'mouseover #gridListFlip':'showGridListOption',
            'mouseleave #Grid_List':'hideGridListOption'
          
        },

        initialize: function (options) {
            _.bindAll(this, "showAllCount");
            constants.eventbus.on("refreshCount", this.showAllCount);
            
            if(options){
                this.model = options.model;
                this.model.bind('change', this.showSearchResultCount, this);
            }  
            this.$search =  this.$el.find('#search');        
            this.render();
            this.$searchResultCount = $('.search-result-count');
            this.$searchLoaderIcon =  $('.search-loader');
            this.$imgGridList = $('#img_gridList');
            this.$gridListOption = $('#grid_List_View');
        },

        render: function () {
            var self=this;
            this.$el.html(this.template);
            this.showAllCount();

            this.$el.find('#search').autocomplete({
               minLength: 0,
               source: constants.availableTags
            }).focus(function() {
               $(this).autocomplete('search', $(this).val())
            });

            this.userrole = $('#userrole').val();
            if(this.userrole!='Admin'){
              $('#bulkUploadBtn').css('display','none');
            }

        },

        hideAutoComplete:function(){
            if(this.$search.is(':focus'))
                this.$search.blur();
        },

        showAllCount: function () {
            if (this.showAll)
                delete this.showAll;
            this.showAll = new Showall();
        },

        showBulkUpload:function(){
            var self = this;
            if (!this.bulkUpload){
                this.bulkUpload = new BulkUpload();
                this.bulkUpload.on('complete', function(){
                    //THIS EVENT WILL BE LISTENED BY COLLECTION TO REFRESH
                    self.model.trigger('bulkupload');
                    //REFRESH SHOW ALL COUNT 
                    constants.eventbus.trigger('refreshCount');
                })
            }              
            this.bulkUpload.show();
        },


        //to remove sub nav bar
        hide: function () {
            this.$el.hide();
        },

        show: function () {
           var url = window.location.hash;
           if(url.indexOf('list')>0){
            this.$imgGridList.attr('src', 'imgs/iconList.png');
           }else{
            this.$imgGridList.attr('src', 'imgs/iconThumb.png');
           }
            this.$el.show();
        },
        //function binded to child view's event 
        goToGridView: function () {
            this.$imgGridList.attr('src', 'imgs/iconThumb.png');
            var url = window.location.href;  
            var filterVal = url.substring(url.lastIndexOf('/') + 1);
            this.goTo("#/grid/"+filterVal);
        },

        goToListView: function () {
            this.$imgGridList.attr('src', 'imgs/iconList.png');
            var url = window.location.href;  
            var filterVal = url.substring(url.lastIndexOf('/') + 1);
            var view = url.substr(url.indexOf('#')+1, url.indexOf('/')-1);
            if(view != 'list')
            this.goTo("//list/"+filterVal);
        },

        createDLA: function () {
            $('#iframe_dla').attr('src', '');
            this.goTo("#createdla");
        },

        searchDLA: function (e) {
            var input = this.$el.find('#search').val().trim();
            var val,result=false;

            if (e.keyCode == 13 || e.currentTarget.className.indexOf('lence') > -1) {
                for(var i=0;i<constants.availableTags.length;i++){
                    val=input.trim().substr(0,input.indexOf(':'))+':';
                    if(val && val==constants.availableTags[i])
                        result=true;                            
                }
                if(result){   
                    if(input.trim()==val)
                        alert("Insert a search value");
                    else
                        this.trigger('search',input);                            
                }else                          
                    this.trigger('search','title:'+input);                        
            }
        },

        searchOnClick: function () {
            var input = this.$search.val();
            this.goTo("#search/" + input);
        },

        showGridListOption:function(){
            if(!$.browser.msie)
                return;
            this.$gridListOption.show();
            this.$gridListOption.addClass('iefix');
            $('ul#Grid_List li.dropdown').addClass('ieLiDropdown');
            $('.cover').addClass('coverIe');                               
        },

        hideGridListOption:function(){
             if(!$.browser.msie)
                return;
              this.$gridListOption.hide();
              $('ul#Grid_List li.dropdown').removeClass('ieLiDropdown');
              $('.cover').removeClass('coverIe');
        },
        //TO SHOW LOADER ICON THEN RESULT COUNT ON SUBNAV WHEN SEACH/FILTER IS DONE
        showSearchResultCount:function(){
            var model = this.model.toJSON();
            if(model['num-results'] !== null ){
                this.$searchLoaderIcon.hide();
                this.$searchResultCount.text(this.model.get('num-results')+" results").show();
            }else if(model.isLoading ){
                 this.$searchLoaderIcon.show();
                 this.$searchResultCount.hide();
            }else{
                 this.$searchLoaderIcon.hide();
                 this.$searchResultCount.hide();
            }                       
        }

    });

return SubNavView;

    });