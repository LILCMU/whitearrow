Blockly.Blocks['hello'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("my name is ")
        .appendField(new Blockly.FieldTextInput("default"), "NAME");
    this.setOutput(true, null);
    this.setColour(165);
    this.setTooltip('');
    this.setHelpUrl('');
  }
};

Blockly.Python['hello'] = function(block) {
  var text_name = block.getFieldValue('NAME');
  // TODO: Assemble Python into code variable.
  var code = "print 'My name is '" + text_name + "\n";
  // TODO: Change ORDER_NONE to the correct strength.
  return [code, Blockly.Python.ORDER_NONE];
};
