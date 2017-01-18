Blockly.Blocks['pin_module'] = {
    init: function() {
        this.appendDummyInput()
            .appendField("Import PIN");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(180);
        this.setTooltip('');
        this.setHelpUrl('');
    }
};

Blockly.Python['pin_module'] = function(block) {
    // TODO: Assemble Python into code variable.
    var code = 'from machine import Pin\n';
    return code;
};



Blockly.Blocks['io_output'] = {
    init: function() {
        this.appendValueInput("onoff_value")
            .setCheck("Boolean")
            .appendField("Output PIN")
            .appendField(new Blockly.FieldDropdown([
                ["GPIO 0", "0"],
                ["GPIO 2", "2"],
                ["GPIO 4", "4"],
                ["GPIO 5", "5"],
                ["GPIO 12", "12"],
                ["GPIO 13", "13"],
                ["GPIO 14", "14"],
                ["GPIO 15", "15"],
                ["GPIO 16", "16"]
            ]), "pin_id");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(180);
        this.setTooltip('');
        this.setHelpUrl('');
    }
};

Blockly.Python['io_output'] = function(block) {
    var dropdown_pin_id = block.getFieldValue('pin_id');
    var value_onoff_value = Blockly.Python.valueToCode(block, 'onoff_value', Blockly.Python.ORDER_ATOMIC);
    // TODO: Assemble Python into code variable.
    var code = 'pin' + dropdown_pin_id + '.value' + value_onoff_value + '\n';
    return code;
};

Blockly.Blocks['io_hl'] = {
    init: function() {
        this.appendDummyInput()
            .appendField(new Blockly.FieldDropdown([
                ["High", "1"],
                ["Low", "0"]
            ]), "value");
        this.setOutput(true, null);
        this.setColour(180);
        this.setTooltip('');
        this.setHelpUrl('');
    }
};

Blockly.Python['io_hl'] = function(block) {
    var dropdown_value = block.getFieldValue('value');
    // TODO: Assemble Python into code variable.
    var code = dropdown_value;
    // TODO: Change ORDER_NONE to the correct strength.
    return [code, Blockly.Python.ORDER_NONE];
};

Blockly.Blocks['io_input'] = {
    init: function() {
        this.appendDummyInput()
            .appendField("Read PIN")
            .appendField(new Blockly.FieldDropdown([
                ["GPIO 0", "0"],
                ["GPIO 2", "2"],
                ["GPIO 4", "4"],
                ["GPIO 5", "5"],
                ["GPIO 12", "12"],
                ["GPIO 13", "13"],
                ["GPIO 14", "14"],
                ["GPIO 15", "15"],
                ["GPIO 16", "16"]
            ]), "pin_id")
        this.setOutput(true, null);
        this.setColour(180);
        this.setTooltip('');
        this.setHelpUrl('');
    }
};

Blockly.Python['io_input'] = function(block) {
    var dropdown_pin_id = block.getFieldValue('pin_id');
    // TODO: Assemble Python into code variable.
    var code = 'pin' + dropdown_pin_id + '.value()';
    // TODO: Change ORDER_NONE to the correct strength.
    return [code, Blockly.Python.ORDER_NONE];
};

Blockly.Blocks['io_set_pin'] = {
    init: function() {
        this.appendDummyInput()
            .appendField("Set PIN")
            .appendField(new Blockly.FieldDropdown([
                ["GPIO 0", "0"],
                ["GPIO 2", "2"],
                ["GPIO 4", "4"],
                ["GPIO 5", "5"],
                ["GPIO 12", "12"],
                ["GPIO 13", "13"],
                ["GPIO 14", "14"],
                ["GPIO 15", "15"],
                ["GPIO 16", "16"]
            ]), "pin_id")
            .appendField("as")
            .appendField(new Blockly.FieldDropdown([
                ["Input", "In"],
                ["Output", "Out"]
            ]), "select_io");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(180);
        this.setTooltip('');
        this.setHelpUrl('');
    }
};

Blockly.Python['io_set_pin'] = function(block) {
    var dropdown_pin_id = block.getFieldValue('pin_id');
    var dropdown_select_io = block.getFieldValue('select_io');
    // TODO: Assemble Python into code variable.
    var code = 'pin' + dropdown_pin_id + ' = Pin(' + dropdown_pin_id + ',Pin.' + dropdown_select_io + ')\n';
    return code;
};
