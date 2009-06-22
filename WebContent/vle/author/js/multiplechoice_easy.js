var xmlPage;
var saved = true;

var ddList = [];

/*****											    *****|
 * The following functions are used by YUI for the drag *|
 * and drop stuff on this page						    *|
 *****											    *****/
function generateDD(){
	//clear previous list of draggable elements
	ddList = [];
	
	YUI().use('dd-constrain', 'dd-proxy', 'dd-drop', function(Y) {
	    //Listen for all drop:over events
	    Y.DD.DDM.on('drop:over', function(e) {
	        //Get a reference to out drag and drop nodes
	        var drag = e.drag.get('node'),
	            drop = e.drop.get('node');
	        
	        //Are we dropping on a li node?
	        if (drop.get('tagName').toLowerCase() === 'li') {
	            //Are we not going up?
	            if (!goingUp) {
	                drop = drop.get('nextSibling');
	            }
	            //Add the node to this list
	            e.drop.get('node').get('parentNode').insertBefore(drag, drop);
	            //Resize this nodes shim, so we can drop on it later.
	            e.drop.sizeShim();
	        }
	    });
	    //Listen for all drag:drag events
	    Y.DD.DDM.on('drag:drag', function(e) {
	        //Get the last y point
	        var y = e.target.lastXY[1];
	        //is it greater than the lastY var?
	        if (y < lastY) {
	            //We are going up
	            goingUp = true;
	        } else {
	            //We are going down..
	            goingUp = false;
	        }
	        //Cache for next check
	        lastY = y;
	    });
	    //Listen for all drag:start events
	    Y.DD.DDM.on('drag:start', function(e) {
	        //Get our drag object
	        var drag = e.target;
	        //Set some styles here
	        drag.get('node').setStyle('opacity', '.25');
	        drag.get('dragNode').set('innerHTML', drag.get('node').get('innerHTML'));
	        drag.get('dragNode').setStyles({
	            opacity: '.5',
	            borderColor: drag.get('node').getStyle('borderColor'),
	            backgroundColor: drag.get('node').getStyle('backgroundColor')
	        });
	    });
	    //Listen for a drag:end events
	    Y.DD.DDM.on('drag:end', function(e) {
	        var drag = e.target;
	        //Put out styles back
	        drag.get('node').setStyles({
	            visibility: '',
	            opacity: '1'
	        });
	        //authoringTool.onNodeDropped(drag);
	    });
	    //Listen for all drag:drophit events
	    Y.DD.DDM.on('drag:drophit', function(e) {
	        var drop = e.drop.get('node'),
	            drag = e.drag.get('node');
	
	        //if we are not on an li, we must have been dropped on a ul
	        if (drop.get('tagName').toLowerCase() !== 'li') {
	            if (!drop.contains(drag)) {
	                drop.appendChild(drag);
	            }
	            onNodeDropped(drag, drop);
	        }
	    });
	    
	    //Static Vars
	    var goingUp = false, lastY = 0;
	
	    //Get the list of li's with class draggable in the lists and make them draggable
	    var lis = Y.Node.all('#answerDiv ul li.draggable');
	    if (lis != null) {
	    	lis.each(function(v, k) {
	    		var dd = new Y.DD.Drag({
	    			node: v,
	    			proxy: true,
	    			moveOnEnd: false,
	    			constrain2node: '#answerDiv',
	    			target: {
	    			padding: '0 0 0 20'
	    		}
	    		});
	    		ddList.push(dd);
	    	});
	    }
	
	    //Create simple targets for the lists..
	    var uls = Y.Node.all('#answerDiv ul');    
	    uls.each(function(v, k) {
	        var tar = new Y.DD.Drop({
	            node: v
	        });
	    });
	});
};

function onNodeDropped(dragged, dropped){
	sourceUpdated();
};
/*****												******|
 * End functions used by YUI for the drag and drop stuff *|
 *****												******/

/**
 * Removes previous elements and generates a new page with the
 * appropriate elements from this xmlPage
 */
