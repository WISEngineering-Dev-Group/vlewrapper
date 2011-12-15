DesignWallNode.prototype = new Node();
DesignWallNode.prototype.constructor = DesignWallNode;
DesignWallNode.prototype.parent = Node.prototype;

/*
 * the name that displays in the authoring tool when the author creates a new step
 */
DesignWallNode.authoringToolName = "Design Wall"; 

/*
 * will be seen by the author when they add a new step to their project to help
 * them understand what kind of step this is
 */
DesignWallNode.authoringToolDescription = "This is a generic step only used by developers";

/**
 * This is the constructor for the Node
 * 
 * @param nodeType
 * @param view
 */
function DesignWallNode(nodeType, view) {
	this.view = view;
	this.type = nodeType;
	this.prevWorkNodeIds = [];
	this.tinyMCEEnabled = true;
	this.tinyMCE;
	// variables used in ajax requests
	this.wall_url = "/wiseng/designWall";
	this.MAX_ASSET_SIZE = this.view.MAX_ASSET_SIZE;
	this.currentAssetSize;
	this.scrollToEnd = false;
	this.tinyMCEEditors = [];
	this.divHidden = new Array();	// a hash table of true/false values for div id keys
}

var designWallRequest;

DesignWallNode.prototype.createAJAXRequest = function () {
	var request;

	try {
		request = new XMLHttpRequest();
	} catch (tryMS) {
		try {
			request = new ActiveXObject("Msxml2.XMLHTTP");
		} catch (otherMS) {
			try {
				request = new ActiveXObject("Microsoft.XMLHTTP");
			} catch (failed) {
				request = null;
			}
		}
	}

	// assign handle to this object
	request.designWallObj = this;

	return request;
}

/**
 * Thes function is called when the vle loads the step and parses
 * the previous student answers, if any, so that it can reload
 * the student's previous answers into the step.
 * 
 * @param stateJSONObj
 * @return a new state object
 */
DesignWallNode.prototype.parseDataJSONObj = function(stateJSONObj) {
	return DesignWallState.prototype.parseDataJSONObj(stateJSONObj);
};

/**
 * This function is called if there needs to be any special translation
 * of the student work from the way the student work is stored to a
 * human readable form. For example if the student work is stored
 * as an array that contains 3 elements, for example
 * ["apple", "banana", "orange"]
 *  
 * and you wanted to display the student work like this
 * 
 * Answer 1: apple
 * Answer 2: banana
 * Answer 3: orange
 * 
 * you would perform that translation in this function.
 * 
 * Note: In most cases you will not have to change the code in this function
 * 
 * @param studentWork
 * @return translated student work
 */
DesignWallNode.prototype.translateStudentWork = function(studentWork) {
	return studentWork;
};

/**
 * This function is called when the student exits the step. It is mostly
 * used for error checking.
 * 
 * Note: In most cases you will not have to change anything here.
 */
DesignWallNode.prototype.onExit = function() {
	//check if the content panel has been set
	if(this.contentPanel) {
		if(this.contentPanel.save) {
			//tell the content panel to save
			this.contentPanel.save();
		}
	}
};

/**
 * Renders the student work into the div. The grading tool will pass in a
 * div id to this function and this function will insert the student data
 * into the div.
 * 
 * @param divId the id of the div we will render the student work into
 * @param nodeVisit the student work
 * @param childDivIdPrefix (optional) a string that will be prepended to all the 
 * div ids use this to prevent DOM conflicts such as when the show all work div
 * uses the same ids as the show flagged work div
 * @param workgroupId the id of the workgroup this work belongs to
 * 
 * Note: you may need to add code to this function if the student
 * data for your step is complex or requires additional processing.
 * look at SensorNode.renderGradingView() as an example of a step that
 * requires additional processing
 */
DesignWallNode.prototype.renderGradingView = function(divId, nodeVisit, childDivIdPrefix, workgroupId) {
	//Get the latest student state object for this step
	var designWallState = nodeVisit.getLatestWork();
	
	/*
	 * get the step work id from the node visit in case we need to use it in
	 * a DOM id. we don't use it in this case but I have retrieved it in case
	 * someone does need it. look at SensorNode.js to view an example of
	 * how one might use it.
	 */
	var stepWorkId = nodeVisit.id;
	
	var studentWork = designWallState.getStudentWork();
	
	//put the student work into the div
	$('#' + divId).html(studentWork.response);
};

