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
    var code = 'start\ndef main():\n' + statements_a + '\nend\n';

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
    var code = 'CLIENT_ID = ubinascii.hexlify(unique_id())\nmqtt = MQTTClient(CLIENT_ID,"' + text_hostserver + '")\n';
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
    var code = "mqtt.publish(b\"" + text_topic + "\",\'" + text_msg + "',retain=True)\n";
    return code;
};

var pwm_pin = 0;
Blockly.Blocks['Pin_PWM'] = {
    init: function() {
        this.appendStatementInput("NAME")
            .setCheck(null)
            .appendField("PWM Pin")
            .appendField(new Blockly.FieldDropdown([
                ["GIPO 0", "0"],
                ["GIPO 2", "2"],
                ["GIPO 4", "4"],
                ["GIPO 5", "5"],
                ["GIPO 12", "12"],
                ["GIPO 13", "13"],
                ["GIPO 14", "14"],
                ["GIPO 15", "15"]
            ]), "Pin");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(0);
        this.setTooltip('');
        this.setHelpUrl('');
    }
};
Blockly.Python['Pin_PWM'] = function(block) {
    var dropdown_pin = block.getFieldValue('Pin');
    pwm_pin = dropdown_pin;
    var statements_name = Blockly.Python.statementToCode(block, 'NAME', true);
    statements_name = statements_name.replace(/\s/g, '');
    // console.log("1 =>" + statements_name)
    statements_name = statements_name.replace(/\$n/g, '\n');
    // console.log("2 =>" + statements_name)
    var code = 'import machine\npwm' + dropdown_pin + ' = PWM(Pin(' + dropdown_pin + '))' + statements_name + '\n';
    return code;
};
Blockly.Blocks['PWM_Freq'] = {
    init: function() {
        this.appendDummyInput()
            .setAlign(Blockly.ALIGN_RIGHT)
            .appendField("PWM frequency")
            .appendField(new Blockly.FieldNumber(0, 0, 1000), "freq");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(0);
        this.setTooltip('');
        this.setHelpUrl('');
    }
};
Blockly.Python['PWM_Freq'] = function(block) {
    var number_freq = block.getFieldValue('freq');
    if (number_freq == 0)
        var code = '$npwm' + pwm_pin + '.freq()';
    else
        var code = '$npwm' + pwm_pin + '.freq(' + number_freq + ')';
    console.log(code);
    return code;
};

Blockly.Blocks['PWM_Duty'] = {
    init: function() {
        this.appendDummyInput()
            .setAlign(Blockly.ALIGN_RIGHT)
            .appendField("PWM duty")
            .appendField(new Blockly.FieldNumber(0, 0, 1023), "duty");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(0);
        this.setTooltip('');
        this.setHelpUrl('');
    }
};
Blockly.Python['PWM_Duty'] = function(block) {
    var number_duty = block.getFieldValue('duty');
    if (number_duty == 0)
        var code = '$npwm' + pwm_pin + '.duty()';
    else
        var code = '$npwm' + pwm_pin + '.duty(' + number_duty + ')';
    console.log(code);
    return code;
};

Blockly.Blocks['PWM_Deinit'] = {
    init: function() {
        this.appendDummyInput()
            .appendField("PWM deinit");
        this.setPreviousStatement(true, null);
        this.setColour(0);
        this.setTooltip('');
        this.setHelpUrl('');
    }
};
Blockly.Python['PWM_Deinit'] = function(block) {
    var code = 'pwm' + pwm_pin + '.deinit()';
    return code;
};

Blockly.Blocks['i2c_read'] = {
    init: function() {
        this.appendDummyInput()
            .appendField("i2c-Read scl Pin")
            .appendField(new Blockly.FieldDropdown([
                ["GIPO  0", "0"],
                ["GIPO 1", "1"],
                ["GIPO 2", "2"],
                ["GIPO 3", "3"],
                ["GIPO 4", "4"],
                ["GIPO 5", "5"],
                ["GIPO 12", "12"],
                ["GIPO 13", "13"],
                ["GIPO 14", "14"],
                ["GIPO 15", "15"]
            ]), "scl_pin")
            .appendField("  sda Pin")
            .appendField(new Blockly.FieldDropdown([
                ["GIPO  0", "0"],
                ["GIPO 1", "1"],
                ["GIPO 2", "2"],
                ["GIPO 3", "3"],
                ["GIPO 4", "4"],
                ["GIPO 5", "5"],
                ["GIPO 12", "12"],
                ["GIPO 13", "13"],
                ["GIPO 14", "14"],
                ["GIPO 15", "15"]
            ]), "sda_pin")
            .appendField("  address")
            .appendField(new Blockly.FieldTextInput("0x00"), "address");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(230);
        this.setTooltip('');
        this.setHelpUrl('');
    }
};
Blockly.Python['i2c_read'] = function(block) {
    var dropdown_scl_pin = block.getFieldValue('scl_pin');
    var dropdown_sda_pin = block.getFieldValue('sda_pin');
    var text_address = block.getFieldValue('address');
    var code = 'import machine\ni2c = I2C(scl=Pin(' + dropdown_scl_pin + '), sda=Pin(' + dropdown_sda_pin + "))\ni2c.readfrom(" + text_address + ", 4)";
    return code;
};