function generatePage(){
	var parent = document.getElementById('dynamicParent');
	
	//wipe out old
	parent.removeChild(document.getElementById('dynamicPage'));
	
	//create new
	var pageDiv = createElement(document, 'div', {id:'dynamicPage'});
	var promptText = document.createTextNode('Edit prompt: ');
	var answerText = document.createTextNode('Answers & Feedback:');
	var shuffleText = document.createTextNode('Shuffle answers before next try');
	var feedbackText = document.createTextNode('Feedback Options');
	
	pageDiv.appendChild(shuffleText);
	pageDiv.appendChild(createBreak());
	pageDiv.appendChild(generateShuffle());
	pageDiv.appendChild(createBreak());
	pageDiv.appendChild(feedbackText);
	pageDiv.appendChild(createBreak());
	pageDiv.appendChild(generateFeedbackOptions());
	pageDiv.appendChild(createBreak());
	pageDiv.appendChild(promptText);
	pageDiv.appendChild(createBreak());
	pageDiv.appendChild(generatePrompt());
	pageDiv.appendChild(createBreak());
	pageDiv.appendChild(createBreak());
	pageDiv.appendChild(answerText);
	pageDiv.appendChild(generateAnswers());
	pageDiv.appendChild(createBreak());
	pageDiv.appendChild(createElement(document, 'input', {type: "button", id: "createNewButton", value: "Create New Answer", onclick: "createNewChoice()"}));
	pageDiv.appendChild(createElement(document, 'input', {type: "button", value: "Reset Correct Answer selection", onclick: "clearCorrectChoice()"}));
	
	parent.appendChild(pageDiv);
	
	generateDD();
};

function generateShuffle(){
	var shuffleVal = xmlPage.getElementsByTagName('choiceInteraction')[0].getAttribute('shuffle');
	var shuffleDiv = createElement(document, 'div', {id: "shuffleDiv"});
	var shuffleTrue = createElement(document, 'input', {type: 'radio', name: 'shuffleOption', value: "true", onclick: "shuffleChange('true')"});
	var shuffleFalse = createElement(document, 'input', {type: 'radio', name: 'shuffleOption', value: "false", onclick: "shuffleChange('false')"});
	var trueText = createElement(document, 'label');
	trueText.innerHTML = 'shuffle choices';
	var falseText = createElement(document, 'label');
	falseText.innerHTML = 'do NOT shuffle choices';

	shuffleDiv.appendChild(shuffleTrue);
	shuffleDiv.appendChild(trueText);
	shuffleDiv.appendChild(createBreak());
	shuffleDiv.appendChild(shuffleFalse);
	shuffleDiv.appendChild(falseText);
	
	if(shuffleVal=='true'){
		shuffleTrue.checked = true;
	} else {
		shuffleFalse.checked = true;
	};
	return shuffleDiv;
};

function generateFeedbackOptions(){
	var feedbackVal = xmlPage.getElementsByTagName('choiceInteraction')[0].getAttribute('hasInlineFeedback');
	var feedbackOptionDiv = createElement(document, 'div', {id: 'feedbackOptionsDiv'});
	var feedbackOptionTrue = createElement(document, 'input', {type: 'radio', name: 'feedbackOption', value: "true", onclick: "feedbackOptionChange('true')"});
	var feedbackOptionFalse = createElement(document, 'input', {type: 'radio', name: 'feedbackOption', value: "false", onclick: "feedbackOptionChange('false')"});
	var trueText = createElement(document, 'label');
	trueText.innerHTML = 'has inline feedback';
	var falseText = createElement(document, 'label');
	falseText.innerHTML = 'does NOT have inline feedback';
	
	feedbackOptionDiv.appendChild(feedbackOptionTrue);
	feedbackOptionDiv.appendChild(trueText);
	feedbackOptionDiv.appendChild(createBreak());
	feedbackOptionDiv.appendChild(feedbackOptionFalse);
	feedbackOptionDiv.appendChild(falseText);
	
	if(feedbackVal=='true'){
		feedbackOptionTrue.checked = true;
	} else {
		feedbackOptionFalse.checked = true;
	};
	return feedbackOptionDiv;
};

/**
 * Creates and returns a prompt element that contains the prompt
 * for this xmlPage
 */
function generatePrompt(){
	if(xmlPage.getElementsByTagName('prompt')[0].firstChild){
		var prompt = xmlPage.getElementsByTagName('prompt')[0].firstChild.nodeValue;
	} else {
		var prompt = "";
	};
	var promptInput = createElement(document, 'textarea', {id: 'promptText', name: 'promptText', cols: '85', rows: '8', wrap: 'hard', onkeyup: "sourceUpdated()"});
	promptInput.value = prompt;
	return promptInput 
};

/**
 * Returns an element that contains the possible answers to the prompt for
 * this xmlPage with the appopriate feedback element
 */
