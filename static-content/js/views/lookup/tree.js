define(
[
'jquery',
'underscore',
'backbone',
'jqueryui',
'jquerylayoutlatest',
'constants',
'jstree'
],

function(
$,
_,
Backbone,
jqueryui,
jquerylayoutlatest,
constants,
jstree
) {


    var Tree = Backbone.View.extend({
        tagName: "div",
        events: {
          // 'click #rateArrow':'slideRateWindow'
        },

        initialize: function(options) {
          console.log("initialize tree");
          console.log(options);
            this.model = options.model;
            this.treeType = options.treeType;
            _.bindAll(this, "filterGrade", "filterDomain");
            if(options.vent) {
                options.vent.bind("filterGrade", this.filterGrade);
                options.vent.bind("filterDomain", this.filterDomain);
            }
            // event from lookup view,to hide cluster level checkbox
            constants.eventbus.on('hideCheckbox', this.hideCheckboxes, this);
        },
      
        filterGrade: function(data) {
            if (data.treeType == 'MATH') {

                var id;

                $(".jstree-default").hide();
                for(var i = data.minGrade; i <= data.maxGrade; i++) {
                    if(i === 0) {
                        id = $("li[description=K]").attr('id');
                        $("#_" + id).show();
                    }
                    else {
                        id = $("li[description=" + i + "]").attr('id');
                        $("#_" + id).show();
                    }
                }
            }
            else {
                // $("li[description=GRADES]").hide();
                $("li[description=K]").show();

                for(var j = 0; j <= 12; j++) {
                    $("li[description=" + j + "]").show();
                    if(j < data.minGrade || j > data.maxGrade) {
                        if(j === 0) $("li[description=K]").hide();
                        else $("li[description=" + j + "]").hide();
                    }
                }
                // for(var i=data.minGrade; i<=data.maxGrade; i++ ){
                //     if(i==0)
                //         $("li[description=K]").show();
                //     else
                //        $("li[description="+i+"]").show();
                // }
            }
            // this.$el.jstree('search',data.minGrade );
            // $("div.jstree li").hide();
            //$("div.jstree li a[class=jstree-search]").parents("div.jstree li").show();
            // this.enableSubtree($(".jstree-search"))
        },

        filterDomain: function(domain) {
            if(domain == 'All') {
                $("div.jstree li").show();
            } else {
                this.$el.jstree('search', domain);
                $("div.jstree li").hide();
                $("div.jstree li a[class=jstree-search]").parents("div.jstree li").show();

                $("div.jstree li a[class=jstree-search]").parent().find('li').each(function() {
                    $(this).show();
                });

            }
        },

        keywordSearch: function(keywords) {
            var self = this;
            $.each(keywords, function(index, value) {
                self.$el.jstree('search', keywords[index]);
            });
            $("div.jstree li a[class=jstree-search]").addClass('keyword-search');
        },

        enableSubtree: function(elem) {
            elem.siblings("ul:first").find("li").show();
            return this.correctNode(elem.siblings("ul:first"));
        },

        correctNode: function(elem) {
            var child, children, last, _j, _len1, _results;
            last = elem.children("li").eq(-1);
            last.addClass("jstree-last");
            children = elem.children("li");
            _results = [];
            for(_j = 0, _len1 = children.length; _j < _len1; _j++) {
                child = children[_j];
                _results.push(this.correctNode($(child).children("ul:first")));
            }
            return _results;
        },

        slideRateWindow:function(){
          $("#ratingUtility").hide("slide", { direction: "right" }, 2000);  
        },
        render: function() {
          console.log("render tree");
            var tot_node_count = 0;
            if(this.model.attr && this.model.attr.id) {
                var treeId = this.model.attr.id;
                this.treeId = treeId;
                this.$el.attr('id', "_" + treeId);
            }

            var self = this;
            this.$el.jstree({
                "core": {
                    "html_titles": true
                },
                
                "plugins": ["themes", "json_data","checkbox","ui", "search", "adv_search"],
                 "checkbox": {
                    override_ui:true,
                        real_checkboxes: true,
                        two_state: true
                     },

                "json_data": {
                    "data": [this.model],
                    "ajax": {
                        "type": 'GET',
                        "url": function(node) {
                            self.isParentChecked = node.hasClass('jstree-checked');
                            var nodeId = node.attr('id'); //id="kit1"
                            var taxonomyId = node.attr('taxonomyid');
                            return constants.getTaxonomy + taxonomyId + '/nodes/' + nodeId;
                        },
                        "success": function(data) {
                            _(data.response['taxonomy-node-list']).each(function(obj) {    
                                    console.log("::success::tree");console.log(obj);
                                  obj.attr = {};
                                  obj.attr.id = obj.id;
                                  obj.attr.name = obj.data;
                                  obj.attr.description = obj.description;
                                  obj.attr.taxonomyId = obj['taxonomy-id'];
                                  obj.attr.parentNodeId = obj['parent-node-id'];

                                 $.each(obj.children,function(i,obj){
                                          obj.state = 'closed';
                                          obj.attr = {};
                                          obj.attr.id = obj.id;
                                          obj.attr.name = obj.data;
                                          obj.attr.description = obj.description;
                                          obj.attr.taxonomyId = obj['taxonomy-id'];
                                          obj.attr.parentNodeId = obj['parent-node-id'];

                                           if(obj['is-leaf-node'] === true) {
                                                delete obj.state;
                                                obj.data = obj.data + '<br>' + "<div class='node_Description'>" + obj.attr.description + "</div>";
                                            }
                                 });   
                               
                            });
                          //  self.hideCheckboxes();
                            return data.response['taxonomy-node-list'];
                        }
                    },
                    "search": {
                        "show_only_matches": true
                    }

                    // "core" : {"html_titles" : true},
                    //"plugins" : [ "themes", "json_data" ],
                }
            }).bind("loaded.jstree", function(event, data) {
                // To hide root nodes text
                //  $("a:contains('Root')").css("visibility","hidden")
                // Need to find other way to hide rootNodeName Any1 knows ?
                // To hide - icon
                $("li#" + treeId + " .jstree-icon").first().hide();
                // $(".jstree-last .jstree-icon").first().hide();
                // to hide check
                $("li#" + treeId + " .jstree-checkbox").first().hide();
                $("div.jstree li#"+treeId+" > a").addClass('root_node');

                //if tree == ela, hiding grades checkbox
                if(self.treeType==constants.ela){
                    $("li#" + treeId ).find('ins.jstree-checkbox').hide();
                    $("li#" + treeId +' a').addClass('cluster');
                }
            }).bind("check_node.jstree", function(event, data) {
                var obj =  $(data.rslt.obj);
                console.log("check_node");
                console.log(obj.find("li").length);
                if(obj.find("li").length>0){
                    $(data.rslt.obj).find("li").each( function( idx, listItem ) {
                        console.log("check cluster node");
                        var child = $(listItem); // child object
                        var cluster = null;
                        
                        if( !child.hasClass('jstree-leaf') )
                            child.removeClass('jstree-unchecked').addClass('jstree-checked'); 
                        cluster = child.parent().parent()[0].id;
                        self.trigger('standardSelection',self.treeType, cluster);
                    });
                }
                else    
                    self.trigger('standardSelection',self.treeType);
                // Count of selected leaf node
                // if(obj.hasClass('jstree-leaf')){
                //   tot_node_count = tot_node_count + 1;  
                // }
                // $(".total-count").text(tot_node_count);

                //WHEN U CHECK PARENT, CHECK ALL ITS CHILDREN
                

                // Showing the rating window if any leaf node is checked
                // if($(data.rslt.obj[0]).hasClass("jstree-leaf jstree-checked"))
                //  $('.rating-uti-main').show();
                // Showing and hiding rating window on click on arrow
                // $(".rate-arrow").bind("click",function(){
                //    $(".rating-utility").toggleClass("hideThis");
                //    $(".rating-uti-main").toggleClass("removeBorder");
                //    $(this).toggleClass("moveToright");
                // });
            }).bind("uncheck_node.jstree", function(event, data) {
                //WHEN U UNCHECK THE CLUSTUR, UNCHECK THE DOMAN
                console.log("UNCHECK NODE");

                var obj = $(data.rslt.obj);
                console.log(obj.find("li").length);
                console.log(obj[0].children);

                // if(obj.find("li").length<=0)
                    // self.trigger("standardUnSelection",obj);
                // Hiding the rating window if all the leaf nodes are unchecked
                // if(obj.hasClass('jstree-leaf')&&obj.hasClass('jstree-unchecked')){
                //  if(!$(obj.parent().find("li")).hasClass('jstree-checked')&&tot_node_count<=0){
                //     $('.rating-uti-main').hide();
                //  }
                // }
                // var childCount = 0;
                // else{
                    obj.find("li").each( function( idx, listItem ) {
                      var child = $(listItem); // child object
                      // Counting the selected leaf nodes under cluster
                      // if(child.hasClass('jstree-checked')){
                      //  childCount = childCount+1; 
                      // }
                      console.log("inside cluster");
                      this.cluster = null;
                      this.cluster = child[0].id;
                      console.log(this.cluster);
                      child.removeClass('jstree-checked').addClass('jstree-unchecked');
                      // self.trigger("standardUnSelection",child,this.cluster);  
                      self.trigger("standardUnSelection",child[0].id);
                  });   

                  if(!this.cluster){
                    console.log("HAS CLUSTER");console.log(this.cluster);
                    self.trigger("standardUnSelection",obj[0].id);
                  }
                    
                
                
                // Setting the total count to the rating page
                // tot_node_count = tot_node_count-(childCount);
                //  $(".total-count").text(tot_node_count);
                if(!obj.hasClass('jstree-leaf') || obj.attr('node_type')=='CLUSTER'){
                   console.log("unchecked cluster");console.log(obj.attr('node_type'));
                   obj.parents("li .jstree-checked").removeClass('jstree-checked').addClass('jstree-unchecked');
                }
            }).bind("open_node.jstree", function(event, data) {
              //IF PARENT IS SELECTED, ON OPENING IT CHECK THE CHILDREN WHICH ARE COMING FROM AJAX LOAD
              self.trigger("selectStandardonTree",this);
              
              // self.trigger('standardSelection',self.treeType, cluster);
              // self.trigger('standardSelection',self.treeType);
               var obj = $(data.rslt.obj)
               // var cluster = obj[0].childNodes[3].childNodes;
               // console.log(cluster);

               if(self.isParentChecked){
                 obj.find("li").each( function( idx, listItem ) {
                    var child = $(listItem); // child object
                    var cluster = null;
                    cluster = child.parent().parent()[0].id;
                    
                    if( !child.hasClass('jstree-leaf') )
                      child.removeClass('jstree-unchecked').addClass('jstree-checked');

                    self.trigger('standardSelection',self.treeType, cluster);
                 });
               }else {
                   if(obj.hasClass('jstree-checked') && obj.hasClass('jstree-unchecked')){
                        obj.removeClass('jstree-checked');
                     }

                    obj.find("li").each( function( idx, listItem ) {
                     var child = $(listItem); // child object
                     if(child.hasClass('jstree-checked') && child.hasClass('jstree-unchecked')){
                        child.removeClass('jstree-checked');
                     }
                  });
               }

               self.isParentChecked = false;
               //TO MAKE ONLY STANDARDS SELECTABLE IN ELA
                if(self.treeType !='MATH'){
                    $("li ul > li" ).find('ul > li').find('ins.jstree-checkbox').hide();
                    $("li ul > li" ).find('ul > li > a').addClass('cluster');

                    $('ul > li.jstree-leaf').find('ins.jstree-checkbox').show();
                    $('ul > li.jstree-leaf > a').removeClass('cluster');

                    var ulTag=$('.root_node').nextElementSibling;
                    $(ulTag +'>li').find('ins.jstree-checkbox').hide();
                }    
            });
            return this;
        },
        // openNodeOnstdRender:function(){
        //     $.jstree._reference(myTree).open_node("#Node_001",function(){;},false);
        //     var closedParents = $("#Node_003").parents("li.jstree-closed");
        //     for(var i=closedParents.length-1;i>=0;i--){
        //       this.pleaseOpen($(closedParents[i]));
        //     }
        // },
        // pleaseOpen:function(thisNode){
        //     if(typeof thisNode=="undefined") return;
        //     if(thisNode.hasClass("jstree-leaf") || thisNode.hasClass("jstree-open") ) return;
        //     $.jstree._reference(myTree).open_node(thisNode,function(){;},true);
        // },
        hideCheckboxes:function(){
            if(this.treeType !='MATH'){
                 var self = this;
                setTimeout(function(){
                    $("li ul > li" ).find('ul > li').find('ins.jstree-checkbox').hide();
                    $("li ul > li" ).find('ul > li > a').addClass('cluster');

                    $('ul > li.jstree-leaf').find('ins.jstree-checkbox').show();
                    $('ul > li.jstree-leaf > a').removeClass('cluster');

                    var ulTag=$('.root_node').nextElementSibling;
                    $(ulTag +'>li').find('ins.jstree-checkbox').hide();
               },0);  
            }           
        }
    }); // end view

    return Tree;
});
