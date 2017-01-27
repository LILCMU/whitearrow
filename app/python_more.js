Blockly.Blocks['controls_main'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Main");
    this.appendStatementInput("a")
        .setCheck(null);
    this.setColour(120);
    this.setTooltip('');
    this.setHelpUrl('http://www.example.com/');
  }
};

Blockly.Python['controls_main'] = function(block) {
  var statements_a = Blockly.Python.statementToCode(block, 'a');

  if (Blockly.Python.STATEMENT_PREFIX) {
    statements_a = Blockly.Python.prefixLines(Blockly.Python.STATEMENT_PREFIX.replace(/%1/g,
        '\'' + block.id + '\''), Blockly.Python.INDENT) + statements_a;
  }
  if (Blockly.Python.INFINITE_LOOP_TRAP) {
    statements_a = Blockly.Python.INFINITE_LOOP_TRAP.replace(/%1/g,
        '"' + block.id + '"') + statements_a;
  }
  var returnValue = Blockly.Python.valueToCode(block, 'RETURN',
      Blockly.Python.ORDER_NONE) || '';
  if (returnValue) {
    returnValue = '  return ' + returnValue + '\n';
  } else if (!statements_a) {
    statements_a = Blockly.Python.PASS;
  }
  var code = 'start\ndef main():\n'+ statements_a + '\nend\n';

  return code;
};

Blockly.Blocks['Wifi_mode'] = {
  init: function() {
    this.appendValueInput("Mode")
        .setCheck("Boolean")
        .setAlign(Blockly.ALIGN_RIGHT)
        .appendField("WIFI Mode")
        .appendField(new Blockly.FieldDropdown([["AP", "AP_IF"], ["STA", "STA_IF"]]), "Modes")
        .appendField("      Active    ");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(90);
    this.setTooltip('');
    this.setHelpUrl('http://www.example.com/');
  }
};

Blockly.Python['Wifi_mode'] = function(block) {
  var dropdown_modes = block.getFieldValue('Modes');
  var value_mode = Blockly.Python.valueToCode(block, 'Mode', Blockly.Python.ORDER_ATOMIC);
  // TODO: Assemble Python into code variable.
  var code = 'wlan = network.WLAN(network.'+dropdown_modes+')\n'+'wlan.active('+value_mode+')\n';
  return code;
};



Blockly.Blocks['mqtt_init'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("MQTT START")
        .appendField(new Blockly.FieldTextInput("Host"), "hostServer");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(20);
    this.setTooltip('');
  }
};

Blockly.Python['mqtt_init'] = function(block) {
  var text_hostserver = block.getFieldValue('hostServer');
  // TODO: Assemble JavaScript into code variable.
  var code = 'CLIENT_ID = ubinascii.hexlify(unique_id())\nmqtt = MQTTClient(CLIENT_ID,"' + text_hostserver +'")\n';
  return code;
};

Blockly.Blocks['mqtt_connect'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("MQTT Connect");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(20);
    this.setTooltip('');
  }
};

Blockly.Python['mqtt_connect'] = function(block) {
  // TODO: Assemble JavaScript into code variable.
  var code = 'mqtt.connect()\n';
  return code;
};

Blockly.Blocks['mqtt_disconnect'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("MQTT Disconnect");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(20);
    this.setTooltip('');
  }
};

Blockly.Python['mqtt_disconnect'] = function(block) {
  // TODO: Assemble JavaScript into code variable.
  var code = 'mqtt.disconnect()\n';
  return code;
};

Blockly.Blocks['mqtt_publish'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("MQTT Publish       ")
        .appendField(new Blockly.FieldTextInput("topic"), "Topic")
        .appendField("     Message:   ")
        .appendField(new Blockly.FieldTextInput("Message"), "Msg")
        .appendField("     Retain:")
        .appendField(new Blockly.FieldCheckbox("TRUE"), "retain");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(20);
    this.setTooltip('');
  }
};

Blockly.Python['mqtt_publish'] = function(block) {
  var text_topic = block.getFieldValue('Topic');
  var text_msg = block.getFieldValue('Msg');
  var checkbox_retain = block.getFieldValue('retain') == 'TRUE';
  // TODO: Assemble JavaScript into code variable.
  var code = "mqtt.publish(b\""+ text_topic+"\",\'"+text_msg+"',retain=True)\n";
  return code;
};
