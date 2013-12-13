//VIEW FOR COMMENTS SECTION IN FORM
define(
['jquery',
'underscore',
'backbone',
'constants',
'text!templates/createDLA/comments.html'
],

function(
$,
_ ,
Backbone,
constants,
commentsTemplate
 ) {

var Comments  = Backbone.View.extend({

    el:'#divComments',
    tagName: "div",
    template:_.template(commentsTemplate),

    events:{  
     'click #btn_addComment'    : 'addComment',
     'keyup'                    : 'addCommentOnEnter'
    },

    initialize: function(options) {
      if(options)
        this.model = options.model;
      this.commentsId = '#addComments';
      this.comments = new Backbone.Collection();
      this.commentsTxtId='#txtComment';
      this.bindAddingComment();
      this.render();
    },

    render: function() {

      this.$el.append(this.template( {model:this.model, constants:constants} ));
    },

    addCommentOnEnter:function(event){
      if(event.keyCode == 13)
        this.addComment();
    },
    addComment: function() {
            //if user is adding keywords create a collection and bind the render event to it
            try{
            if($(this.commentsTxtId).val().trim() !== '') {
                this.comments.add(new Backbone.Model({
                    name: $(this.commentsTxtId).val()
                }));
                $(this.commentsTxtId).val('');
                $('#Count_left4').val('200');
            }

            else{
                $(this.commentsTxtId).val('');
                $('#Count_left4').val('200');
                 $('#Count_left4').text('200');
            }
          }catch(e){};
    },

    //SET COMMENTS IN EDIT MODE
    setComments:function(metadata){
      var val = null;
      var metadataId = $(this.commentsId).attr('metadataId');
      try{
           val = _.find(metadata, function(o){ return o['attribute-description-id'] == metadataId })['value-list'];
      }catch(e) {};  
      if(val && val.length > 0){
          for(var k=0;k < val.length;k++){
             this.comments.add({name:val[k]});
          }; 
      }    
    },

    //BIND RENDER EVENT WHEN U ADD KEYWORD TO COLLECTION
    bindAddingComment:function(){
         var self = this;
         this.comments.bind('add', function(model) {
                    self.cView = new CommentView({
                        model: model
                    });
                    self.cView.on('deleteAddedComment', function() {
                        this.$el.remove();
                        self.comments.remove(this.model);
                    });
                    this.$("#addComments").append(this.cView.render().el);
                }, this);
    },
    //CLOSE METHOD TO EMPTY THE INPUT BOX AND COLLECTION
    close:function(){
       $(this.commentsId).empty();
       $(this.commentsTxtId).val('');
       $(this.commentsTxtId).trigger('keydown');
       this.comments.reset();
    }

 
 });// end comments view

//VIEW FOR INDIVIDUAL COMMENT
var CommentView  = Backbone.View.extend({
  tagName: "div",
  className:"comment_Div",
  template:_.template("<div id='addedComment'><%= name %></div>"),

  render: function() {
    this.$el.append(this.template(this.model.toJSON()));
    return this;
  },

  deleteComment:function(){
        this.trigger('deleteAddedComment',this);
  }

});// end view

return Comments;

});