/**
 * Get the html file associated with this step that we will use to
 * display to the student.
 * 
 * @return a content object containing the content of the associated
 * html for this step type
 */
DesignWallNode.prototype.getHTMLContentTemplate = function() {
	return createContent('node/designWall/designWall.html');
};

DesignWallNode.prototype.getProjectId = function() {
	var projectId = this.view.config.getConfigParam('runId');
	return projectId;
}

DesignWallNode.prototype.getUserName = function() {
	var userName = this.view.userAndClassInfo.getUserLoginName();
	return userName;
}

DesignWallNode.prototype.getDocument = function() {
	var doc = window.frames['ifrm'].document;
	return doc;
}

DesignWallNode.prototype.getFrame = function() {
	return window.frames['ifrm'];
}

/**
 * Used to submit both top level posts (parentId = 0)
 * and comments (parentId > 0)
 */
DesignWallNode.prototype.submitPosting = function(parentId) {
        //window.alert("submitPosting() called");         // debug
	// check parentId
	if (parentId == "") {
		parentId = "0";
	}

	// get projectId (runId)
	var projectId = this.getProjectId();
	
	// get nodeId
	var nodeId = this.getNodeId();

	// get userName
	var userName = this.getUserName();

	// get handle to document
	var doc = this.getDocument();

	// get post title
	var postTitleInputFieldId = "postTitleInputField_" + parentId;
	var inputField = doc.getElementById(postTitleInputFieldId);
	var title = inputField.value;

	// get post body
	var postBodyTextAreaId = "postBodyTextArea_" + parentId;
	var textArea;
	var editor;
	var body;
	if (this.tinyMCEEnabled && parentId == 0) {
		editor = this.tinyMCE.get(postBodyTextAreaId);
		body = editor.getContent();
		//window.alert("body=" + body);
	}
	else {
		textArea = doc.getElementById(postBodyTextAreaId);
		body = textArea.value;
	}

	// escape strings to encode them as single strings (no spaces, CRLF, etc.)
	title = escape(title);
	body = escape(body);

	//window.alert("projectId=" + projectId + "\n userName=" + userName + "\n title=" + title + "\n body=" + body);

	// check for missing title/body
	if (parentId == 0) {	// top-level postings
		if ((title == "") && (body == "")) {
			window.alert("No posting!");
			return;
		}
		if (title == "") {
			window.alert("Missing title");
			return;
		}
		if (body == "") {
			window.alert("Missing body");
			return;
		}
		// post is ok at this point
		// flag to scroll to the end
		this.scrollToEnd = true;
	}
	else {	// comments
		if (title == "") {
			return;
		}
	}

	var requestData = "mode=post"
		+ "&projectId=" + escape(projectId)
		+ "&nodeId=" + escape(nodeId)
		+ "&userName=" + escape(userName)
		+ "&parentId=" + escape(parentId)
		+ "&title=" + escape(title)
		+ "&body=" + escape(body);

	var callback = function() {
		if (designWallRequest.readyState == 4 &&
			designWallRequest.status == 200) {

			var responseText = designWallRequest.responseText;

			var responseJson = JSON.parse(responseText);

			if (responseJson.type == "error") {
				window.alert(responseJson.message);
			}
			else {
				eventManager.fire("designWallRefreshPostingsDisplay");
			}
		}
	}
	this.sendRequest(this.wall_url, requestData, callback);

	// clear the input form
	if (parentId == 0) {	// top-level form
		inputField.value = "";
		if (this.tinyMCEEnabled) {
			editor.setContent("");	
		}
		else {
			textArea.value = "";
		}
	}
};

DesignWallNode.prototype.sendRequest = function(url, requestData, callback) {
	designWallRequest = this.createAJAXRequest();
	if (designWallRequest == null) {
		window.alert("Unable to create request!");
	}
	else {
		designWallRequest.onreadystatechange = callback;
		designWallRequest.open("POST", url, true);
		designWallRequest.setRequestHeader("Content-Type",
			"application/x-www-form-urlencoded");
		designWallRequest.send(requestData);
	}
}

/**
 * Displays a comment entry form.
 */
DesignWallNode.prototype.showCommentForm = function(parentId) {
        window.alert("showCommentForm() called");       // debug
	
};

