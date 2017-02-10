
function menu2(){
generate();
  $('#Editor1').show();
  editor.resize();
  $('#Blockly').hide();
  $('.blocklyToolboxDiv').hide();
  $('#monitor').hide();
  $('#FileMannger').hide();
  $('#Message').hide();
}

function menu3(){
  
  
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
  refreshFile()
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