function generateAnswers(){
	var answerElements = [];
	var answerDiv = createElement(document, 'div', {id: 'answerDiv', name: 'answerDiv'});
	var answerUL = createElement(document, 'ul', {id: 'answerUL', class: 'container'});
	
	
	var answers = xmlPage.getElementsByTagName('simpleChoice');
	for(var h=0;h<answers.length;h++){
		var answerText = null;
		var answerTextLabel = document.createTextNode('Answer: ');
		var feedbackTextLabel = document.createTextNode('Feedback:');
		feedback = generateFeedback(answers[h], h);
		options = generateOptions(h, answers.length);
		for(var n=0;n<answers[h].childNodes.length;n++){
			if(answers[h].childNodes[n].nodeValue!=null){
				answerText = answers[h].childNodes[n].nodeValue;
			};
		};
		var answerLI = createElement(document, 'li', {id: 'answerLI_' + h, name: 'answerLI', class: 'draggable'});
		var answer = createElement(document, 'input', {type: 'text', name: "answerInput", value: answerText, wrap: 'hard', onkeyup: "sourceUpdated()"});
		answerLI.appendChild(answerTextLabel);
		answerLI.appendChild(answer);
		answerLI.appendChild(createBreak());
		answerLI.appendChild(feedbackTextLabel);
		answerLI.appendChild(feedback);
		answerLI.appendChild(createBreak());
		answerLI.appendChild(options);
		answerUL.appendChild(answerLI);
	};
	
	answerDiv.appendChild(answerUL);
	return answerDiv;
};

/**
 * Generates a text input element with associated feedback as value for a simpleChoice
 * xml when inline feedback exists and is specified for the entire MC question, otherwise
 * feedback is not available
 */
function generateFeedback(simpleChoice, index){
	var feedback = simpleChoice.getElementsByTagName('feedbackInline');
	if(hasInlineFeedback()){
		if(feedback==null || feedback[0]==null){
			createNewFeedback(simpleChoice);
			feedback = simpleChoice.getElementsByTagName('feedbackInline');
		};
		var feedbackEl = createElement(document, 'input', {type: 'text', wrap: 'hard', id: 'feedbackInput_' + index, name: "feedbackInput", onkeyup: "sourceUpdated()"});
		feedbackEl.value = feedback[0].firstChild.nodeValue;
	} else {
		var feedbackEl = createElement(document, 'div', {id: 'feedbackInput_' + index, name: 'feedbackInput_' + index});
	};
	return feedbackEl;
};

/**
 * Generates and returns an option element that contains all the available options
 * for the given simpleChoice XML.
 */
function generateOptions(index, length){
	var options = createElement(document, 'div');
	var outStr;
	
	if(xmlPage.getElementsByTagName('correctResponse')[0].getAttribute('interpretation') == xmlPage.getElementsByTagName('simpleChoice')[index].getAttribute('identifier')){
		outStr = '<input CHECKED type="radio" name="correctRadio" value="' + index + '" onclick="correctChoiceChange(' + index + ')">This is the correct Choice ';
	} else {
		outStr = '<input type="radio" name="correctRadio" value="' + index + '" onclick="correctChoiceChange(' + index + ')">This is the correct Choice ';
	};
	
	outStr = outStr + '<a href="#" onclick="removeChoice(' + index + ')">Remove Choice</a>';
	
	options.innerHTML = outStr;
	return options;
};

function createPrompt(){
	var prompt = xmlPage.createElement('prompt');
	var promptText = xmlPage.createTextNode(document.getElementById('promptText').value);
	prompt.appendChild(promptText);
	return prompt;
};

function createAnswer(parent){
	var answers = document.getElementsByName('answerLI');
	for(var d=0;d<answers.length;d++){
		var answer = answers[d].childNodes[1];
		var feedback = answers[d].childNodes[4];
		var simpleChoice = xmlPage.createElement('simpleChoice');
		var simpleText = xmlPage.createTextNode(answer.value);
		simpleChoice.setAttribute('fixed', "true");
		simpleChoice.setAttribute('identifier', "choice " + (d + 1));
		
		if(feedback!=null && feedback.getAttribute('type')=='text'){
			simpleChoice.appendChild(createFeedback(feedback, simpleChoice.getAttribute('identifier')));
		};
		
		if(answers[d].childNodes[6].childNodes[0].checked){
			xmlPage.getElementsByTagName('correctResponse')[0].setAttribute('interpretation', simpleChoice.getAttribute('identifier'));	
		};
		
		simpleChoice.appendChild(simpleText);
		parent.appendChild(simpleChoice);
	};
};

function createFeedback(feedback, identifier){
	var feedbackEl = xmlPage.createElement('feedbackInline');
	var feedbackText = xmlPage.createTextNode(feedback.value);
	feedbackEl.setAttribute('show', "true");
	feedbackEl.setAttribute('identifier', identifier);
	feedbackEl.appendChild(feedbackText);
	return feedbackEl;
};

