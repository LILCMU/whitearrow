Blockly.Blocks['controls_main'] = {
    init: function() {
        this.appendDummyInput()
            .appendField("Main");
        this.appendStatementInput("a")
            .setCheck(null);
        this.setColour('#607D8B');
        this.setTooltip('');
        this.setHelpUrl('http://www.example.com/');
        this.setDeletable(false);
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
    var code = 'start$\ndef main():\n' + statements_a + '\$end\n';

    return code;
};

Blockly.Blocks['mqtt_init'] = {
    init: function() {
        this.appendDummyInput()
            .appendField("MQTT START")
            .appendField(new Blockly.FieldTextInput("Host"), "hostServer");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour('#FF8F00');
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
        this.setColour('#FF8F00');
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
        this.setColour('#FF8F00');
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
        this.appendValueInput("publish")
            .setCheck(null)
            .appendField("MQTT Publish ")
            .appendField(new Blockly.FieldTextInput("topic"), "mqtt_topic")
            .appendField("  Message :");
        this.appendDummyInput()
            .appendField(" Retain :")
            .appendField(new Blockly.FieldCheckbox("TRUE"), "mqtt_retain");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour('#FF8F00');
        this.setTooltip('');
        this.setHelpUrl('');
    }
};

Blockly.Python['mqtt_publish'] = function(block) {
    var text_mqtt_topic = block.getFieldValue('mqtt_topic');
    var value_mqtt_publish = Blockly.Python.valueToCode(block, 'publish', Blockly.Python.ORDER_ATOMIC);
    var checkbox_mqtt_retain = block.getFieldValue('mqtt_retain') == 'TRUE';
    // TODO: Assemble Python into code variable.
    var code = 'mqtt.publish(\'' + text_mqtt_topic + '\',' + value_mqtt_publish + ',retain=' + checkbox_mqtt_retain + ')\n';
    // TODO: Change ORDER_NONE to the correct strength.
    return code;
};

var pwm_port = 0;
Blockly.Blocks['Pin_PWM'] = {
    init: function() {
        this.appendStatementInput("NAME")
            .setCheck(null)
            .appendField("Set PWM on Port")
            .appendField(new Blockly.FieldDropdown([
                ["1", "1"],
                ["2", "2"]
            ]), "port");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour('#03A9F4');
        this.setTooltip('');
        this.setHelpUrl('');
    }
};
Blockly.Python['Pin_PWM'] = function(block) {
    var dropdown_port = block.getFieldValue('port');
    pwm_port = dropdown_port;
    var statements_name = Blockly.Python.statementToCode(block, 'NAME', true);
    // console.log(statements_name)
    statements_name = statements_name.replace(/\s/g, '');
    // console.log(statements_name)
    statements_name = statements_name.replace(/\$n/g, '\n');
    if (pwm_port == '1') {
        var code = 'pwm' + pwm_port + ' = PWM(Pin(14))' + statements_name + '\n';
    } else {
        var code = 'pwm' + pwm_port + ' = PWM(Pin(13))' + statements_name + '\n';
    }
    return code;
};

Blockly.Blocks['Pin_PWMFreq'] = {
    init: function() {
        this.appendValueInput("freq")
            .setCheck("Number")
            .appendField("PWM Frequency");
        this.appendDummyInput()
            .appendField("0 for show current value");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour('#03A9F4');
        this.setTooltip('');
        this.setHelpUrl('');
    }
};

Blockly.Python['Pin_PWMFreq'] = function(block) {
    var value_freq = Blockly.Python.valueToCode(block, 'freq', Blockly.Python.ORDER_ATOMIC);
    if (value_freq == 0)
        var code = '$npwm' + pwm_port + '.freq()';
    else
        var code = '$npwm' + pwm_port + '.freq(' + value_freq + ')';
    return code;
};

Blockly.Blocks['Pin_PWMDuty'] = {
    init: function() {
        this.appendValueInput("duty")
            .setCheck("Number")
            .appendField("PWM Duty (0 - 1024)");
        this.appendDummyInput()
            .appendField("0 for show current value");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour('#03A9F4');
        this.setTooltip('');
        this.setHelpUrl('');
    }
};

Blockly.Python['Pin_PWMDuty'] = function(block) {
    var value_duty = Blockly.Python.valueToCode(block, 'duty', Blockly.Python.ORDER_ATOMIC);
    if (value_duty == 0)
        var code = '$npwm' + pwm_port + '.duty()';
    else
        var code = '$npwm' + pwm_port + '.duty(' + value_duty + ')';
    return code;
};

Blockly.Blocks['Pin_PWMDeinit'] = {
    init: function() {
        this.appendDummyInput()
            .appendField("PWM Deinit");
        this.setPreviousStatement(true, null);
        this.setColour('#03A9F4');
        this.setTooltip('');
        this.setHelpUrl('');
    }
};
Blockly.Python['Pin_PWMDeinit'] = function(block) {
    var code = 'pwm' + pwm_port + '.deinit()\n';
    return code;
};

Blockly.Blocks['Pin_I2C_read'] = {
    init: function() {
        this.appendDummyInput()
            .appendField("Read I2C from ")
            .appendField(new Blockly.FieldTextInput("address 0x00"), "i2c_addr");
        this.setOutput(true, null);
        this.setColour('#00BCD4');
        this.setTooltip('');
        this.setHelpUrl('');
    }
};

Blockly.Python['Pin_I2C_read'] = function(block) {
    var ext_i2c_addr = block.getFieldValue('i2c_addr');
    var code = 'I2C(scl=Pin(0), sda=Pin(2)).readfrom(' + ext_i2c_addr + ', 4)';
    return [code, Blockly.Python.ORDER_NONE];
};

Blockly.Blocks['Pin_I2C_write'] = {
    init: function() {
        this.appendValueInput("i2c")
            .setCheck(["String", "Array"])
            .appendField("Write I2C to ")
            .appendField(new Blockly.FieldTextInput("address 0x00"), "i2c_addr");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour('#00BCD4');
        this.setTooltip('');
        this.setHelpUrl('');
    }
};

Blockly.Python['Pin_I2C_write'] = function(block) {
    var text_i2c_addr = block.getFieldValue('i2c_addr');
    var value_i2c = Blockly.Python.valueToCode(block, 'i2c', Blockly.Python.ORDER_ATOMIC);
    // TODO: Assemble Python into code variable.
    var code = 'i2c = I2C(scl=Pin(0), sda=Pin(2))\ni2c.writeto(' + text_i2c_addr + ', ' + value_i2c + ')\n';
    // TODO: Change ORDER_NONE to the correct strength.
    return code;
};

Blockly.Blocks['Pin_I2C_scan'] = {
    init: function() {
        this.appendDummyInput()
            .appendField("Scan I2C Device(s)");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour('#00BCD4');
        this.setTooltip('');
        this.setHelpUrl('');
    }
};

Blockly.Python['Pin_I2C_scan'] = function(block) {
    // TODO: Assemble Python into code variable.
    var code = 'I2C(scl=Pin(0), sda=Pin(2)).scan()\n';
    return code;
};

Blockly.Blocks['WLAN_setting'] = {
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
        this.setColour('#2196F3');
        this.setTooltip('');
    }
};

