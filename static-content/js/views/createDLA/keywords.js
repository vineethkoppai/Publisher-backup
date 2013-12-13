//VIEW FOR KEYWORDS DIV INSIDE FORM
define([
'jquery',
'underscore',
'backbone',
'text!templates/createDLA/keywords.html',
'views/createDLA/keywordView',
'collections/keywordCollection'
],

function(
$,
_ ,
Backbone,
keywordsTemplate,
KeywordView,
keywordsCollection
 ) {

var Keywords  = Backbone.View.extend({

    el:'#divKeywords',
    tagName: "div",
    template:_.template(keywordsTemplate),

    events:{  
        'click #btn_addKeyword'    : 'addKeyword',
        'keypress':'addKeywordOnPress'
    },

    initialize: function(options) {
        this.keywordsId =  '#addKeyWords';
        this.keywordsTxt = '#addKeyWordTxt';
        this.keywords = new keywordsCollection();            
        this.render();
        this.keywords.on('add', this.renderKeyword, this);
        this.keywords.on('render', this.renderKeywords, this); 
    },

    render: function() {
        this.$el.append(this.template);
    },  

    addKeywordOnPress:function(e){
        if(e.keyCode==13)
            this.addKeyword();
    },

    // function to  add each key word
    addKeyword: function() {
        var self = this;
        //if user is adding keywords create a collection and bind the render event to it
        try{
            if($(this.keywordsTxt).val().trim() !== '') {
                this.keywords.add(new Backbone.Model({
                    name: $(this.keywordsTxt).val()
                }));              
            }
            this.setTextBoxes(this.keywordsTxt,'');
        
        }catch(e){};

    },

    //SET KEYWORDS IN EDIT MODE
    setKeywords:function(keywords){
        var self =this;
        if(keywords && keywords.length>0) {
            var arr = [];
            $.each(keywords, function(index, value) {
                arr.push({name:value});
            });

            this.keywords.add(arr);
        } 
   },

   //TO RENDER KEYWORDS FROM COLLECTION
   renderKeywords:function(){
        var self = this;
        this.keywords.each(function(keyword) {           
            self.renderKeyword(keyword);             
        });
   },

   //TO RENDER A KEYWORD WHEN ADDED TO COLLECTION
   renderKeyword:function(keyword){
      var self = this,
          keywordView = new KeywordView({
          model:keyword
      });

      keywordView.on('deleteKeyword', function() {
                    this.$el.remove();
                    self.keywords.remove(this.model);
                });
        this.$("#addKeyWords").prepend(keywordView.render().el);

   },
    

    setTextBoxes:function(id,val){
        $(id).val(val);
        $(id).trigger('keydown');
    },

    close:function(){
        $(this.keywordsId).empty();
        this.setTextBoxes(this.keywordsTxt,'');
        this.keywords.reset();
    }

 
 });// end comments view

return Keywords;

});