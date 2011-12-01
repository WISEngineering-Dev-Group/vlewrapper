/*
 * This is a template step object that developers can use to create new
 * step types.
 * 
 * TODO: Copy this file and rename it to
 * 
 * <new step type>.js
 * e.g. for example if you are creating a quiz step it would look
 * something like quiz.js
 *
 * and then put the new file into the new folder
 * you created for your new step type
 *
 * your new folder will look something like
 * vlewrapper/WebContent/vle/node/<new step type>/
 *
 * e.g. for example if you are creating a quiz step it would look something like
 * vlewrapper/WebContent/vle/node/quiz/
 * 
 * 
 * TODO: in this file, change all occurrences of the word 'TEMPLATE' to the
 * name of your new step type
 * 
 * <new step type>
 * e.g. for example if you are creating a quiz step it would look
 * something like QUIZ
 */

/**
 * This is the constructor for the object that will perform the logic for
 * the step when the students work on it. An instance of this object will
 * be created in the .html for this step (look at template.html)
 * 
 * TODO: rename TEMPLATE
 */
function Table(node, view) {
	this.node = node;
	this.view = view;
	this.content = node.getContent().getContentJSON();
	
	if(node.studentWork != null) {
		this.states = node.studentWork; 
	} else {
		this.states = [];  
	};
	
	//boolean values used to determine whether the student has made any changes
	this.tableChanged = false;
	this.responseChanged = false;
};

/**
 * This function renders everything the student sees when they visit the step.
 * This includes setting up the html ui elements as well as reloading any
 * previous work the student has submitted when they previously worked on this
 * step, if any.
 * 
 * TODO: rename TEMPLATE
 * 
 * note: you do not have to use 'promptDiv' or 'studentResponseTextArea', they
 * are just provided as examples. you may create your own html ui elements in
 * the .html file for this step (look at template.html).
 */
Table.prototype.render = function() {
	//display any prompts to the student
	$('#promptDiv').html(this.content.prompt);
	
	//make a table
	var tableDisplay = document.createElement('table');
	
	//get the table data
	var tableData = this.content.tableData;
	
	//get the latest state
	var latestState = this.getLatestState();
	
	//loop through all the rows
	for(var y=0; y<this.content.numRows; y++) {
		
		//make a row
		var tr = document.createElement('tr');
		
		//loop through all the columns in the row
		for(var x=0; x<this.content.numColumns; x++) {	
			
			//make a cell
			var td = document.createElement('td');
			
			//get the values for the cell from the content
			var cellData = tableData[x][y];
			var cellText = cellData.text;
			var cellUneditable = cellData.uneditable;
			
			if(latestState != null) {
				if(latestState.tableData != null) {
					if(latestState.tableData[x] != null) {
						if(latestState.tableData[x][y] != null) {
							/*
							 * if the student has worked on this step before, the
							 * student values will be used in the cells instead of
							 * the values from the content
							 */
							cellText = latestState.tableData[x][y].text;							
						}
					}
				}
			}
			
			/*
			 * create the text input that will represent the cell and
			 * where the student can edit the text in the cell
			 */
			var cellTextInput = document.createElement('input');
			cellTextInput.id = 'tableCell_' + x + '-' + y;
			cellTextInput.name = 'tableCell_' + x + '-' + y;
			cellTextInput.value = cellText;
			cellTextInput.size = 10;
			cellTextInput.onchange = studentTableChanged;
			
			if(cellUneditable) {
				//disable the cell if necessary
				cellTextInput.disabled = true;
			}
			
			//add the elements to the UI
			td.appendChild(cellTextInput);
			tr.appendChild(td);
		}
		
		tableDisplay.appendChild(tr);
	}
	
	//clear out the existing table
	$('#tableDiv').html('');
	
	//add the newly generated table
	$('#tableDiv').append(tableDisplay);
	
	//load any previous responses the student submitted for this step
	var latestState = this.getLatestState();
	
	if(latestState != null) {
		/*
		 * get the response from the latest state. the response variable is
		 * just provided as an example. you may use whatever variables you
		 * would like from the state object (look at templatestate.js)
		 */
		var latestResponse = latestState.response;
		
		//set the previous student work into the text area
		$('#studentResponseTextArea').val(latestResponse); 
	}
};

