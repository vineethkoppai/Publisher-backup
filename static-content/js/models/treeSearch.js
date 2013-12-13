

define(
[
'jquery',
'underscore',
'backbone' ,
'constants'
],

function(
  $,
  _ ,
  Backbone ,
  constants
   ) {

// model to hold the tree data after search
var Tree = Backbone.Model.extend( {


  initialize:function(options){  ; 
    this.root ={};
    this.root.data = "ROOT";
    this.root.state = 'open';
    this.root.children = Array();
    this.pathNodeMap = new Object();
    this.treeType = options.treeType;

    var self = this;
   // console.log("taxonomy init search tree");
    //console.log(options);
    var taxonomyId = options.taxonomyId;
    $.ajax({
      type:"GET",
       contentType: 'application/json',
       url:options.url,
      // url: '/solr/cfycr/select?q=name%3Areading&fq=taxonomy_name%3AELA&sort=path+asc&rows=100&fl=id%2Cname%2Cdescription%2Cpath&wt=json&hl=true&hl.fl=name%2Cdescription&hl.simple.pre=%3Cem%3E&hl.simple.post=%3C%2Fem%3E',
       success: function (data) {
                self.buildTree(data,options);
       },
       error: function (e) {
                console.log(e);;
       }
    });
  }, // end init

 

buildTree:function(inputStr, options){
  // var inputStr = document.getElementById("solrstr").value;
   var obj  = JSON.parse(inputStr);
   this.buildTreeFromJSONObject(obj, options);
   //document.getElementById("tree").value = JSON.stringify(root);
},

//Final tree can be accessed through the variable  'root' 
buildTreeFromJSONObject:function(solrResponseObj, options){
  //  console.log("start buildTreeFromJSONObject");   

   for ( var i = 0; i < solrResponseObj.response.docs.length; i++) {
      this.isLeaf = true;
      var doc = solrResponseObj.response.docs[i];
      this.doc = doc;
      var node = this.getNode(doc["path"].substring(1));
      node.attr = {};
     
      var docId = doc["id"]
      node["id"] = docId;
      node.attr.id = docId;
      node.state = "open";
      
      if (solrResponseObj["highlighting"][docId]["description"]){
        node.description = solrResponseObj["highlighting"][docId]["description"];
      }else{
         node.description = doc.description;
      }
      if (solrResponseObj["highlighting"][docId]["name"] ){
         node.data = solrResponseObj["highlighting"][docId]["name"];  
      }else{
        node.data= doc.name;       
      }
      node.attr.name = node.data;
      node.attr.node_type = doc.node_type;
      node.attr.description = doc.description;

      if(doc.node_type=='STANDARD' ){
          delete node.state;
          if(node.description){
            var desc = JSON.stringify(node.description);
            desc = desc.replace(/\"/g, '');
            desc = desc.replace(/\[/g, '');
            desc = desc.replace(/\]/g, '');
              if(node.data!=desc){
                node.data = node.data+"<div class='node_Description'>"+desc+"</div";
              } 
          } 
        }
        // else if(this.treeType==constants.math || doc.node_type=='CLUSTER' ) {
        //    node.state='open';
        // }

    }// end for loop

   if(this.treeType==constants.math)
      this.findLeafNodes(this.root);
    this.set({tree:this.root});   
    options.onComplete();
    //alert (JSON.stringify(root));
},

getNode:function(path){
  if (typeof this.pathNodeMap[path] == "undefined") {
    var pathStrings = path.split("|");
    // alert(pathStrings);
    if (pathStrings.length == 1) {
      var node = Object();
      node.data = path;
      node.attr = {};
      var docId = this.doc["id"]
      node["id"] = docId;
      node.attr.id = docId;
      node.attr.name = node.data;
      node.state = 'open';
      node.children = Array();
      this.pathNodeMap[path] = node;
      this.root.children.push(node);
      return node;
    } else {
      var node = Object();
      var nodeSubPath = pathStrings[pathStrings.length - 1];
      node.data = nodeSubPath;
      node.attr = {};
      var docId = this.doc["id"]
      node["id"] = docId;
      node.attr.id = docId;
      node.attr.name = node.data;
      node.state = 'open';
      node.isLeafNode = true;
      node.children = Array();
      // Remove the last element from the array to get the parent path
      pathStrings.splice(-1, 1);
      var parentPath = pathStrings.join("|");
      var parentNode = this.getNode(parentPath);
      parentNode.isLeafNode = false;
      parentNode.children.push(node);
      this.pathNodeMap[path] = node;
      return node;
    }
  } else {
    return this.pathNodeMap[path];
  }

},// end method

findLeafNodes:function(obj){   
   if(obj.children.length>0){      
      for(var k=0;k<obj.children.length;k++){
        this.findLeafNodes(obj.children[k]);
      }      
   }else{     
        delete obj.state;
      return;
   }
}



});

return Tree;

});
