define([
'jquery',
'underscore',
'backbone',
'text!templates/lookup.html',
'text!templates/lookupBottom.html',
'text!templates/createDLA/standard.html',
'jqueryui',
'jquerylayoutlatest',
'constants',
'jstree',
'views/lookup/tree',
'models/treeSearch',
'views/createDLA/keywordView',
'views/spinner',
'facebox',
'models/standardModel',
// 'views/createDLA/descriptionView',
'views/lookup/standardNodeView',
'collections/standardsCollection',
'models/createDLAForm'],

function(
$,
_,
Backbone,
lookupTemplate,
lookupBottomTemplate,
StandardTemplate,
jqueryui,
jquerylayoutlatest,
constants,
jstree,
Tree,
SearchTree,
keywordView,
Spinner,
facebox,
Standard,
StandardView,
// StandardNodeView,
Standards,
CreateDLAForm) {


        var lookupView = Backbone.View.extend({
                el: 'body',
                template: _.template(lookupTemplate),
                bottomTemplate:_.template(lookupBottomTemplate),
                events: {
                    'click #standardSave': 'saveData',
                    'click #StandardCancel': 'closeBox',
                    'click #btn_addLookUp': 'addKeyWord',
                    'click .lookupLi': 'getStrand',
                    // 'keyup': 'loadUrl',
                    'click .rating-label':'enableSave'
                    // 'click div#searchResult .jstree-default a':'selectNode'
                },

                initialize: function (options) {
                    this.keywordsDiv = '#facebox #addKeyWords_Inside';
                    this.allStrand = 'liall';
                    this.vent = _.extend({}, Backbone.Events);
                    
                    this.model = options.model;

                    this.createDLAForm = new CreateDLAForm();
                    //ON SELECTION OF STANDRAD, ADD IT TO THE BOTTOM
                    
                    this.standards = new Standards();
                    this.standards.bind('add', this.renderStandard, this);
                    // this.standards.bind('remove', this.deselectStandard, this);
                    this.render();
                    this.checkedRadio = 0;
                },

                render: function () {
                    console.log("render lookup");
                    this.$('#faceboxLookup').html(this.template({
                                model: this.model.toJSON()
                            }));
                    this.selectedNodes = new Backbone.Collection();
                },  
                tooltip:function(){

                    var self = this;
                    $("#allStandards .icon-question-sign").popover({ 
                      delay:{ 
                                show: "800", 
                                hide: "800"
                            },
                      html : true,
                      trigger:'hover',
                      title:"Rating Scoring Guide",
                      placement:'top',
                      content:"<div class='row-fluid help-data'>"+
                                  "<div class='span3'><b>3</b>: Lorem ipsum dolor sit"+
                                    "amet, consectetur adipisicing elit."+
                                  "</div>"+
                                   "<div class='span3'><b>2</b>: Lorem ipsum dolor sit"+
                                    "amet, consectetur adipisicing elit."+
                                  "</div>"+
                                   "<div class='span3'><b>1</b>: Lorem ipsum dolor sit"+
                                    "amet, consectetur adipisicing elit."+
                                  "</div>"+
                                   "<div class='span3'><b>0</b>: Lorem ipsum dolor sit"+
                                    "amet, consectetur adipisicing elit."+
                                  "</div>"+
                                "</div>"
                    });
                },
                loadUrl: function (e) {
                    console.log("key pressed");
                    if (e.keyCode === 27){
                        console.log("key is = "+e.keyCode);
                        //TO ADD IFRAME CONTENT BACK TO DIV, THIS EVEN WILL BE LISTENED FROM CLASSIFICATION.JS
                        constants.eventbus.trigger('addIframeback');

                        this.trigger("restoreTaxonomy");
                    }
                    $(this).unbind('keyup.facebox');
                },

                showLookup: function (subject, subjectDivId, selectedNodes) {
                   
                    this.selectedNodesForTree = selectedNodes;
                    this.selectedNodesCopy = new Backbone.Collection();
                    console.log("showLookup in lookup");
                    console.log(this.selectedNodesForTree);
                    // this.checkedRadio = this.checkedRadio-1;
                    this.removedLabelCount = 0;
                    var self = this;
                    this.standards.reset();
                    this.subjectDivId = subjectDivId;
                    var self = this;
                    this.selectedVal = subject;
                    this.treeType = this.selectedVal.trim().toUpperCase();
                    //to avoid closing facebox when user clicks on the screen 
                    $.extend($.facebox.settings, {
                            modal: true
                        });
                    $(document).bind('loading.facebox', function () {
                         $(document).unbind('keydown.facebox');
                        $("#facebox_overlay").unbind("click").click(function () {
                            if (!$.facebox.settings.modal) {
                                $(document).trigger('close.facebox');
                            }
                        })
                    })

                    $.facebox({
                            div: '#faceboxLookup',
                            loadingImage: '../imgs/loading.gif',
                            closeImage: '../imgs/closelabel.png'
                        });

                    // give styles
                    $('.content').addClass("resizeLookUp");
                    $('.content').append(lookupBottomTemplate);
                    $('.content').attr('id', 'lookupID');

                    //load tree
                    // an object to communicate events between views via http://lostechies.com/derickbailey/2011/07/19/references-routing-and-the-event-aggregator-coordinating-views-in-backbone-js/
                    var treeData = this.model.toJSON().treeData;
                    _(treeData).each(function (obj) {
                        obj.state = 'open';
                        obj.attr = {};
                        obj.attr.id = obj.id;
                        obj.attr.name = obj.data;
                        obj.attr.description = obj.description;
                        obj.attr.taxonomyId = obj['taxonomy-id'];
                        obj.attr.parentNodeId = obj['parent-node-id'];
                        $.each(obj.children, function (i, obj) {
                            obj.children = null;
                            obj.state = 'closed';
                            obj.attr = {};
                            obj.attr.id = obj.id;
                            obj.attr.name = obj.data;
                            obj.attr.description = obj.description;
                            obj.attr.taxonomyId = obj['taxonomy-id'];
                            obj.attr.parentNodeId = obj['parent-node-id'];
                        });

                        this.treeView = new Tree({
                                model: obj,
                                vent: self.vent,
                                treeType: self.treeType
                            });
                        this.treeView.on('standardSelection', self.getCheckedNodes, self, self);
                        this.treeView.on("standardUnSelection", self.removeStandards, self, self);
                        this.treeView.on("selectStandardonTree", self.selectStandardonTree, self);
                        this.$('#facebox #treeViewDiv').append(this.treeView.render().el);
                    });

                    $("#facebox #slider-range1").slider({
                            // var mini=$( "#slider-range" ).slider( "values", 0 );
                            range: true,
                            min: 0,
                            max: 12,
                            values: [0, 12],
                            slide: function (event, ui) {
                                self.data = {
                                    minGrade: ui.values[0],
                                    maxGrade: ui.values[1],
                                    treeType: self.selectedVal.trim().toUpperCase()
                                };
                                self.toggleView();
                                self.vent.trigger("filterGrade", self.data);
                                // $( "#facebox #amount" ).val(  ui.values[ 0 ] + " - " + ui.values[ 1 ] );
                            }
                        });

                    // display domain or strand accordingly.
                    if (this.selectedVal.trim().toUpperCase() == 'MATH') {
                        $("#facebox #domainStrand").text("Domain");
                    } else {
                        $("#facebox #domainStrand").text("Strand");
                    };
                    // get subject from CreateDLA to lookup facebox
                    $("#facebox .displaySub").attr("value", this.selectedVal);

                    this.delegateEvents();
                    console.log("reset selectedNodes");
                    this.selectedNodes.reset();
                    // this.clonedCollection = new Backbone.Collection();
                    // this.standards.each(function(studentModel) {
                    //   this.clonedCollection.add(new Backbone.Model(studentModel.toJSON()));
                    // });
                    // console.log("TOTAL COLLECTION");
                    // console.log()

                    if(selectedNodes)
                        selectedNodes.each(function(node){
                            self.standards.add(node);
                            // $("ul li#"+self.standards.models[0].id).find(".jstree-checkbox").trigger("click");
                            // $('ul li#'+self.standards.models[0].id).parents().eq(2).find(".jstree-icon").click();  
                        })
                    
                    // var filtered = new Backbone.Collection(self.standards.filter(function(model) {
                    //     return model.get('type') === 'MATH';
                    // }));
                    
                    // if(filtered)
                    //     {
                    //         console.log("FILTERED");console.log(filtered);
                    //         filtered.each(function(node){
                    //            self.standards.add(node);
                    //         });
                    //     }

                    var title = $("#txt_dlaName").val();
                    if(title.length>0)
                        $("#facebox #activityName").text(title);
                    else
                        $("#facebox #activityName").text("Untitled activity");
                    this.tooltip();
                },
                                //METHOD TO ADD STANDARD TO BOTTOM WELL
                 renderStandard:function(standard){
                    console.log("renderStandard");console.log(standard.attributes.node_type);
                    $(".rate-info-p").hide();

                    var self = this;
                    this.standardView = new StandardView({
                        model: standard
                    });
                    console.log("renderStandard");console.log(standard);

                    this.standardView.on('deleteAddedNode', function () {
                        this.$el.remove();
                        self.standards.remove(this.model.id);
                        console.log("deleteAddedNode");console.log(this.model);  
                        $("ul li#"+this.model.id+"> a > ins.jstree-checkbox").trigger("click");
                   
                        if(self.standards.length<=0){
                            $(".rate-info-p").show();
                            self.disableSave();
                        }
                        else{
                            $(".rate-info-p").hide();
                            self.enableSave();
                        }
                            
                        // $('#standardSave').removeClass("save-std-btn")
                        //                   .addClass("btn-primary")
                        //                   .removeAttr("disabled");
                    });
           
                    this.$("#facebox #allStdSub").append(this.standardView.render().el);

                    var r = this.standardView.model.attributes.rating;
                    var mid = this.standardView.model.id;
                    this.$('#facebox :radio[id="rating'+r+mid+'"]').attr("checked","checked");

                    if(standard.attributes.node_type){
                        this.$('#facebox label[for$="'+mid+'"]').hide();
                        this.$('#facebox :radio[id="rating2'+mid+'"]').attr("checked","checked");
                    }
                        

                    this.enableSave();

                },
                removeStandards:function(type){ 
                    console.log("removeStandards");console.log(type);
                    this.standards.remove(type);
                    this.selectedNodes.remove(type);
                    this.selectedNodesForTree.remove(type);

                    // if(this.selectedNodes.length<=0){
                    //     $(".rate-info-p").show();
                    //     this.disableSave();
                    // }
                        
                    // else{
                    //     $(".rate-info-p").hide();
                    //     this.enableSave();
                    // }
                    this.enableSave();
                },
                selectStandardonTree:function(nodes){
                    var self = this,c = 0;
                    console.log("selectStandardonTree");console.log(this.selectedNodesForTree);
                    for (var i =0; i<this.selectedNodesForTree.models.length; i++) {
                        $(nodes).find("li#"+this.selectedNodesForTree.models[i].attributes.id).
                                    removeClass('jstree-unchecked').addClass('jstree-checked');    
                    };
                },
                enableSave:function(e){
                    console.log("ENABLE SAVE");
                    if(e){
                        $(e.target.previousElementSibling).attr("checked","checked");
                    }
                    console.log(this.standards.models[0].attributes.node_type);
                    this.$checkedRadio = [];
                    this.$checkedRadio.push($('#facebox :radio[name^="standardRating"]:checked'));
                    this.checkedRadio = this.$checkedRadio[0].length;
                    console.log(this.checkedRadio+"::"+this.standards.length);
                    // this.$('#facebox label[for$="'+clusterId+'"]')
                    // if($('#facebox label.rating-label').css("display")==="none"){
                    //     this.checkedRadio = this.checkedRadio + 1;
                    // }
                    if((this.standards.length) === (this.checkedRadio) && this.standards.length>0){
                        $('#standardSave').removeClass("save-std-btn")
                                          .addClass("btn-primary")
                                          .removeAttr("disabled")
                                          .removeAttr("title");
                    }
                    else{
                        $('#standardSave').removeClass("btn-primary")
                                          .addClass("save-std-btn")
                                          .attr("disabled","disabled")
                                          .attr("title","Rate all standards to enable");
                    }
                    // if(this.standards.models[0].attributes.node_type==="CLUSTER"){
                    //     $('#standardSave').removeClass("save-std-btn")
                    //                       .addClass("btn-primary")
                    //                       .removeAttr("disabled")
                    //                       .removeAttr("title");
                    // }

                },
                disableSave:function(){
                    $('#standardSave').removeClass("btn-primary")
                                      .addClass("save-std-btn")
                                      .attr("disabled","disabled");
                },
                closeBox: function (e) {
                    if(e){
                        this.trigger("restoreTaxonomy");
                    }
                    
                    $('#faceboxLookup').trigger('close.facebox');
                    $('li.lookupLi').removeClass('selected-starnd');
                    $('li#liall').addClass('selected-starnd');
                    this.undelegateEvents();
                    if (this.strandId)
                        delete this.strandId;
                    if (this.keywords)
                        delete this.keywords;
                    if (this.path)
                        delete this.path;
                    constants.eventbus.trigger('addIframeback');
                     // $("#facebox_overlay").unbind("keyup");
                },

                getStrand: function (data) {
                    this.toggleView();
                    var domain = $(data.currentTarget.outerHTML).text().trim();
                    this.setSubtopic(domain);
                    var liId = $(data.currentTarget.outerHTML).attr('id');
                    this.strandId = liId;

                    $(".lookupLi").removeClass('selected-starnd');
                    $("li#" + liId + ".lookupLi").toggleClass('selected-starnd');

                    if (this.selectedVal.trim().toUpperCase() == 'MATH') {
                        this.vent.trigger("filterDomain", domain);
                    } else {
                        var treeId = liId.substr(2);

                        if (treeId.toUpperCase() == 'ALL') {
                            $(".jstree-default").show();
                        } else {
                            $(".jstree-default").hide();
                            $("#_" + treeId).show();
                        }
                    }
                },


                saveData: function () {
                    console.log("SAVE DATA");
                    $("#txt_desc_classification").val($("#facebox #LookUpKeywords").val());
                    var sub = $("#subject_span" + this.subjectDivId).text().substring(0, 7).toUpperCase().trim();
                    this.getCheckedNodes(sub);

                    
                    if (sub == constants.ela || sub == constants.math) {

                        $("#btn-disable" + this.subjectDivId).hide();
                        $("#slct_sub_top" + this.subjectDivId).show();
                        var id = $("li.selected-starnd").attr('id');
                        $("#subtopic_span" + this.subjectDivId).text($("#" + id).text().trim());
                    } else {

                    }
                    this.trigger('associateTaxonomy');
                    this.closeBox();
                },

                getCheckedNodes: function (type, clusterId) {
                    console.log("getCheckedNodes");
                    console.log(type);
                    console.log("cluster = "+ clusterId);

                    var r = 3;
                    var node_type1 = null;

                    console.log("R = "+r);
                    if(clusterId){
                        console.log("clusterId Present id= "+clusterId);
                        node_type1 = "CLUSTER";
                        // this.standards.set("node_type","cluster");
                        this.$('#facebox label[for$="'+clusterId+'"]').hide();
                        // this.$('#facebox :radio[name$=standardRating"'+clusterId+'"]').remove();
                        this.removedLabelCount = this.removedLabelCount + 1;
                    }
         
                    var self = this;
                    
                    if(!type)
                        type = this.treeType;
                    $('#btn_save').removeAttr('disabled');
                    $('#btn_save').removeClass('disabledSave');

                    if(type==constants.math)
                    {
                        console.log("tpy===MATH");
                        var rootCount=0;
                        $('.jstree-checked').each(function (data) {
                            console.log($(this));
                            var taxonomyId = $(this).attr('taxonomyid');
                            var nodeId = $(this).attr("id");
                            var parentClass ;
                            if($('#'+nodeId+' a')[0].className=='' || $('#'+nodeId+' a')[0].className=='jstree-hovered' || $('#'+nodeId+' a')[0].className=='jstree-search'){
                                parentClass= $('#' + nodeId).parent()[0].previousElementSibling.className;
                                if (parentClass == 'root_node' && $(this).hasClass('jstree-closed')) {
                                    $.ajax({
                                        type: "GET",
                                        contentType: 'application/json',
                                        url: constants.getTaxonomy + taxonomyId + '/nodes/' + nodeId,
                                        success: function (data) {
                                            console.log("SUCCESSFUL");
                                            for (var i = 0; i < data.response['taxonomy-node-list'].length; i++)
                                                self.selectedNodes.push(new Backbone.Model({
                                                    id: data.response['taxonomy-node-list'][i].id,
                                                    name: data.response['taxonomy-node-list'][i].name,
                                                    description:data.response['taxonomy-node-list'][i].description,
                                                    tree_type:self.treeType,
                                                    node_type:self.node_type1
                                                }));
                                            console.log(self.selectedNodes.models);
                                        }
                                    });
                                } else {  
                                    console.log("inside constants.math = "+node_type1);
                                    // if($(this).hasClass('jstree-leaf')){
                                        var name = $(this).attr("name");
                                        var desc = $(this).attr("description");
                                        var id = $(this).attr("id"); 
                                        var nodeType = node_type1;

                                        console.log(nodeType);
                                        if($('#facebox #searchResult').is(':visible') ){
                                            if($(this)[0].parentElement.parentElement.id.length>3){
                                                self.selectedNodes.push(new Backbone.Model({
                                                            id:id,
                                                            name: name,
                                                            description:desc,
                                                            tree_type:self.treeType,
                                                            node_type:node_type1
                                                        }));
                                                console.log("this.selectedNodes with node_type1");
                                                console.log(self.selectedNodes.models);
                                            }
                                        }else if (parentClass != 'root_node'){
                                            console.log(nodeType);
                                            console.log("**********add to collection *******");
                                            console.log(nodeType);
                                            console.log(name);
                                            console.log(typeof name);
                                            var node = new Backbone.Model({
                                                        id:id,
                                                        name: name,
                                                        description:desc,
                                                        tree_type:self.treeType,
                                                        node_type:node_type1
                                                    });
                                            console.log(node.toJSON());   
                                            global =  self.selectedNodes; 
                                            self.selectedNodes.push(node);
                                            // var c = new Backbone.Collection();
                                            // c.push(node);
                                            console.log("this.selectedNodes with node_type1 else if "+nodeType);
                                            console.log(self.selectedNodes.toJSON());
                                            console.log(node.toJSON());
                                        } 
                                    // }
                                    
                                    
                                }
                            }
                        });                       
                    }else{
                        console.log("checked jstree in lookup::: type===ELA = "+node_type1);
                        console.log($('.jstree-leaf .jstree-checked'));
                         $('.jstree-leaf.jstree-checked').each(function(data){
                            console.log("JSTREE CHECKED & JSTREE LEAF");
                            console.log(data);
                            console.log($(this));
                            //push each id selected to an array
                            var name = $(this).attr("name"); 
                            var desc = $(this).attr("description");
                            var id = $(this).attr("id"); 
                            var nodeType = node_type1;
                            self.selectedNodes.push(new Backbone.Model({
                                id:id,
                                name:name,
                                description:desc,
                                tree_type:self.treeType,
                                node_type:node_type1
                            }));
                            // self.trigger('associateTaxonomy');
                      });
                          console.log("THIS>>SELECTEDNODES ELSE = ");
                         console.log(this.selectedNodes);
                    }
                    console.log("THIS>>SELECTEDNODES = "+node_type1);
                    console.log(this.selectedNodes);
                    // setTimeout(function(){
                        this.selectedNodes.each(function (node) {
                            console.log(node);
                            self.standards.add(node);
                        });
                    // },700);
                    
                    console.log("this.selectedNodes");console.log(this.selectedNodes);
                },
               
                addKeyWord: function () {

                    var self = this;
                    //if user is adding keywords create a collection and bind the render event to it
                    if ($('#facebox #addKeyWordTxtLookUp').val() != '') {
                        if (!this.keywords) {

                            this.keywords = new Backbone.Collection();
                            this.keywords.bind('add', function (model) {
                                self.u = new keywordView({
                                        model: model
                                    });
                                self.u.on('deleteKeyword', function () {
                                    this.$el.remove();
                                    self.keywords.remove(this.model);
                                    if (self.keywords.length < 1) {
                                        self.toggleView();
                                    }
                                });
                                this.$("#facebox #addKeyWords_Inside").prepend(this.u.render().el);

                            }, this);
                        }

                        this.keywords.add(new Backbone.Model({
                                    name: $('#facebox #addKeyWordTxtLookUp').val()
                                }));
                        $('#facebox #addKeyWordTxtLookUp').val('');
                        $('#facebox #countTxt').val('30');
                        this.serchUtility();
                    }
                },

                serchUtility: function () {
                    if (!this.spinner)
                        this.spinner = new Spinner({
                                el: $('#facebox #lookupSpinner')
                            });
                    this.spinner.show();
                    var self = this;
                    var serachUrl = constants.serachTaxonomy;
                    var keywordsArray = this.keywords.pluck("name");
                    this.wordsToSearch = keywordsArray;
                    var minGrade = $("#facebox #slider-range1").slider("values", 0);
                    var maxGrade = $("#facebox #slider-range1").slider("values", 1);
                    var strand = '*';
                    var grade = '*';
                    var path = [];
                    if (!this.path) {
                        if (this.strandId && this.strandId != this.allStrand) {
                            strand = $("#" + this.strandId).text().trim();
                        }


                        if (this.treeType == constants.english) {
                            this.taxonomy_name = 'ELA';

                            if (minGrade == 0 && maxGrade == 12) {
                                path.push('|' + strand + '|' + grade + '|*');
                            } else if (this.strandId) {
                                for (var i = minGrade; i <= maxGrade; i++) {
                                    var j = i;
                                    if (j == 0)
                                        j = 'K';
                                    try {
                                        grade = $("li[name='" + strand + "']").find("li[description='" + j + "']").attr('name').trim();
                                    } catch (e) {}
                                    if (grade)
                                        path.push('|' + strand + '|' + grade + '|*');
                                }
                            } else {
                                for (var i = minGrade; i <= maxGrade; i++) {
                                    var j = i;
                                    if (j == 0)
                                        j = 'K';
                                    if (grade)
                                        path.push('|' + strand + '|*Grade ' + j + '|*');
                                }

                            }
                        } else {
                            this.taxonomy_name = constants.math;
                            var domain = strand;

                            if (minGrade == 0 && maxGrade == 12) {
                                path.push('|' + grade + '|' + domain + '|*');
                            } else if (this.strandId) {
                                for (var i = minGrade; i <= maxGrade; i++) {
                                    var j = i;
                                    if (j == 0) j = 'K';
                                    try {
                                        grade = $("li[name='" + domain + "']").parent().parent("li[description='" + j + "']").attr('name');
                                    } catch (e) {}
                                    if (grade)
                                        path.push('|*' + j + '|' + domain + '|*');
                                }
                            } else {
                                for (var i = minGrade; i <= maxGrade; i++) {
                                    var j = i;
                                    if (j == 0) j = 'K';
                                    if (grade)
                                        path.push('|*' + j + '|*' + '|*');
                                }
                            }
                        } // end else
                        this.path = path;
                    }
                    var keys = null;
                    var stringPath = null;
                    $.each(keywordsArray, function (index, value) {
                        if (!keys)
                            keys = keywordsArray[index];
                        else
                            keys = keys + ' OR ' + keywordsArray[index];
                    });

                    $.each(this.path, function (index, value) {
                        if (!stringPath)
                            stringPath = self.path[index].trim().split(' ').join('\\ ');
                        else
                            stringPath = stringPath + ' OR ' + self.path[index].split(' ').join('\\ ');

                    });

                    stringPath = stringPath.trim().replace(/\//g, "\\/");
                    if (keys) {
                        var name = "name:(" + keys + ")";
                        var description = "description:(" + keys + ")";
                        var name_and_description = "(" + name + ' OR ' + description + ")";
                        var paths = "path:(" + stringPath + ")";
                        var name_desc_path = "" + name_and_description + " AND " + paths;
                        var tree = "taxonomy_name:" + this.taxonomy_name;

                        serachUrl = serachUrl + 'q=' + encodeURIComponent(name_desc_path) + '&fq=' + encodeURIComponent(tree) + constants.searchTaxonomyEndurl;

                    }

                    this.searchModel = new SearchTree({
                            onComplete: function () {
                                self.loadSearchdata();
                            },
                            url: serachUrl,
                            treeType:this.treeType
                        })

                },

                loadSearchdata: function () {
                    var self = this;
                    $('#facebox #treeViewDiv').hide();
                    $('#facebox #searchResult').show();
                    var treeData = this.searchModel.toJSON().tree;
                    if (treeData.children.length < 1) {
                        $('#facebox #searchResult').hide();
                        $('#facebox #noSearchResult').show();
                    } else {
                        this.$('#facebox #searchResult').html('');
                        $('#facebox #searchResult').show();
                        $('#facebox #noSearchResult').hide();
                        _(treeData.children).each(function (obj, k) {
                            //work around for the bug PUB-270
                            if (self.treeType == constants.math)
                                obj.data = 'Mathematics Grade ' + obj.data;
                            obj.attr = {};
                            obj.attr.id = k + 10;
                            this.treeView = new Tree({
                                    model: obj,
                                    treeType: self.treeType
                                });
                            this.$('#facebox #searchResult').append(this.treeView.render().el);
                            setTimeout(function () {
                                $('a em').addClass('highlight');
                            }, 0);
                        });
                        constants.eventbus.trigger('hideCheckbox');
                    }
                    this.spinner.hide();
                },

                // method to hide seaarch result and show taxonomy tree
                toggleView: function () {
                    $('#facebox #treeViewDiv').show();
                    $('#facebox #searchResult').hide();
                    $('#facebox #noSearchResult').hide();
                    $(this.keywordsDiv).empty();
                    if (this.keywords)
                        this.keywords.reset();
                    if (this.path)
                        delete this.path;
                },

                //  DEPENDING ON THE STRAND/DOMAIN SELECTED SET SUBTOPIC
                setSubtopic: function (domain) {
                    $('#subtopic_span' + this.id).text(domain);
                }
                
            });


        return lookupView;
    });