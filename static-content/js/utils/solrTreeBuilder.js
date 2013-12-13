var root = new Object();
root.data = "ROOT";
root.children = Array();

var pathNodeMap = new Object();

function buildTree() {
	var inputStr = document.getElementById("solrstr").value;
	var obj = JSON.parse(inputStr);
	buildTreeFromJSONObject(obj);
	document.getElementById("tree").value = JSON.stringify(root);
}

// Final tree can be accessed through the variable 'root'
function buildTreeFromJSONObject(solrResponseObj) {
	// alert(JSON.stringify(solrResponseObj.response.docs));
	for ( var i = 0; i < solrResponseObj.response.docs.length; i++) {
		var doc = solrResponseObj.response.docs[i];
		// alert(doc);
		var node = getNode(doc["path"].substring(1));
		var docId = doc["id"]
		node["id"] = docId
		if (solrResponseObj["highlighting"][docId]["description"] == "undefined"){
			node["description"] = doc["description"];
		}else{
			node["description"] = solrResponseObj["highlighting"][docId]["description"];
		}
		if (solrResponseObj["highlighting"][docId]["name"] == "undefined"){
			node["name"] = doc["name"];
		}else{
			node["name"] = solrResponseObj["highlighting"][docId]["name"];
		}
	}
	// alert (JSON.stringify(root));
}

function getNode(path) {
	// alert ("getNode for path : "+path);
	if (typeof pathNodeMap[path] == "undefined") {
		// alert("returning creating fresh node for path "+path);
		var pathStrings = path.split("/");
		// alert(pathStrings);
		if (pathStrings.length == 1) {
			// add it as a child of Root Node
			var node = new Object();
			node["data"] = path;
			node["children"] = Array();
			pathNodeMap[path] = node;
			root["children"].push(node);
			
			return node;
		} else {
			var node = Object();
			var nodeSubPath = pathStrings[pathStrings.length - 1];
			node["data"] = nodeSubPath;
			node["children"] = Array();
			// Remove the last element from the array to get the parent path
			pathStrings.splice(-1, 1)
			var parentPath = pathStrings.join("/");
			// alert("parent path for path "+path+" is "+parentPath);
			var parentNode = getNode(parentPath);
			parentNode["children"].push(node);
			pathNodeMap[path] = node;
			return node;
		}
	} else {
		// alert("returning node for path from map "+path);
		return pathNodeMap[path];
	}
}