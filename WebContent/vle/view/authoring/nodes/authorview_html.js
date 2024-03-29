/**
 * Sets the HtmlNode type as an object of this view
 * 
 * @author patrick lawler
 */
View.prototype.HtmlNode = {};

View.prototype.HtmlNode.generatePage = function(view){
	this.view = view;
	this.view.activeNode.baseHtmlContent = createContent(this.view.getProject().makeUrl(this.view.activeContent.getContentJSON().src));
	
	var parent = document.getElementById('dynamicParent');
	
	/* wipe out old element */
	parent.removeChild(document.getElementById('dynamicPage'));
	
	/* create new elements */
	var pageDiv = createElement(document, 'div', {id:'dynamicPage', style:'width:100%;height:100%'});
	parent.appendChild(pageDiv);
	pageDiv.appendChild(createElement(document, 'div', {id: 'promptContainer'}));
};


/**
 * Updates this content object when requested, usually when preview is to be refreshed
 */
View.prototype.HtmlNode.updateContent = function(){
	/* update content object */
	this.view.activeNode.baseHtmlContent.setContent(document.getElementById('promptInput').value);
};

/**
 * Saves the html content to its file
 */
View.prototype.HtmlNode.save = function(close){
	var success = function(t,x,o){
		o.stepSaved = true;
		o.notificationManager.notify('Updated html content on server', 3);
		o.eventManager.fire('setLastEdited');
		if(close){
			o.eventManager.fire('closeOnStepSaved', [true]);
		};
	};
	
	var failure = function(t,x,o){
		o.notificationManager.notify('Failed update of html content on server', 3);
		if(close){
			o.eventManager.fire('closeOnStepSaved', [false]);
		};
	};
	
	this.view.connectionManager.request('POST', 3, this.view.requestUrl, {forward:'filemanager', projectId:this.view.portalProjectId, command:'updateFile', param1:this.view.utils.getContentPath(this.view.authoringBaseUrl,this.view.getProject().getContentBase()), param2:this.view.activeNode.baseHtmlContent.getFilename(this.view.getProject().getContentBase()), param3:encodeURIComponent(document.getElementById('promptInput').value)}, success, this.view, failure);
};

View.prototype.HtmlNode.populatePrompt = function() {
	
	$('#promptInput').val(this.view.activeNode.baseHtmlContent.getContentString());
	/*this.richTextEditor = new tinymce.Editor('promptInput', 
			{theme:'advanced',
			plugins: 'safari',
			theme_advanced_buttons1: 'bold,italic,underline,strikethrough,|,justifyleft,justifycenter,justifyright,justifyfull,|,bullist,numlist,|,emotions,|,forecolor,backcolor,|,formatselect,fontselect,fontsizeselect',
			theme_advanced_buttons2: '',
			theme_advanced_buttons3: '',
			relative_urls: false,
			remove_script_host: true,
			document_base_url: vleLoc,
			theme_advanced_toolbar_location : 'top',
			theme_advanced_toolbar_align : 'left'});*/
	
	/* add keypress listener */
	//this.richTextEditor.onKeyPress.add(this.updatePrompt, this);
	
	/* render the rich text editor */
	//this.richTextEditor.render();
};

/**
 * Forwards updatePrompt to update content and calls sourceUpdated
 */
View.prototype.HtmlNode.updatePrompt = function(){
	this.updateContent();
	this.view.sourceUpdated();
};

//used to notify scriptloader that this script has finished loading
if(typeof eventManager != 'undefined'){
	eventManager.fire('scriptLoaded', 'vle/view/authoring/nodes/authorview_html.js');
};