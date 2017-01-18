Blockly.Blocks['connect_wifi'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Connect to ")
        .appendField(new Blockly.FieldTextInput("Wifi Name"), "ssid")
        .appendField(" Password")
        .appendField(new Blockly.FieldTextInput("Password"), "pw");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    // this.setOutput(true,null)
    this.setColour(90);
    this.setTooltip('');
  }
};

Blockly.Python['connect_wifi'] = function(block) {
  var text_ssid = block.getFieldValue('ssid');
  var text_pw = block.getFieldValue('pw');
  // TODO: Assemble Python into code variable.
  var code = 'wlan.connect('+text_ssid+', '+text_pw+')\n';
  return code;
};
