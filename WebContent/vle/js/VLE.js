function VLE() {
	this.state = new VLE_STATE();
	this.project = null;
	this.navigationLogic = null;
	this.visibilityLogic = null;
	this.navigationPanel = null;
	this.contentPanel = null;
	this.audioManager = null;
	this.connectionManager = null;
}

/**
 * Sets the Project to render
 */
VLE.prototype.setProject = function(project) {
	this.project = project;
	this.navigationPanel = new NavigationPanel(project.rootNode);
	this.contentPanel = new ContentPanel(project, project.rootNode);
}

/**
 * stops and rewinds audio
 */
VLE.prototype.rewindStepAudio = function() {
	this.audioManager.rewindStepAudio();
}

/**
 * toggles play/pause audio
 */
VLE.prototype.playPauseStepAudio = function() {
	this.audioManager.playPauseStepAudio();	
}

/**
 * Renders the VLE.
 *    If nodeId is not specified (is null):
 *          If the student has visited the project before (there is state.visitedNodes), 
 *       find render the last node visited.
 *          Otherwise, show the first non-hidden node.
 *    Otherwise, render node with specified nodeId.   
 * @param {Object} nodeId
 */
VLE.prototype.renderNode = function(nodeId){
    var nodeToVisit = null;
    if (nodeId == null) {
		if (this.state.visitedNodes.length > 0) {
			nodeToVisit = this.state.visitedNodes[this.state.visitedNodes.length - 1];
		} else {
			nodeToVisit = this.visibilityLogic.getNextVisibleNode(this.state, this.project.rootNode);
		}
    }
    else {
        nodeToVisit = this.project.rootNode.getNodeById(nodeId);
    }
	
	if (nodeToVisit == null) {
		alert("VLE: nodeToVisit is null Exception. Exiting");
		return;
	}
    if (this.navigationLogic == null || this.navigationLogic.canVisitNode(this.state, nodeToVisit)) {
        var currentNode = nodeToVisit;
        vle.state.setCurrentNodeVisit(currentNode);
        this.navigationPanel.render();
        this.contentPanel.render(currentNode.id);
		currentNode.setCurrentNode();   // tells currentNode that it is the current node, so it can perform tasks like loading node audio
		if(this.connectionManager != null) {
			this.connectionManager.post(vle.user);
		}
    }
}

VLE.prototype.renderPrevNode = function() {
	var currentNode = this.getCurrentNode();
	if (this.navigationLogic == null) {
		alert("prev is not defined.");
	}
	var prevNode = this.navigationLogic.getPrevNode(currentNode);
	if (prevNode == null) {
		alert("prevNode does not exist");
	} else {
		this.renderNode(prevNode.id);
	}
}

VLE.prototype.renderNextNode = function() {
	var currentNode = this.getCurrentNode();
	if (this.navigationLogic == null) {
		alert("next is not defined.");
	}
	var nextNode = this.navigationLogic.getNextNode(currentNode);
	if (nextNode == null) {
		alert("nextNode does not exist");
	} else {
		this.renderNode(nextNode.id);
	}
}

VLE.prototype.getCurrentNode = function() {
	var nodeVisit = this.state.getCurrentNodeVisit();
	if (nodeVisit != null) {
		return nodeVisit.node;
	}
	return null;
}

VLE.prototype.toggleNavigationPanelVisibility = function() {
	this.navigationPanel.toggleVisibility();	
}

VLE.prototype.print = function() {
	window.print();
}

VLE.prototype.getNodeVisitedInfo = function() {
	var infoInHtml = "";
	for (var i=0; i < vle.state.visitedNodes.length; i++) {
		var currNode = vle.state.visitedNodes[i];
		infoInHtml += "nodeId: " + currNode.node.id + "<br/>startTime: " + currNode.visitStartTime + "<br/>endTime: " + currNode.visitEndTime + "<br/><br/>";
	}
	document.getElementById("experimentaloutput").innerHTML = infoInHtml;
}