/**
 * This function retrieves the latest student work
 * 
 * TODO: rename TEMPLATE
 * 
 * @return the latest state object or null if the student has never submitted
 * work for this step
 */
Table.prototype.getLatestState = function() {
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
 * TODO: rename TEMPLATE
 * 
 * note: you do not have to use 'studentResponseTextArea', they are just 
 * provided as examples. you may create your own html ui elements in
 * the .html file for this step (look at template.html).
 */
Table.prototype.save = function() {
	if(this.responseChanged || this.tableChanged) {
		//get the answer the student wrote
		var response = $('#studentResponseTextArea').val();
		
		var studentTableData = this.getStudentTableData();
		
		/*
		 * create the student state that will store the new work the student
		 * just submitted
		 * 
		 * TODO: rename TEMPLATESTATE
		 * 
		 * make sure you rename TEMPLATESTATE to the state object type
		 * that you will use for representing student data for this
		 * type of step. copy and modify the file below
		 * 
		 * vlewrapper/WebContent/vle/node/template/templatestate.js
		 * 
		 * and use the object defined in your new state.js file instead
		 * of TEMPLATESTATE. for example if you are creating a new
		 * quiz step type you would copy the file above to
		 * 
		 * vlewrapper/WebContent/vle/node/quiz/quizstate.js
		 * 
		 * and in that file you would define QUIZSTATE and therefore
		 * would change the TEMPLATESTATE to QUIZSTATE below
		 */
		var tableState = new TableState(response, studentTableData);
		
		/*
		 * fire the event to push this state to the global view.states object.
		 * the student work is saved to the server once they move on to the
		 * next step.
		 */
		eventManager.fire('pushStudentWork', tableState);

		//push the state object into this or object's own copy of states
		this.states.push(tableState);		
	}
	
	//set these boolean values back to false since we have just saved
	this.tableChanged = false;
	this.responseChanged = false;
};

/**
 * Get the student table data
 * @return the student table data with the values the student entered
 * into the table
 */
Table.prototype.getStudentTableData = function() {
	//make a copy of the table data from the content
	var studentTableData = JSON.parse(JSON.stringify(this.content.tableData));
	
	//loop through all the columns
	for(var x=0; x<this.content.numColumns; x++) {
	
		//loop through all the rows
		for(var y=0; y<this.content.numRows; y++) {
			//get the text in the given x, y cell
			var tableCellText = $('#tableCell_' + x + '-' + y).val();
			
			//update the cell in the table data
			studentTableData[x][y].text = tableCellText;
		}
	}
	
	return studentTableData;
};

/**
 * Reset the table back to the original value in the content
 */
Table.prototype.reset = function() {
	//loop through all the columns
	for(var x=0; x<this.content.numColumns; x++) {
		
		//loop through all the rows
		for(var y=0; y<this.content.numRows; y++) {
			
			//set the value in the cell back to the original value from the content
			$('#tableCell_' + x + '-' + y).val(this.content.tableData[x][y].text);
		}
	}
	
	//notify this Table object that the student has changed the table
	this.studentTableChanged();
};

/**
 * Set the tableChanged boolean to true
 */
Table.prototype.studentTableChanged = function() {
	this.tableChanged = true;
};

/**
 * Set the reponseChanged boolean to true
 */
Table.prototype.studentResponseChanged = function() {
	this.responseChanged = true;
};

//used to notify scriptloader that this script has finished loading
if(typeof eventManager != 'undefined'){
	/*
	 * TODO: rename template to your new folder name
	 * TODO: rename template.js
	 * 
	 * e.g. if you were creating a quiz step it would look like
	 * 
	 * eventManager.fire('scriptLoaded', 'vle/node/quiz/quiz.js');
	 */
	eventManager.fire('scriptLoaded', 'vle/node/table/table.js');
}