DesignWallNode.prototype.refreshPostingsDisplay = function() {
        //window.alert("refreshPostingsDisplay() called");       // debug
	if (this.tinyMCEEditors.length > 0) {
		for (x in this.tinyMCEEditors) {
			var editor = this.tinyMCEEditors[x];
			this.disableWYSIWYG(editor);
		}
		this.tinyMCEEditors = [];
	}

	// get projectId (runId)
	var projectId = this.getProjectId();
	
	// get nodeId
	var nodeId = this.getNodeId();

	var requestData = "mode=get"
		+ "&projectId=" + escape(projectId)
		+ "&nodeId=" + escape(nodeId);

	var callback = function() {
		if (designWallRequest.readyState == 4 &&
			designWallRequest.status == 200) {

			var responseText = designWallRequest.responseText;

			var responseJson = JSON.parse(responseText);

			//window.alert(responseText); // debug
			if (responseJson.type == "error") {
				window.alert(responseJson.message);
			}
			else {
				var postingsObj = responseJson.message;
				var postings = postingsObj.postings;
				var wall = designWallRequest.designWallObj;
				wall.displayPostings(postings);
			}
		}
	}
	this.sendRequest(this.wall_url, requestData, callback);
};

DesignWallNode.prototype.displayPostings = function(postingsArray) {
	//window.alert("displayPostings() called");
	
	var numPostings = postingsArray.length;
	var html = "";

	var postingsDivId = "postingsDiv";

	// get handle to document
	var doc = this.getDocument();

	// get a handle to the display area
	var postingsDiv = doc.getElementById(postingsDivId);

	// clear the display area
	postingsDiv.innerHTML = "";

	for (var i = 0; i < numPostings; i++) {
		if (i == numPostings - 1) {
			html += "<div id='last_posting_marker'></div>";
		}
		
		var posting = postingsArray[i];
		var parentId = posting.id;
		var commentsDivId = "commentsDiv_" + posting.id;
		if (this.divHidden[commentsDivId] == null) {
			this.divHidden[commentsDivId] = true;
		}

		html += this.createPostingHtml(posting, "dw_posting_top", true);

		html += "<div id='" + commentsDivId + "' ";
		if (this.divHidden[commentsDivId]) {
			html += "class='displayNone'";
		}
		else {
			html += "class='displayBlock'";
		}
		html += ">\n";

		// show comments
		var comments = posting.comments;
		var numComments = comments.length;
		for (var j = 0; j < numComments; j++) {
			posting = comments[j];
			
			html += this.createPostingHtml(posting, "dw_posting_comment", false);
		}

		html += this.createCommentForm( parentId, "dw_posting_comment");

		html += "</div>\n";	// end of commentsDiv_x

		// add a space between postings
		html += "<br />";
	}

	// display the postings
	postingsDiv.innerHTML = html;

	// resize images
	this.constrainImages(postingsDivId);
	
	// scroll to the end if desired
	if (this.scrollToEnd) {
		this.scrollToEnd = false;
		var markerDiv = this.getDocument().getElementById("last_posting_marker");
		
		// find y position of the marker div
		var ypos = 0;
		var e = markerDiv;
		while (e) {
			ypos += e.offsetTop;
			e = e.offsetParent;
		}
		
		// scroll the iframe
		var frame = this.getFrame();
		frame.scrollTo(0, ypos);
	}
}

/**
 * This is a modified version of a script downloaded from
 * The JavaScript Source (http://javascript.internet.com)
 * Original author: Cat Arriola (http://astrodiva.journalspace.com)
 * Modified by Edward Pan, WISEngineering Project, UVA
 * 
 * This script resizes images that spill over the right bound of
 * the container div that they are in.  It maintains aspect ratio.
 */
DesignWallNode.prototype.constrainImages = function(elementId) {
	var doc = this.getDocument();
	var container = doc.getElementById(elementId);
	var images = container.getElementsByTagName('img');
	var containerWidth = container.clientWidth;
	var padding = 10;
	var maxWidth = containerWidth - 2 * padding;

	for (var i = 0; i < images.length; i++) {
		var w = images[i].width;
		var h = images[i].height;
		var margin = images[i].offsetLeft;
		var marginizedWidth = margin + w + padding;

		if (marginizedWidth > maxWidth) {
			var f = 1 - ((marginizedWidth - maxWidth) / marginizedWidth);
			images[i].width = w * f;
			images[i].height = h * f;
		}

	}
}

