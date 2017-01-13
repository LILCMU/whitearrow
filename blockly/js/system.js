var workspace = Blockly.inject(document.getElementById('blocklyDiv'),
        {
            media: 'media/',
            toolbox: document.getElementById('toolbox'),
            zoom:
                {controls: true,
                wheel: false,
                  startScale: 1.0,
              maxScale: 1.5,
              minScale: 0.8,
              scaleSpeed: 1.2},
            trashcan: true


       });
   
function generate() {
      // Parse the XML into a tree.

      var code = Blockly.Python.workspaceToCode(workspace);
      document.getElementById('code_output').value = code;

    }

function generateXML() {

     var xmlDom = Blockly.Xml.workspaceToDom(workspace);
  	var xmlText = Blockly.Xml.domToPrettyText(xmlDom);
  	 document.getElementById('code_output').value = xmlText;
    }

function Savecode() {
	var code = Blockly.Python.workspaceToCode(workspace);
    var nameInput = document.getElementById('filename').value;
    if(!nameInput ? alert("Please fill name"):download(nameInput+'.py', code));

    
    }
function save() {


      var xml = Blockly.Xml.workspaceToDom(workspace);
  var xml_text = Blockly.Xml.domToText(xml);
     var nameInput = document.getElementById('filename').value;
    if(!nameInput ? alert("Please fill name"):download(nameInput+'.xml', xml_text));
    
    
    }
function loadXml() {
 var parseInputXMLfile = function(e) {
    var xmlFile = e.target.files[0];
    var filename = xmlFile.name;
    var extensionPosition = filename.lastIndexOf('.');
    if (extensionPosition !== -1) {
      filename = filename.substr(0, extensionPosition);
    }

    var reader = new FileReader();
    reader.onload = function() {
    	var xml = Blockly.Xml.textToDom(reader.result);
    	Blockly.Xml.domToWorkspace(workspace, xml);
     console.log(reader.result);
      
    };
    reader.readAsText(xmlFile);
  };

  // Create once invisible browse button with event listener, and click it
  var selectFile = document.getElementById('select_file');
  if (selectFile === null) {
    var selectFileDom = document.createElement('INPUT');
    selectFileDom.type = 'file';
    selectFileDom.id = 'select_file';

    var selectFileWrapperDom = document.createElement('DIV');
    selectFileWrapperDom.id = 'select_file_wrapper';
    selectFileWrapperDom.style.display = 'none';
    selectFileWrapperDom.appendChild(selectFileDom);

    document.body.appendChild(selectFileWrapperDom);
    selectFile = document.getElementById('select_file');
    selectFile.addEventListener('change', parseInputXMLfile, false);
  }
  selectFile.click();
    }
   

function showCode() {
      // Generate JavaScript code and display it.
      Blockly.Python.INFINITE_LOOP_TRAP = null;
      var code = Blockly.Python.workspaceToCode(workspace);
      alert(code);
    }




function autosaveBlock(){
	var xml = Blockly.Xml.workspaceToDom(workspace);
	var data = Blockly.Xml.domToText(xml);


	// Store data in blob.
	window.localStorage.setItem('autoSaveBlock', data);
}

function autoloadBlock(){
	
	console.log('-- Loading saved code.')
	var xml = Blockly.Xml.textToDom('<xml><block type="controls_main" x="229" y="170"></block></xml>');
	xml.editable = false;
	xml.deletable = false;
	workspace.clear();
	Blockly.Xml.domToWorkspace(workspace, xml);



	var loadedBlock = window.localStorage.getItem('autoSaveBlock');
	console.log(loadedBlock)

	if (!loadedBlock) return;
	if (!(loadedBlock.split('<block type="controls_main"')[1])) {
		loadedBlock = loadedBlock.split('</xml>')[0]+'<block type="controls_main" x="229" y="170"></block></xml>';
	}
	try {
	  var xml = Blockly.Xml.textToDom(loadedBlock);
	} catch (e) {

	  return;
	}
	if(xml.childElementCount == 0) return;
	workspace.clear();
	Blockly.Xml.domToWorkspace(workspace, xml);
}

function loadAddons() {
var path="";
$.get( "http://10.10.184.230:100/nsc2017/block/getblock", function( data ) {
  console.log(data.files)
 	 var s = document.createElement("script");
	s.type = "text/javascript";
	s.src = data.files;
	$("head").append(s);
  
  console.log(data.xml)

  var xmlToolbox = document.getElementById('toolbox');
  console.log(xmlToolbox);
  var addons = document.createElement('category');
  var categoryTitle ='Addons';
  addons.id = 'catControls'
  addons.setAttribute('colour', 210);
  addons.setAttribute('name', "Add-ons");
  var b1 =document.createElement('block')
  b1.setAttribute('type',"hello")
  addons.appendChild(b1)
  xmlToolbox.appendChild(addons);
  workspace.updateToolbox(xmlToolbox);

  console.log( "Load was performed." );
}).done(function() {

  });


};






setInterval(function(){
		autosaveBlock();
	}, 100);
	autoloadBlock();


	