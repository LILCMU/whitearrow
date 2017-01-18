Blockly.Blocks['network_module'] = {
    init: function() {
        this.appendDummyInput()
            .appendField("Import Network");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(90);
        this.setTooltip('');
        this.setHelpUrl('');
    }
};

Blockly.Python['network_module'] = function(block) {
    // TODO: Assemble Python into code variable.
    var code = 'import network\n';
    return code;
};

Blockly.Blocks['wifi_setting'] = {
    init: function() {
        this.appendDummyInput("Wifi Mode")
            // .setCheck(null)
            .appendField("Set WiFi Mode")
            .appendField(new Blockly.FieldDropdown([
                ["Access Point", "AP_IF"],
                ["Station (Other WiFi)", "STA_IF"]
            ]), "Mode")
            .appendField("Active")
            .appendField(new Blockly.FieldDropdown([
                ["Enable", "True"],
                ["Disable", "False"]
            ]), "State");
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
    var code = 'wlan = network.WLAN(network.' + dropdown_mode + ')\n' + 'wlan.active(' + dropdown_state + ')\n';
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
    var code = 'wlan.connect(' + text_ssid + ', ' + text_pw + ')\n';
    return code;
};

Blockly.Blocks['check_network'] = {
    init: function() {
        this.appendDummyInput()
            .appendField("Check Network Status ")
        this.setOutput(true, null);
        this.setColour(90);
        this.setTooltip('');
    }
};

Blockly.Python['check_network'] = function(block) {
    var code = 'wlan.ifconfig()';
    return [code, Blockly.Python.ORDER_NONE];
};