DesignWallNode.prototype.createCommentForm = function(parentId, css_class) {
	// this is the empty form that allows users to post comments
	// it appears at the bottom of the previous comments
	// activated when users click in it.
	// will need to generate an event with the following params:
	//   parentId
	var html = "";
	var div_id = "dw_commentformdiv_" + parentId;
	html += "<div id=\"" + div_id + "\" class=\"" + css_class + "\">";
	html += "<input id='postTitleInputField_" + parentId + "' type='text' size='80' value='Add a comment' "
	+ "onfocus=\"this.value = ''\" "
	+ "onblur=\"this.value = 'Add a comment'\" "
	+ "onKeyPress=\"if (event.which == 13) { eventManager.fire('designWallSubmitPosting', [" + parentId + "])}\""
	+ ">"
	 + "<textarea id='postBodyTextArea_" + parentId + "' rows='8' cols='70' style='display:none;'>"
	 + "</textarea>";
	 // html += "<button onclick='eventManager.fire(\"designWallSubmitPosting\", [" + parentId + "])'>Submit</button>";
	html += "</div>";
	return html;
	
	/*
	 var topPostFormDivHTML = ""
	 + "<div id='topPostFormInputFieldDiv'>"
	 + "</div>";
	 $('#topPostFormDiv').html(topPostFormDivHTML);
	 */	
}

DesignWallNode.prototype.createPostingHtml = function(posting, css_class, isTopPosting) {
	var html = "";

	var id = posting.id;
	var parentId = posting.parentId;
	var dateTime = posting.dateTime;
	var userName = posting.userName;
	var title = unescape(posting.title);
	var body = unescape(posting.body);
	var comments = posting.comments;
	var editDateTime = posting.editDateTime;

	// fix dateTime format to drop fractions of seconds
	var timeTokens = dateTime.split('.');
	dateTime = timeTokens[0];
	timeTokens = editDateTime.split('.');
	editDateTime = timeTokens[0];
	
	var div_id = "dw_posting_" + id;

	html += "<div id=\"" + div_id + "\" class=\"" + css_class + "\">";
	html += "<table border='0' width='100%'>";
	html += "<tr>";
	html += "<td>";
	
	if (isTopPosting) {
		html += "<span class='dw_posting_title'>";
		html += title;
		html += "</span>";
	}
	
	html += "<span class='dw_posting_info'>";
	html += " posted by " + userName + " on " + dateTime;
	if (editDateTime != null && editDateTime != 'null') {
		html += " (edited: " + editDateTime + ")"
	}
	html += "</span>";
	
	// EDIT / DELETE option bar (on each post/comment owned by this user)
	if (userName == this.getUserName()) {
		html += "<br />\n";
		html += "<div id='edit_delete_bar_" + id + "' class='edit_delete_bar'>";
		if (parentId == 0) {
			html += "[";
			html += "<span class='edit_link' onclick=\"eventManager.fire('designWallEditPosting',['" + id + "'])\">EDIT</span>";
			html += "] | ";
		}
		html += "[";
		html += "<span class='delete_link' onclick='confirm_delete_posting(" + id + "," + parentId + ")'>DELETE</span>";
		html += "]";
		html += "</div>";
		
	}
	
	html += "</td>";
	html += "<td align='right' valign='top'>";

	if (isTopPosting) {
		if (comments != null) {
			var numComments = comments.length;
			html += "<span class='dw_posting_titlebar_comments'>";
			html += "" + numComments + " comments (";

			var commentsDivId = "commentsDiv_" + posting.id;
			var commentsDivHidden = this.divHidden[commentsDivId];


			html += "<span id='commentsLink_" + posting.id + "' onclick=\"eventManager.fire('designWallToggleCommentsDivVisibility', '" + posting.id + "')\" class='commentsLink' >";
			if (commentsDivHidden) {
				html += "view/add";
			}
			else {
				html += "hide";
			}
			html += "</span>";

			html += ")";
			html += "</span>";	// .dw_postingTitleBarComments
		}
	}

	html += "</td>";
	html += "</tr>";
	html += "</table>";

	var postingClass;
	var bodyHTML;
	
	if (isTopPosting) {
		postingClass = "dw_posting_body";
		bodyHTML = body;
	}
	else {
		postingClass= "dw_comment_body";
		bodyHTML = title;
	}

	// id's of divs for display/edit mode functionality
	var displayBlockId = "posting_body_display_" + id;
	var editBlockId = "posting_body_edit_" + id;
	var editTextareaId = "posting_body_textarea_" + id;
	var editTitleFieldId = "posting_title_field_" + id;
	
	html += "<div class='" + postingClass + "'>";
	
	// display block
	html += "<div id='" + displayBlockId + "'>";
	html += bodyHTML;
	html += "</div>";
	
	// edit block
	if (userName == this.getUserName()) {
		html += "<div id='" + editBlockId + "' class='displayNone'>";
		html += "<input type='hidden' id='" + editTitleFieldId + "' value='" + title + "' ></input>"
		if (parentId == 0) {
			html += "<textarea id='" + editTextareaId + "' name='" + editTextareaId + "' class='dw_inline_editor'>";
			html += bodyHTML;
			html += "</textarea>"
		}
		else {
			html += "<input type='text' id='" + editTextareaId + "' name='" + editTextareaId + "' class='dw_inline_editor'>";
			html += bodyHTML;
			html += "</input>"
		}
		html += "<table width='100%'><tr>";
		html += "<td align='left' width='33%'>";
		if (parentId == 0) {
			//html += "<button>Upload/Insert Image</button>";
			html += "&nbsp;";
		}
		else {
			html += "&nbsp;";
		}
		html += "</td><td align='center' width='34%'>";
		html += "<button onclick=\"eventManager.fire('designWallCancelEditPosting',['" + id + "'])\">CANCEL</button>";
		html += "</td><td align='right' width='33%'>";
		html += "<button onclick=\"eventManager.fire('designWallUpdatePosting',['" + id + "'])\">SAVE CHANGES</button>";
		html += "</td>";
		html += "</tr></table>";
		html += "</div>";
	}
	
	html += "</div>";	// end of .dw_posting_body
	
	html += "</div>";	// end of posting div

	return html;
}

