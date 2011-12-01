/*
 * the scripts that are always necessary regardless of whether the
 * user is using the vle, authoring tool, or grading tool
 */
var coreScripts = [
	'vle/node/designWall/DesignWallNode.js',
	'vle/node/designWall/designWallEvents.js'
];

//the scripts used in the vle
var studentVLEScripts = [
	'vle/node/designWall/designWall.js',
	'vle/node/designWall/designWallState.js',
	'vle/jquery/js/jquery-1.4.4.min.js',
	'vle/jquery/js/jquery-ui-1.8.7.custom.min.js'
];
/*
	'vle/tinymce/jscripts/tiny_mce/tiny_mce.js',
	'vle/node/designWall/designWallTinyMCE.js',
*/

//the scripts used in the authoring tool
var authorScripts = [
	'vle/node/designWall/authorview_designWall.js'
];

//the scripts used in the grading tool
var gradingScripts = [
	'vle/node/designWall/designWallState.js'
];

//dependencies when a file requires another file to be loaded before it
var dependencies = [
	{child:"vle/node/designWall/DesignWallNode.js", parent:["vle/node/Node.js"]}
];
/*
	{child:"vle/node/designWall/DesignWallTinyMCE.js", parent:["vle/tinymce/jscripts/tiny_mce/tiny_mce.js"]},
*/
var nodeClasses = [
	{nodeClass:'display', nodeClassText:'DesignWall'}
];

scriptloader.addScriptToComponent('core', coreScripts);
scriptloader.addScriptToComponent('core_min', coreScripts);
scriptloader.addScriptToComponent('designWall', studentVLEScripts);
scriptloader.addScriptToComponent('author', authorScripts);
scriptloader.addScriptToComponent('studentwork', gradingScripts);
scriptloader.addScriptToComponent('studentwork_min', gradingScripts);
scriptloader.addDependencies(dependencies);

componentloader.addNodeClasses('DesignWallNode', nodeClasses);

var css = [
       	"vle/node/designWall/designWall.css"
];

scriptloader.addCssToComponent('designWall', css);

var nodeTemplateParams = [
	{
		nodeTemplateFilePath:'node/designWall/designWallTemplate.dw',
		nodeExtension:'dw'
	}
];

componentloader.addNodeTemplateParams('DesignWallNode', nodeTemplateParams);

//used to notify scriptloader that this script has finished loading
if(typeof eventManager != 'undefined'){
	eventManager.fire('scriptLoaded', 'vle/node/designWall/setup.js');
};
