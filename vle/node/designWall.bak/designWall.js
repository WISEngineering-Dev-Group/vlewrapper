/**
 * This is the constructor for the object that will perform the logic for
 * the step when the students work on it. An instance of this object will
 * be created in the .html for this step (look at designWall.html)
 */
function DesignWall(node) {
	this.node = node;
	this.view = node.view;
	this.content = node.getContent().getContentJSON();
	
	if(node.studentWork != null) {
		this.states = node.studentWork; 
	} else {
		this.states = [];  
	};
};

/**
 * This function renders everything the student sees when they visit the step.
 * This includes setting up the html ui elements as well as reloading any
 * previous work the student has submitted when they previously worked on this
 * step, if any.
 */
DesignWall.prototype.render = function() {
	//display any prompts to the student
	$('#promptDiv').html(this.content.prompt);
	
//	//load any previous responses the student submitted for this step
//	var latestState = this.getLatestState();
//	
//	if(latestState != null) {
//		/*
//		 * get the response from the latest state. the response variable is
//		 * just provided as an example. you may use whatever variables you
//		 * would like from the state object (look at designWallState.js)
//		 */
//		var latestResponse = latestState.response;
//		
//		//set the previous student work into the text area
//		$('#studentResponseTextArea').val(latestResponse); 
//	}

	// populate the form div
	/*
	var topPostFormDivHTML = ""
		+ "<div id='topPostFormInputFieldDiv'>"
		+ "<span id='postTitleInputFieldLabel_0'>Title:</span>"
		+ "<input id='postTitleInputField_0' type='text' size='80'>"
		+ "</div>"
		+ "<div id='topPostFormTextAreaDiv'>"
		+ "<textarea id='postBodyTextArea_0' rows='8' cols='80'>"
		+ "</textarea></div>"
		+ "<div id='topPostFormSubmitButtonDiv'>"
		+ "<button onclick='eventManager.fire(\"designWallSubmitPosting\", [\"0\"])'>Submit</button>"
		+ "</div>";
	$('#topPostFormDiv').html(topPostFormDivHTML);
	*/

};

/**
 * This function retrieves the latest student work
 *
 * @return the latest state object or null if the student has never submitted
 * work for this step
 */
DesignWall.prototype.getLatestState = function() {
	var latestState = null;
	
	//check if the states array has any elements
	if(this.states != null && this.states.length > 0) {
		//get the last state
		latestState = this.states[this.states.length - 1];
	}
	
	return latestState;
};

/**
 * This function retrieves the student work from the html ui, creates a state
 * object to represent the student work, and then saves the student work.
 * 
 * note: you do not have to use 'studentResponseTextArea', they are just 
 * provided as examples. you may create your own html ui elements in
 * the .html file for this step (look at designWall.html).
 */
DesignWall.prototype.save = function() {
	//get the answer the student wrote
	var response = $('#studentResponseTextArea').val();
	
	/*
	 * create the student state that will store the new work the student
	 * just submitted
	 */
	var designWallState = new DesignWallState(response);
	
	/*
	 * fire the event to push this state to the global view.states object.
	 * the student work is saved to the server once they move on to the
	 * next step.
	 */
	eventManager.fire('pushStudentWork', designWallState);

	//push the state object into this or object's own copy of states
	this.states.push(designWallState);
};

//used to notify scriptloader that this script has finished loading
if(typeof eventManager != 'undefined'){
	eventManager.fire('scriptLoaded', 'vle/node/designWall/designWall.js');
}