Blockly.Blocks['i2c_write'] = {
    init: function() {
        this.appendValueInput("NAME")
            .setCheck(["String", "Array"])
            .appendField("i2c-Write scl Pin")
            .appendField(new Blockly.FieldDropdown([
                ["GIPO  0", "0"],
                ["GIPO 1", "1"],
                ["GIPO 2", "2"],
                ["GIPO 3", "3"],
                ["GIPO 4", "4"],
                ["GIPO 5", "5"],
                ["GIPO 12", "12"],
                ["GIPO 13", "13"],
                ["GIPO 14", "14"],
                ["GIPO 15", "15"]
            ]), "scl_pin")
            .appendField("  sda Pin")
            .appendField(new Blockly.FieldDropdown([
                ["GIPO  0", "0"],
                ["GIPO 1", "1"],
                ["GIPO 2", "2"],
                ["GIPO 3", "3"],
                ["GIPO 4", "4"],
                ["GIPO 5", "5"],
                ["GIPO 12", "12"],
                ["GIPO 13", "13"],
                ["GIPO 14", "14"],
                ["GIPO 15", "15"]
            ]), "sda_pin")
            .appendField("  address")
            .appendField(new Blockly.FieldTextInput("0x00"), "address");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(230);
        this.setTooltip('');
        this.setHelpUrl('');
    }
};
Blockly.Python['i2c_write'] = function(block) {
    var dropdown_scl_pin = block.getFieldValue('scl_pin');
    var dropdown_sda_pin = block.getFieldValue('sda_pin');
    var text_address = block.getFieldValue('address');
    var value_name = Blockly.Python.valueToCode(block, 'NAME', Blockly.Python.ORDER_ATOMIC);
    var code = 'import machine\ni2c = I2C(scl=Pin(' + dropdown_scl_pin + '), sda=Pin(' + dropdown_sda_pin + "))\ni2c.writeto(" + text_address + ", " + value_name + ")";
    return code;
};

Blockly.Blocks['wifi_setting'] = {
    init: function() {
        this.appendStatementInput("Wifi_Mode")
            .setCheck(null)
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
    var statements_wifi = Blockly.Python.statementToCode(block, 'Wifi_Mode', true);
    statements_wifi = statements_wifi.replace(/\s/g, '');
    statements_wifi = statements_wifi.replace(/\$n/g, '\n');
    // var value_wifi_mode = Blockly.Python.valueToCode(block, 'Wifi Mode', Blockly.Python.ORDER_ATOMIC);
    // TODO: Assemble JavaScript into code variable.
    var code = 'from network import WLAN\nwlan = network.WLAN(network.' + dropdown_mode + ')\n' + 'wlan.active(' + dropdown_state + ')' + statements_wifi + '\n';
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
    var code = '$nwlan.connect(' + text_ssid + ', ' + text_pw + ')';
    return code;
};

Blockly.Blocks['check_network'] = {
    init: function() {
        this.appendDummyInput()
            .appendField("Check Network Status ")
            .appendField(new Blockly.FieldDropdown([
                ["Access Point", "AP_IF"],
                ["Station", "STA_IF"]
            ]), "Interfaces");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(90);
        this.setTooltip('');
    }
};

Blockly.Python['check_network'] = function(block) {
    var dropdown_interfaces = block.getFieldValue('Interfaces');
    var code = '$nwlan.ifconfig()';
    return code;
};

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

Blockly.Blocks['time_delay'] = {
    init: function() {
        this.appendValueInput("in_value")
            .setCheck("Number")
            .appendField("Wait");
        this.appendDummyInput()
            .appendField(new Blockly.FieldDropdown([
                ["second(s)", "second"],
                ["millisecond(s)", "milli"],
                ["microsecond(s)", "micro"]
            ]), "prefix_second");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(270);
        this.setTooltip('');
        this.setHelpUrl('');
    }
};

Blockly.Python['time_delay'] = function(block) {
    var value_in_value = Blockly.Python.valueToCode(block, 'in_value', Blockly.Python.ORDER_ATOMIC);
    var dropdown_prefix_second = block.getFieldValue('prefix_second');
    // TODO: Assemble Python into code variable.
    if (dropdown_prefix_second == 'second') {
        var code = 'import time\ntime.sleep(' + value_in_value + ')\n'
    } else if (dropdown_prefix_second == 'milli') {
        var code = 'import time\ntime.sleep_ms(' + value_in_value + ')\n'
    } else if (dropdown_prefix_second == 'micro') {
        var code = 'import time\ntime.sleep_us(' + value_in_value + ')\n'
    }
    return code;
};