Blockly.Python['WLAN_setting'] = function(block) {
    var dropdown_mode = block.getFieldValue('Mode');
    var dropdown_state = block.getFieldValue('State');
    var statements_wifi = Blockly.Python.statementToCode(block, 'Wifi_Mode', true);
    statements_wifi = statements_wifi.replace(/\s/g, '');
    statements_wifi = statements_wifi.replace(/\$n/g, '\n');
    // var value_wifi_mode = Blockly.Python.valueToCode(block, 'Wifi Mode', Blockly.Python.ORDER_ATOMIC);
    // TODO: Assemble JavaScript into code variable.
    var code = 'wlan = network.WLAN(network.' + dropdown_mode + ')\n' + 'wlan.active(' + dropdown_state + ')' + statements_wifi + '\n';
    return code;
};

Blockly.Blocks['WLAN_connectwifi'] = {
    init: function() {
        this.appendDummyInput()
            .appendField("Connect to ")
            .appendField(new Blockly.FieldTextInput("Wifi Name"), "ssid")
            .appendField(" Password")
            .appendField(new Blockly.FieldTextInput("Password"), "pw");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        // this.setOutput(true,null)
        this.setColour('#2196F3');
        this.setTooltip('');
    }
};

Blockly.Python['WLAN_connectwifi'] = function(block) {
    var text_ssid = block.getFieldValue('ssid');
    var text_pw = block.getFieldValue('pw');
    // TODO: Assemble Python into code variable.
    var code = '$nwlan.connect(' + text_ssid + ', ' + text_pw + ')';
    return code;
};

