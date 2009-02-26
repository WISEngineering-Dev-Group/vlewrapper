FillinNode.prototype = new Node();
FillinNode.prototype.constructor = FillinNode;
FillinNode.prototype.parent = Node.prototype;
function FillinNode(nodeType) {
	this.type = nodeType;
}

FillinNode.prototype.render = function(contentpanel) {
	window.frames["ifrm"].location = "js/node/fillin/fillin.html";
} 


FillinNode.prototype.load = function() {
	window.frames["ifrm"].loadXMLString("<assessmentItem xmlns='http://www.imsglobal.org/xsd/imsqti_v2p0' xmlns:xsi='http://www.w3.org/2001/XMLSchema-instance' xsi:schemaLocation='http://www.imsglobal.org/xsd/imsqti_v2p0 imsqti_v2p0.xsd' identifier='textEntry' title='Dido' adaptive='false' timeDependent='false'><responseDeclaration identifier='response_0' cardinality='single' baseType='string'><correctResponse><value>meiosis</value></correctResponse><mapping defaultValue='0'><mapEntry mapKey='meiosis' mappedValue='1'/><mapEntry mapKey='Meiosis' mappedValue='1'/></mapping></responseDeclaration><responseDeclaration identifier='response_1' cardinality='single' baseType='string'><correctResponse><value>two</value></correctResponse><mapping defaultValue='0'><mapEntry mapKey='two' mappedValue='1'/><mapEntry mapKey='2' mappedValue='1'/></mapping></responseDeclaration><responseDeclaration identifier='response_2' cardinality='single' baseType='string'><correctResponse><value>four</value></correctResponse><mapping defaultValue='0'><mapEntry mapKey='four' mappedValue='1'/><mapEntry mapKey='4' mappedValue='1'/></mapping></responseDeclaration><outcomeDeclaration identifier='SCORE' cardinality='single' baseType='float'/><itemBody><htmltext>&lt;p&gt;&lt;/p&gt;&lt;p&gt; During </htmltext><textEntryInteraction responseIdentifier='response_0' expectedLength='10'/><htmltext>(1 word), the genome of a diploid germ cell, which is composed of long segments of DNA packaged into chromosomes, undergoes DNA replication followed by</htmltext><textEntryInteraction responseIdentifier='response_1' expectedLength='5'/><htmltext>(1 number) rounds of division, resulting in </htmltext><textEntryInteraction responseIdentifier='response_2' expectedLength='5'/><htmltext>(1 number) haploid cells.&lt;/p&gt;</htmltext></itemBody><responseProcessing template='http://www.imsglobal.org/question/qti_v2p0/rptemplates/map_response'/></assessmentItem>");
}
