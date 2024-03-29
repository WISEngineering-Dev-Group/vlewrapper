function ASSESSMENTLISTSTATE(args) {
	this.type = "assessmentlist";
	this.submit = false;
	this.assessments = new Array();

	//use the current time or the argument timestamp passed in
	if(args){
		if(args[0]){
			this.timestamp = args[0];
		};
		
		if(args[1]){
			this.choices = args[1];
		};
	};
	
	if(!this.timestamp){
		this.timestamp = new Date().getTime();
	};
	
};

/**
 * Takes in a state JSON object and returns an ASSESSMENTLISTSTATE object
 * @param stateJSONObj a state JSON object
 * @return an ASSESSMENTLISTSTATE object
 */
ASSESSMENTLISTSTATE.prototype.parseDataJSONObj = function(stateJSONObj) {
	//create a new ASSESSMENTLISTSTATE object
	var alState = new ASSESSMENTLISTSTATE();
	
	//set the attributes of the ASSESSMENTLISTSTATE object
	alState.assessments = stateJSONObj.assessments;
	alState.timestamp = stateJSONObj.timestamp;
	alState.submit = stateJSONObj.submit;
	alState.isSubmit = stateJSONObj.isSubmit;
	alState.locked = stateJSONObj.locked;
	
	//return the MCSTATE object
	return alState;
};

/**
 * Returns the human readable student's answer
 * @return a string containing the human readable answer
 */
ASSESSMENTLISTSTATE.prototype.getStudentWork = function() {
	var studentWorkSoFar = "";
	
	//check if there were any responses
	if(this.assessments) {
		//loop through the array of assessments
		for(var x=0; x<this.assessments.length; x++) {
			if(studentWorkSoFar != "") {
				//separate each response
				studentWorkSoFar += "<br/><br/>";
			}
			
			//add the response to the student work
			studentWorkSoFar += "Part " + (x+1) + ": <br/>";
			var assessment = this.assessments[x];

			if (assessment.type && assessment.response) {
				if (assessment.type == "radio") {
					studentWorkSoFar += assessment.response.text;
				} else if (assessment.type == "text") {
					studentWorkSoFar += assessment.response.text;
				}
			}
		}
	}
	
	return studentWorkSoFar;
};

//used to notify scriptloader that this script has finished loading
if(typeof eventManager != 'undefined'){
	eventManager.fire('scriptLoaded', 'vle/node/assessmentlist/assessmentliststate.js');
};