Blockly.Blocks['WLAN_checknetwork'] = {
    init: function() {
        this.appendDummyInput()
            .appendField("Check Network Status ")
            .appendField(new Blockly.FieldDropdown([
                ["Access Point", "AP_IF"],
                ["Station", "STA_IF"]
            ]), "Interfaces");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour('#2196F3');
        this.setTooltip('');
    }
};

Blockly.Python['WLAN_checknetwork'] = function(block) {
    var dropdown_interfaces = block.getFieldValue('Interfaces');
    var code = '$nwlan.ifconfig()';
    return code;
};

Blockly.Blocks['Pin_output'] = {
    init: function() {
        this.appendValueInput("onoff_value")
            .setCheck("Boolean")
            .appendField("Set Output Port")
            .appendField(new Blockly.FieldDropdown([
                ["1", "1"],
                ["2", "2"]
            ]), "port_id")
            .appendField(" turn(?)")
            .appendField(new Blockly.FieldDropdown([
                ["Clockwise", "right"],
                ["Counter-Clockwise", "left"]
            ]), "turn");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour('#4FC3F7');
        this.setTooltip('');
        this.setHelpUrl('');
    }
};

Blockly.Python['Pin_output'] = function(block) {
    var dropdown_port_id = block.getFieldValue('port_id');
    var dropdown_turn = block.getFieldValue('turn');
    var value_onoff_value = Blockly.Python.valueToCode(block, 'onoff_value', Blockly.Python.ORDER_ATOMIC);
    // TODO: Assemble Python into code variable.
    // console.log(value_onoff_value)
    // console.log(dropdown_turn)
    if (value_onoff_value == '(1)') {
        if (dropdown_turn == 'left') {
            if (dropdown_port_id == '1') {
                var code = 'pin1 = Pin(12, Pin.OUT)\npin2 = Pin(14, Pin.OUT)\npin1.value(0)\npin2.value(1)\n'
            } else {
                var code = 'pin3 = Pin(13, Pin.OUT)\npin4 = Pin(15, Pin.OUT)\npin3.value(0)\npin4.value(1)\n'
            }
        } else if (dropdown_turn == 'right') {
            if (dropdown_port_id == '1') {
                var code = 'pin1 = Pin(12, Pin.OUT)\npin2 = Pin(14, Pin.OUT)\npin1.value(1)\npin2.value(0)\n'
            } else {
                var code = 'pin3 = Pin(13, Pin.OUT)\npin4 = Pin(15, Pin.OUT)\npin3.value(1)\npin4.value(0)\n'
            }
        }
    } else {
        if (dropdown_port_id == '1') {
            var code = 'pin1 = Pin(12, Pin.OUT)\npin2 = Pin(14, Pin.OUT)\npin1.value(0)\npin2.value(0)\n'
        } else {
            var code = 'pin3 = Pin(13, Pin.OUT)\npin4 = Pin(15, Pin.OUT)\npin3.value(0)\npin4.value(0)\n'
        }
    }
    return code;
};

Blockly.Blocks['Pin_hl'] = {
    init: function() {
        this.appendDummyInput()
            .appendField(new Blockly.FieldDropdown([
                ['On', '1'],
                ['Off', '0']
            ]), "value");
        this.setOutput(true, null);
        this.setColour('#4FC3F7');
        this.setTooltip('');
        this.setHelpUrl('');
    }
};