function removeChoice(index){
	var parent = xmlPage.getElementsByTagName('choiceInteraction')[0];
	
	if(parent.getElementsByTagName('simpleChoice')[index].getAttribute('identifier')==xmlPage.getElementsByTagName('correctResponse')[0].getAttribute('interpretation')){
		clearCorrectChoice();
	};
	parent.removeChild(parent.getElementsByTagName('simpleChoice')[index]);
	regenerateAnswers();
	sourceUpdated();
};

function createNewChoice(){
	var parent = xmlPage.getElementsByTagName('choiceInteraction')[0];
	var numOfAnswers = xmlPage.getElementsByTagName('simpleChoice').length;
	var simpleChoice = xmlPage.createElement('simpleChoice');
	var simpleText = xmlPage.createTextNode("");
	
	simpleChoice.setAttribute('fixed', "true");
	simpleChoice.setAttribute('identifier', "choice " + (numOfAnswers + 1));
	simpleChoice.appendChild(simpleText);
	createNewFeedback(simpleChoice);
	
	parent.appendChild(simpleChoice);
	regenerateAnswers();
	sourceUpdated();
};

function createNewFeedback(simpleChoice){
	var feedback = xmlPage.createElement('feedbackInline');
	var feedbackText = xmlPage.createTextNode('Enter your feedback here');
	feedback.setAttribute('showHide', 'show');
	feedback.setAttribute('identifier', simpleChoice.getAttribute('identifier'));
	feedback.appendChild(feedbackText);
	simpleChoice.appendChild(feedback);
};

function regenerateAnswers(){
	var parent = document.getElementById('dynamicPage');
	parent.removeChild(document.getElementById('answerDiv'));
	var answer = generateAnswers();
	var nextNode = document.getElementById('createNewButton');
	parent.insertBefore(answer, nextNode);
	generateDD();
};

function shuffleChange(val){
	xmlPage.getElementsByTagName('choiceInteraction')[0].setAttribute('shuffle', val);
	sourceUpdated();
};

function correctChoiceChange(index){
	xmlPage.getElementsByTagName('correctResponse')[0].setAttribute('interpretation', xmlPage.getElementsByTagName('simpleChoice')[index].getAttribute('identifier'));
	sourceUpdated();
};

/**
 * Removes check from all correct choice radio buttons and updates
 * xmlPage so that there is no correct choice
 */
function clearCorrectChoice(){
	var radios = document.getElementsByName('correctRadio');
	for(var p=0;p<radios.length;p++){
		radios[p].checked = false;
	};
	xmlPage.getElementsByTagName('correctResponse')[0].setAttribute('interpretation', '');
	sourceUpdated();
};

/**
 * Returns true iff all of the choice fields are not blank, 
 * otherwise, returns false
 */
function validate(){
	var choices = document.getElementsByName('answerInput');
	var empty = false;
	
	for(var c=0;c<choices.length;c++){
		if(choices[c].value==null || choices[c].value==""){
			empty = true;
		};
	};
	
	if(empty){
		alert("No choice fields are allowed to be empty or null. Exiting...");
		return false;
	};
	return true;
};

function hasInlineFeedback(){
	var feedback = xmlPage.getElementsByTagName('choiceInteraction')[0].getAttribute('hasInlineFeedback');
	if(feedback && feedback=='true'){
		return true;
	} else {
		return false;
	};
};

function feedbackOptionChange(val){
	xmlPage.getElementsByTagName(xmlPage.getElementsByTagName('choiceInteraction')[0].setAttribute('hasInlineFeedback', val));
	regenerateAnswers();
	sourceUpdated();
};

/*
 * Called when 'keyup' event is received on sourceTextArea on this page.
 * gets the text in the textarea and re-renders the previewFrame
 */
function sourceUpdated() {
	saved = false;
	//retrieve the authored text
	var parent = xmlPage.getElementsByTagName('choiceInteraction')[0];
	while(parent.firstChild){  //removes all children (prompt, simpleResponse) from choiceInteraction
		parent.removeChild(parent.firstChild);
	};
	
	parent.appendChild(createPrompt());
	createAnswer(parent);
	
	var xmlString;
	if(window.ActiveXObject) {
		xmlString = xmlPage.xml;
	} else {
		xmlString = (new XMLSerializer()).serializeToString(xmlPage);
	}

	window.frames["previewFrame"].loadFromXMLString(xmlString);
}

//used to notify scriptloader that this script has finished loading
scriptloader.scriptAvailable(scriptloader.baseUrl + "vle/author/js/multiplechoice_easy.js");