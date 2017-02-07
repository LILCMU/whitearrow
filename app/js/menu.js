
function menu2(){
  
  $('#Editor1').show();
  editor.resize();
  $('#Blockly').hide();
  $('.blocklyToolboxDiv').hide();
  $('#monitor').hide();
  $('#FileMannger').hide();
  $('#Message').hide();
}

function menu3(){
  Blockly.svgResize(workspace);
  $('#Editor1').hide();
  $('#Blockly').show();
  $('.blocklyToolboxDiv').show();
  $('#monitor').hide();
  $('#FileMannger').hide();
  $('#Message').hide();
}

function menu4(){

  $('#Editor1').hide();
  $('#Blockly').hide();
  $('.blocklyToolboxDiv').hide();
  $('#monitor').show();
  $('#FileMannger').hide();
  $('#Message').hide();
}

function menu5(){

  $('#Editor1').hide();
  $('#Blockly').hide();
  $('.blocklyToolboxDiv').hide();
  $('#monitor').hide();
  $('#FileMannger').show();
  $('#Message').hide();
}

function menu6(){

  $('#Editor1').hide();
  $('#Blockly').hide();
  $('.blocklyToolboxDiv').hide();
  $('#monitor').hide();
  $('#FileMannger').hide();
  $('#Message').show();
}