VLE.prototype.showAllWork = function(){
    var allWorkHtml = "";
	allWorkHtml = "<div style=\"width: 950px; text-align:left; height: 550px; overflow: auto\">" + this.project.getShowAllWorkHtml() + "</div>";
    YAHOO.namespace("example.container");
    var content = document.getElementById("showAllWorkDiv");
    
    content.innerHTML = "";
    
    if (!YAHOO.example.container.showallwork) {
    
        // Initialize the temporary Panel to display while showallworking for external content to load
        
        YAHOO.example.container.showallwork = new YAHOO.widget.Panel("showallwork", {
            width: "1000px",
			height: "600px",
			fixedcenter: true,
            close: true,
            draggable: false,
            zindex: 4,
            modal: true,
            visible: false
        });
        
        YAHOO.example.container.showallwork.setHeader("Your Work");
        YAHOO.example.container.showallwork.setBody(allWorkHtml);
        YAHOO.example.container.showallwork.render(document.body);
        
    }
    else {
        YAHOO.example.container.showallwork.setBody(allWorkHtml);
    }
    
    // Show the Panel
    YAHOO.example.container.showallwork.show();
}


function VLE_STATE() {
	this.visitedNodes = [];  // array of NODE_VISIT objects
}

VLE_STATE.prototype.getCurrentNodeVisit = function() {
	if (this.visitedNodes.length == 0) {
		return null;
	} else {
		return this.visitedNodes[this.visitedNodes.length - 1];
	}
}

/**
 * Returns an array of NODE_VISITS for the specified nodeId
 * @param {Object} nodeId
 */
VLE_STATE.prototype.getNodeVisitsByNodeId = function(nodeId) {
	var nodeVisitsForThisNode = [];
	for (var i=0; i<this.visitedNodes.length;i++) {
		if (this.visitedNodes[i].node.id==nodeId) {
			nodeVisitsForThisNode.push(this.visitedNodes[i]);
		}		
	}
	return nodeVisitsForThisNode;
}

/**
 * @return xml representation of the state of the vle which
 * 		includes student data as well as navigation info
 */
VLE_STATE.prototype.getDataXML = function() {
	var dataXML = "";
	dataXML += "<vle_state>";
	
	//loop through all the visited nodes and retrieve the xml for each node
	for (var i=0; i<this.visitedNodes.length;i++) {
		dataXML += this.visitedNodes[i].getDataXML();
	}
	
	dataXML += "</vle_state>";
	return dataXML;
}

function NODE_VISIT(node) {
	this.node = node;
	this.nodeStates = [];
	this.visitStartTime = new Date();
	this.visitEndTime = null;
}

/**
 * @return xml representation of the node_visit object which
 * 		includes node type, visitStart, visitEnd time, etc.
 */
NODE_VISIT.prototype.getDataXML = function() {
	var dataXML = "";
	
	dataXML += "<node_visit>";
	
	dataXML += "<node>";
	dataXML += this.node.type;
	dataXML += "</node>";
	
	dataXML += "<nodeStates>";
	dataXML += this.node.getDataXML(this.nodeStates);
	dataXML += "</nodeStates>";
	
	dataXML += "<visitStartTime>";
	dataXML += this.visitStartTime;	
	dataXML += "</visitStartTime>";
	
	dataXML += "<visitEndTime>";
	dataXML += this.visitEndTime;	
	dataXML += "</visitEndTime>";
	
	dataXML += "</node_visit>";
	
	return dataXML;
}

/**
 * Sets a new NODE_VISIT, containing info on where the student 
 * is current on.
 */
VLE_STATE.prototype.setCurrentNodeVisit = function(node) {
	var currentNodeVisit = this.getCurrentNodeVisit();   // currentNode becomes lastnode

	// don't set new currentnode if it's the same node as previous node
	if (currentNodeVisit != null &&
	        currentNodeVisit.node == node) {
		return;
	}
	
	// set endtime on previous 
	if (currentNodeVisit != null) {
		currentNodeVisit.visitEndTime = new Date();
	}
	var newNodeVisit = new NODE_VISIT(node);
	this.visitedNodes.push(newNodeVisit);
}

contentPanelOnLoad = function(){
	//alert('here' + vle);
	if (vle != null) {
	var currentNode = vle.getCurrentNode();
	currentNode.load();
	}
	//alert('loadd:' + currentNode.id);
	//alert("dataXML: " + vle.getDataXML());
}

VLE.prototype.setConnection = function(connectionManager) {
	this.connectionManager = connectionManager;
	this.connectionManager.setVLE(this);
}

/**
 * @return returns the state of the vle in xml
 */
VLE.prototype.getDataXML = function() {
	//retrieve the xml for the current state of the vle
	var dataXML = this.state.getDataXML();
	return dataXML;
}