DesignWallNode.prototype.toggleCommentsDivVisibility = function(postingId) {
	var divId = "commentsDiv_" + postingId;
	var spanId = "commentsLink_" + postingId;
	var doc = this.getDocument();
	var span = doc.getElementById(spanId);

	if (this.divHidden[divId]) {
		// toggle visibility
		this.showDiv(divId);

		// toggle link text
		span.innerHTML = "hide";
	}
	else {
		// toggle visibility
		this.hideDiv(divId);

		// toggle link text
		span.innerHTML = "view/add";
	}

}

DesignWallNode.prototype.insertImage = function(parentId) { 
	// window.alert("insertImage(" + parentId + ")");
	eventManager.fire('viewStudentAssets', this);
};

DesignWallNode.prototype.uploadImage = function() { 
	eventManager.fire('studentAssetSubmitUpload', this);
};

DesignWallNode.prototype.insertImageUrl = function(fileUrl) {
	var imageHtml = "<img src='" + fileUrl + "' />";
	// get post body
	var postBodyTextAreaId = "postBodyTextArea_0";
	var textArea;
	var editor;
	var body;
	var doc = this.getDocument();
	if (this.tinyMCEEnabled) {
		editor = this.tinyMCE.get(postBodyTextAreaId);
		body = editor.getContent();
		//window.alert("body=" + body);
	}
	else {
		textArea = doc.getElementById(postBodyTextAreaId);
		body = textArea.value;
	}
	body += imageHtml;  // insert the html of the image
	
	// update the post body
	if (this.tinyMCEEnabled) {
		editor = this.tinyMCE.get(postBodyTextAreaId);
		editor.setContent(body);
		//window.alert("body=" + body);
	}
	else {
		textArea = doc.getElementById(postBodyTextAreaId);
		textArea.value = body;
	}
	
};

DesignWallNode.prototype.hideDiv = function(divId) {
	this.divHidden[divId] = true;
	var doc = this.getDocument();
	var div = doc.getElementById(divId);
	this.elementRemoveClass(div, "displayBlock");
	this.elementAddClass(div, "displayNone");
}

DesignWallNode.prototype.showDiv = function(divId) {
	this.divHidden[divId] = false;
	var doc = this.getDocument();
	var div = doc.getElementById(divId);
	this.elementRemoveClass(div, "displayNone");
	this.elementAddClass(div, "displayBlock");
}

DesignWallNode.prototype.elementAddClass = function(element, css_class) {
	//this.elementRemoveClass(element, css_class);
	//element.className += " " + css_class;
	element.classList.add(css_class);
}

DesignWallNode.prototype.elementRemoveClass = function(element, css_class) {
	//element.className = element.className.replace( /(?:^|\s)css_class(?!\S)/ , '' );
	element.classList.remove(css_class);
}