Blockly.Python['Pin_hl'] = function(block) {
    var dropdown_value = block.getFieldValue('value');
    // TODO: Assemble Python into code variable.
    var code = dropdown_value;
    // TODO: Change ORDER_NONE to the correct strength.
    return [code, Blockly.Python.ORDER_NONE];
};

Blockly.Blocks['ADC_input'] = {
    init: function() {
        this.appendDummyInput()
            .appendField("Read Sensor on analog port")
        this.setOutput(true, null);
        this.setColour('#4FC3F7');
        this.setTooltip('');
        this.setHelpUrl('');
    }
};

Blockly.Python['ADC_input'] = function(block) {
    // TODO: Assemble Python into code variable.
    var code = 'ADC(0).read()';
    // TODO: Change ORDER_NONE to the correct strength.
    return [code, Blockly.Python.ORDER_NONE];
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
        this.setColour('#009688');
        this.setTooltip('');
        this.setHelpUrl('');
    }
};

Blockly.Python['time_delay'] = function(block) {
    var value_in_value = Blockly.Python.valueToCode(block, 'in_value', Blockly.Python.ORDER_ATOMIC);
    var dropdown_prefix_second = block.getFieldValue('prefix_second');
    // TODO: Assemble Python into code variable.
    if (dropdown_prefix_second == 'second') {
        var code = 'time.sleep(' + value_in_value + ')\n'
    } else if (dropdown_prefix_second == 'milli') {
        var code = 'time.sleep_ms(' + value_in_value + ')\n'
    } else if (dropdown_prefix_second == 'micro') {
        var code = 'time.sleep_us(' + value_in_value + ')\n'
    }
    return code;
};

Blockly.Blocks['urequests_IFTTT_start'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("IFTTT START ")
        .appendField(new Blockly.FieldTextInput("Key"), "key")
        .appendField(", ")
        .appendField(new Blockly.FieldTextInput("Event"), "event");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour('#FF5722');
    this.setTooltip('');
    this.setHelpUrl('');
  }
};
Blockly.Python['urequests_IFTTT_start'] = function(block) {
  var text_key = block.getFieldValue('key');
  var text_event = block.getFieldValue('event');
//   key = text_key;
//   event = text_event;
  // TODO: Assemble Python into code variable.
  var code = 'urequests.post(\'https://maker.ifttt.com/trigger/' + text_event + '/with/key/' + text_key;
  return code;
};

Blockly.Blocks['urequests_IFTTT_sent'] = {
  init: function() {
    this.appendValueInput("NAME")
        .setCheck(null)
        .appendField("IFTTT SENT  Value :");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour('#FF5722');
    this.setTooltip('');
    this.setHelpUrl('');
  }
};
Blockly.Python['urequests_IFTTT_sent'] = function(block) {
  var value_name = Blockly.Python.valueToCode(block, 'NAME', Blockly.Python.ORDER_ATOMIC);
  // TODO: Assemble Python into code variable.
  var code = '\', json = {\'value1\':' + value_name +'})\n';
  return code;
};

Blockly.Blocks['urequests_netpie_start'] = {
  init: function() {
    this.appendDummyInput()
        .appendField(" NETPIE START")
        .appendField(new Blockly.FieldTextInput("Application"), "app")
        .appendField(", ")
        .appendField(new Blockly.FieldTextInput("Application Key"), "app_key")
        .appendField(", ")
        .appendField(new Blockly.FieldTextInput("Rest API auth"), "rest_auth");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour('#795548');
    this.setTooltip('');
    this.setHelpUrl('');
  }
};

var url = "";
Blockly.Python['urequests_netpie_start'] = function(block) {
  var text_app = block.getFieldValue('app');
  var text_app_key = block.getFieldValue('app_key');
  var text_rest_auth = block.getFieldValue('rest_auth');

  // TODO: Assemble Python into code variable.
  var code = 'key = \'https://api.netpie.io/topic/' + text_app + '/' + text_app_key + '?retain&auth=' + text_rest_auth + '\'';
  url = '\'https://api.netpie.io/topic/' + text_app + '/' + text_app_key + '?retain&auth=' + text_rest_auth + '\'';
  return code + '\n';
};

