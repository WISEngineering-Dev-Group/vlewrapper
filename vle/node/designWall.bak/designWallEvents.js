
/*
 * This handles events and calls the appropriate function to handle
 * the event.
 */
View.prototype.designWallDispatcher = function(type,args,obj){
	var view = obj;
	var currentNode = view.project.getNodeByPosition(view.currentPosition);
	
	/*
	 * check to see if the event name matches 
	 */ 
	if(type == 'designWallUpdatePrompt') {
		/*
		 * the event name matches so we will call the function that
		 * handles that event
		 */
		obj.DesignWallNode.updatePrompt();
	}
	else if(type == 'designWallSubmitPosting') {
		currentNode.submitPosting(args[0]);
	}
	else if(type == 'designWallShowCommentForm') {
		currentNode.showCommentForm(args[0]);
	}
	else if(type == 'designWallRefreshPostingsDisplay') {
		currentNode.refreshPostingsDisplay();
	}
	else if (type == 'designWallInsertImage') {
		currentNode.insertImage(args[0]);
	}
	else if (type == 'designWallUploadImage') {
		currentNode.uploadImage();
	}
	else if (type == 'designWallHideDiv') {
		currentNode.hideDiv(args[0]);
	}
	else if (type == 'designWallShowDiv') {
		currentNode.showDiv(args[0]);
	}
	else if (type == 'designWallToggleCommentsDivVisibility') {
		currentNode.toggleCommentsDivVisibility(args[0]);
	}
};

/*
 * this is a list of events that can be fired. when the event is fired,
 * the dispatcher function above will be called and then call the
 * appropriate function to handle the event.
 */
var events = [
	'designWallUpdatePrompt',
	'designWallSubmitPosting',
	'designWallShowCommentForm',
	'designWallRefreshPostingsDisplay',
	'designWallInsertImage',
	'designWallUploadImage',
	'designWallHideDiv',
	'designWallShowDiv',
	'designWallToggleCommentsDivVisibility'
];

/*
 * add all the events to the vle so the vle will listen for these events
 * and call the dispatcher function when the event is fired
 */
for(var x=0; x<events.length; x++) {
	componentloader.addEvent(events[x], 'designWallDispatcher');
};

//used to notify scriptloader that this script has finished loading
if(typeof eventManager != 'undefined'){
	eventManager.fire('scriptLoaded', 'vle/node/designWall/designWallEvents.js');
};