DesignWallNode.prototype.deletePosting = function(postingId) {
	
	// get projectId (runId)
	var projectId = this.getProjectId();
	
	// get nodeId
	var nodeId = this.getNodeId();

	// get userName
	var userName = this.getUserName();
	
	// prepare data
	var requestData = "mode=delete"
		+ "&projectId=" + escape(projectId)
		+ "&nodeId=" + escape(nodeId)
		+ "&userName=" + escape(userName)
		+ "&id=" + escape(postingId);
	
	// send request to server
	var callback = function() {
		if (designWallRequest.readyState == 4 &&
			designWallRequest.status == 200) {

			var responseText = designWallRequest.responseText;

			var responseJson = JSON.parse(responseText);

			if (responseJson.type == "error") {
				window.alert(responseJson.message);
			}
			else {
				eventManager.fire("designWallRefreshPostingsDisplay");
			}
		}
	}
	this.sendRequest(this.wall_url, requestData, callback);

}

DesignWallNode.prototype.enableWYSIWYG = function(textAreaName) {
	this.tinyMCE.execCommand("mceAddControl", false, textAreaName);
}

DesignWallNode.prototype.disableWYSIWYG = function(textAreaName) {
	this.tinyMCE.execCommand("mceRemoveControl", false, textAreaName);
}

DesignWallNode.prototype.editPosting = function(postingId) {
	var displayBlockId = "posting_body_display_" + postingId;
	var editBlockId = "posting_body_edit_" + postingId;
	var editTextareaId = "posting_body_textarea_" + postingId;
	
	var doc = this.getDocument();
	var displayDiv = doc.getElementById(displayBlockId);
	var editDiv = doc.getElementById(editBlockId);
	
	this.hideDiv(displayBlockId);
	this.showDiv(editBlockId);
	this.enableWYSIWYG(editTextareaId);
	this.tinyMCEEditors.push(editTextareaId);
}

DesignWallNode.prototype.updatePosting = function(postingId) {
	//window.alert("updating " + postingId);
	var displayBlockId = "posting_body_display_" + postingId;
	var editBlockId = "posting_body_edit_" + postingId;
	var editTextareaId = "posting_body_textarea_" + postingId;
	var editTitleFieldId = "posting_title_field_" + postingId;
	
	var doc = this.getDocument();
	var displayDiv = doc.getElementById(displayBlockId);
	var editDiv = doc.getElementById(editBlockId);
	var titleField = doc.getElementById(editTitleFieldId);
	
	// get projectId & userName
	var projectId = this.getProjectId();
	var nodeId = this.getNodeId();
	var userName = this.getUserName();

	// get title
	var title = titleField.value;

	// get body
	var	editor = this.tinyMCE.get(editTextareaId);
	var	body = editor.getContent();

	// escape strings to encode them as single strings (no spaces, CRLF, etc.)
	title = escape(title);
	body = escape(body);

	//window.alert("projectId=" + projectId + "\n userName=" + userName + "\n title=" + title + "\n body=" + body);

	var requestData = "mode=edit"
		+ "&id=" + escape(postingId)
		+ "&projectId=" + escape(projectId)
		+ "&nodeId=" + escape(nodeId)
		+ "&userName=" + escape(userName)
		+ "&title=" + escape(title)
		+ "&body=" + escape(body);

	var callback = function() {
		if (designWallRequest.readyState == 4 &&
			designWallRequest.status == 200) {

			var responseText = designWallRequest.responseText;

			var responseJson = JSON.parse(responseText);

			if (responseJson.type == "error") {
				window.alert(responseJson.message);
			}
			else {
				eventManager.fire("designWallRefreshPostingsDisplay");
			}
		}
	}
	this.sendRequest(this.wall_url, requestData, callback);

}

DesignWallNode.prototype.cancelEditPosting = function(postingId) {
	var displayBlockId = "posting_body_display_" + postingId;
	var editBlockId = "posting_body_edit_" + postingId;
	var editTextareaId = "posting_body_textarea_" + postingId;
	
	var doc = this.getDocument();
	var displayDiv = doc.getElementById(displayBlockId);
	var editDiv = doc.getElementById(editBlockId);
	
	this.hideDiv(editBlockId);
	this.showDiv(displayBlockId);
}

//Add this node to the node factory so the vle knows it exists.
NodeFactory.addNode('DesignWallNode', DesignWallNode);

//used to notify scriptloader that this script has finished loading
if(typeof eventManager != 'undefined'){
	eventManager.fire('scriptLoaded', 'vle/node/designWall/DesignWallNode.js');
};