Blockly.Blocks['urequests_Netpie_put'] = {
    init: function() {
        this.appendValueInput("data_put")
            .setCheck(null)
            .appendField("NETPIE PUT")
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour('#795548');
        this.setTooltip('');
        this.setHelpUrl('');
    }
};
Blockly.Python['urequests_Netpie_put'] = function(block) {
    var value_data_put = Blockly.Python.valueToCode(block, 'data_put', Blockly.Python.ORDER_ATOMIC);
    // TODO: Assemble Python into code variable.
    var code = 'urequests.put('+ url +',data=' + value_data_put + ')\n';
    return code;
};

Blockly.Blocks['urequests_json_Netpie_get'] = {
    init: function() {
        this.appendDummyInput()
            .setAlign(Blockly.ALIGN_RIGHT)
            .appendField("NETPIE GET")
        this.setOutput(true, null);
        this.setColour('#795548');
        this.setTooltip('');
        this.setHelpUrl('');
    }
};

Blockly.Python['urequests_json_Netpie_get'] = function(block) {
    // TODO: Assemble Python into code variable.
    var code = 'json.loads(urequests.get('+ url +').text)[0][\'payload\']';
    // TODO: Change ORDER_NONE to the correct strength.
    return [code, Blockly.Python.ORDER_NONE];
};

Blockly.Blocks['urequests_datalog_write'] = {
    init: function() {
        this.appendValueInput("logging_write")
            .setCheck(null)
            .appendField("Data Logging LIL Write  Key :")
            .appendField(new Blockly.FieldTextInput("Default"), "write_key")
            .appendField(new Blockly.FieldDropdown([
                ["Field 1", "1"],
                ["Field 2", "2"],
                ["Field 3", "3"],
                ["Field 4", "4"],
                ["Field 5", "5"],
                ["Field 6", "6"],
                ["Field 7", "7"],
                ["Field 8", "8"]
            ]), "field_id");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour('#EF6C00');
        this.setTooltip('');
        this.setHelpUrl('');
    }
};

Blockly.Python['urequests_datalog_write'] = function(block) {
    var text_write_key = block.getFieldValue('write_key');
    var dropdown_field_id = block.getFieldValue('field_id');
    var value_logging_write = Blockly.Python.valueToCode(block, 'logging_write', Blockly.Python.ORDER_ATOMIC);
    // TODO: Assemble Python into code variable.
    var code = 'urequests.post(\'https://data.learninginventions.org/update?key=' + text_write_key + '&field' + dropdown_field_id + '=\'+str' + value_logging_write + ')\n';
    return code;
};

Blockly.Blocks['oled_clear'] = {
    init: function() {
        this.appendDummyInput()
            .appendField("Clear Display");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour('#1565C0');
        this.setTooltip('');
        this.setHelpUrl('');
    }
};

Blockly.Python['oled_clear'] = function(block) {
    // TODO: Assemble Python into code variable.
    var code = 'oled.clear()\n';
    return code;
};

Blockly.Blocks['oled_text'] = {
    init: function() {
        this.appendValueInput("text")
            .setCheck(["Number", "String", "Boolean"])
            .appendField("Show Text");
        this.appendDummyInput()
            .appendField("in Line")
            .appendField(new Blockly.FieldDropdown([
                ["1", "0"],
                ["2", "1"],
                ["3", "2"],
                ["4", "3"],
                ["5", "4"],
                ["6", "5"],
                ["7", "6"],
                ["8", "7"]
            ]), "line_num");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour('#1565C0');
        this.setTooltip('');
        this.setHelpUrl('');
    }
};

Blockly.Python['oled_text'] = function(block) {
    var value_text = Blockly.Python.valueToCode(block, 'text', Blockly.Python.ORDER_ATOMIC);
    var dropdown_line_num = block.getFieldValue('line_num');
    // TODO: Assemble Python into code variable.
    var code = 'oled.text(str(' + value_text + '),0,' + dropdown_line_num * 8 + ')\n';
    return code;
};
