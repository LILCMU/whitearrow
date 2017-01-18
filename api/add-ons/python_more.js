Blockly.Blocks['controls_main'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Main");
    this.appendStatementInput("a")
        .setCheck(null);
    this.setColour(120);
    this.setTooltip('');
  }
};

Blockly.Python['controls_main'] = function(block) {
  var statements_a = Blockly.Python.statementToCode(block, 'a');
  // TODO: Assemble Python into code variable.
  if (Blockly.Python.STATEMENT_PREFIX) {
    statements_a = Blockly.Python.prefixLines(
        Blockly.Python.STATEMENT_PREFIX.replace(/%1/g,
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
  var code = 'def main():\n'+ statements_a + '\n';

  return code;
};

Blockly.Blocks['wifi_setting'] = {
  init: function() {
    this.appendDummyInput("Wifi Mode")
        // .setCheck(null)
        .appendField("WiFi Mode")
        .appendField(new Blockly.FieldDropdown([["Access Point", "AP_IF"], ["Station (Other WiFi)", "STA_IF"]]), "Mode")
        .appendField("Active")
        .appendField(new Blockly.FieldDropdown([["Enable", "True"], ["Disable", "False"]]), "State");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(90);
    this.setTooltip('');
  }
};

Blockly.Python['wifi_setting'] = function(block) {
  var dropdown_mode = block.getFieldValue('Mode');
  var dropdown_state = block.getFieldValue('State');
  // var value_wifi_mode = Blockly.Python.valueToCode(block, 'Wifi Mode', Blockly.Python.ORDER_ATOMIC);
  // TODO: Assemble JavaScript into code variable.
  var code = 'import network\nwlan = network.WLAN(network.'+dropdown_mode+')\n'+'wlan.active('+dropdown_state+')\n';
  return code;
};

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

Blockly.Blocks['check_network'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Check Network Status ")
        .appendField(new Blockly.FieldDropdown([["Access Point", "AP_IF"], ["Station", "STA_IF"]]), "Interfaces");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(90);
    this.setTooltip('');
  }
};

Blockly.Python['check_network'] = function(block) {
  var dropdown_interfaces = block.getFieldValue('Interfaces');
  var code = 'import network\ninterface = network.WLAN(network.'+dropdown_interfaces+')\ninterface.ifconfig()\n';
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
  var code = "mqtt.publish(\""+ text_topic+"\",\'"+text_msg+"',retain="+ checkbox_retain + ")\n";
  return code;
};

Blockly.Blocks['io_onoff'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("I/O PIN")
        .appendField(new Blockly.FieldDropdown([["GPIO 0", "0"], ["GPIO 2", "2"], ["GPIO 4", "4"], ["GPIO 5", "5"], ["GPIO 12", "12"], ["GPIO 13", "13"], ["GPIO 14", "14"], ["GPIO 15", "15"], ["GPIO 16", "16"]]), "pin_id")
        .appendField("as")
        .appendField(new Blockly.FieldDropdown([["Input", "In"], ["Output", "Out"]]), "io")
        .appendField(" OnOff")
        .appendField(new Blockly.FieldCheckbox("FALSE"), "Input");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(180);
    this.setTooltip('');
  }
};

Blockly.Python['io_onoff'] = function(block) {
  var dropdown_pin_id = block.getFieldValue('pin_id');
  var dropdown_io = block.getFieldValue('io');
  var checkbox_input = block.getFieldValue('Input') == 'TRUE';
  // TODO: Assemble Python into code variable.
  if (dropdown_io == 'In'){
    var code = 'from machine import Pin\npin'+dropdown_pin_id+' = Pin('+dropdown_pin_id+',Pin.IN)\npin'+dropdown_pin_id+'.value()\n';
  } else {
    var code = 'from machine import Pin\npin'+dropdown_pin_id+' = Pin('+dropdown_pin_id+',Pin.OUT)\npin'+dropdown_pin_id+'.value('+checkbox_input+')\n';
  }
  return code;
};
