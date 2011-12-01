var coreScripts = [
    /*
     * TODO: rename template
     * TODO: rename TemplateNode.js
     * 
     * For example if you are creating a quiz node you would change it to
     * 'vle/node/quiz/QuizNode.js'
     */
	'vle/node/table/TableNode.js',
	/*
     * TODO: rename template
     * TODO: rename templateEvents.js
     * 
     * For example if you are creating a quiz node you would change it to
     * 'vle/node/quiz/QuizEvents.js'
	 */
	'vle/node/table/tableEvents.js'
];

var studentVLEScripts = [
 	/*
     * TODO: rename template
     * TODO: rename template.js
     * 
     * For example if you are creating a quiz node you would change it to
     * 'vle/node/quiz/quiz.js'
	 */
	'vle/node/table/table.js',
	/*
     * TODO: rename template
     * TODO: rename templatestate.js
     * 
     * For example if you are creating a quiz node you would change it to
     * 'vle/node/quiz/quizstate.js'
	 */
	'vle/node/table/tablestate.js',
	'vle/jquery/js/jquery-1.4.4.min.js',
	'vle/jquery/js/jquery-ui-1.8.7.custom.min.js'
];

var authorScripts = [
	/*
	 * TODO: rename template
	 * TODO: rename authorview_template.js
	 * 
	 * For example if you are creating a quiz node you would change it to
	 * 'vle/node/quiz/authorview_quiz.js'
	 */
	'vle/node/table/authorview_table.js'
];

var gradingScripts = [
  	/*
	 * TODO: rename template
	 * TODO: rename templatestate.js
	 * 
	 * For example if you are creating a quiz node you would change it to
	 * 'vle/node/quiz/quizstate.js'
	 */
	'vle/node/table/tablestate.js',
	'vle/node/table/table.js'
];

var dependencies = [
  	/*
	 * TODO: rename template
	 * TODO: rename TemplateNode.js
	 * 
	 * For example if you are creating a quiz node you would change it to
	 * 'vle/node/quiz/QuizNode.js'
	 */
	{child:"vle/node/table/TableNode.js", parent:["vle/node/Node.js"]}
];

/*
 * TODO: rename Template
 * 
 * For example if you are creating a quiz node you would change it to
 * 'Quiz'
 */
var nodeClasses = [
	{nodeClass:'display', nodeClassText:'Table'}
];

scriptloader.addScriptToComponent('core', coreScripts);

/*
 * TODO: rename template
 * 
 * For example if you are creating a quiz node you would change it to
 * 'quiz'
 */
scriptloader.addScriptToComponent('table', studentVLEScripts);

scriptloader.addScriptToComponent('author', authorScripts);
scriptloader.addScriptToComponent('studentwork', gradingScripts);
scriptloader.addDependencies(dependencies);

/*
 * TODO: rename TemplateNode
 * 
 * For example if you are creating a quiz node you would change it to
 * 'QuizNode'
 */
componentloader.addNodeClasses('TableNode', nodeClasses);

var nodeTemplateParams = [
	{
		/*
		 * TODO: rename the file path value
		 * 
		 * For example if you are creating a quiz node you would change it to
		 * 'node/quiz/quizTemplate.qz'
		 */
		nodeTemplateFilePath:'node/table/tableTemplate.ta',
		
		/*
		 * TODO: rename the extension value for your step type, the value of the
		 * extension is up to you, we just use it to easily differentiate between
		 * different step type files
		 * 
		 * For example if you are creating a quiz node you would change it to
		 * 'qz'
		 */
		nodeExtension:'ta'
	}
];

/*
 * TODO: rename TemplateNode
 * 
 * For example if you are creating a quiz node you would change it to
 * 'QuizNode'
 */
componentloader.addNodeTemplateParams('TableNode', nodeTemplateParams);

//used to notify scriptloader that this script has finished loading
if(typeof eventManager != 'undefined'){
	/*
	 * TODO: rename template to your new folder name
	 * 
	 * For example if you were creating a quiz step it would look like
	 * 
	 * eventManager.fire('scriptLoaded', 'vle/node/quiz/setup.js');
	 */
	eventManager.fire('scriptLoaded', 'vle/node/table/setup.js');
};