var workspace = Blockly.inject(document.getElementById('blocklyDiv'), {
    media: 'media/',
    toolbox: document.getElementById('toolbox'),
    zoom: {
        controls: true,
        wheel: false,
        startScale: 1.0,
        maxScale: 1.5,
        minScale: 0.8,
        scaleSpeed: 1.2,
        trashcan: true
    }
});

var blocklyArea = document.getElementById('Blockly');
var blocklyDiv = document.getElementById('blocklyDiv');

var onresize = function(e) {
    // Compute the absolute coordinates and dimensions of blocklyArea.

    var element = blocklyArea;
    var x = 0;
    var y = 0;
    do {
        x += element.offsetLeft;
        y += element.offsetTop;
        element = element.offsetParent;
    } while (element);
    // Position blocklyDiv over blocklyArea.
    blocklyDiv.style.left = x + 'px';
    blocklyDiv.style.top = y + 'px';
    blocklyDiv.style.width = blocklyArea.offsetWidth + 'px';
    blocklyDiv.style.height = blocklyArea.offsetHeight + 'px';
};
window.addEventListener('resize', onresize, false);
onresize();
Blockly.svgResize(workspace);

if (!localStorage.nsc_prompt_ip) {
    document.getElementById('url').value = '192.168.4.1'
    localStorage.nsc_prompt_ip = '192.168.4.1'
} else if (localStorage.nsc_prompt_ip) {
    document.getElementById('url').value = localStorage.nsc_prompt_ip
}
if (!localStorage.firsttime) {
    localStorage.firsttime = "true";
    step = 0;
}

var time = new Date();
document.getElementById('status').value = "false"
document.getElementById('filename').value = "NameofProject" + String(time.getMonth() + 1) + String(time.getDate());
var _import = ""
var _machine = ""
var sel = false;
var space = Blockly.Python.INDENT;
var d_space = Blockly.Python.INDENT + Blockly.Python.INDENT;
var t_space = Blockly.Python.INDENT + Blockly.Python.INDENT + Blockly.Python.INDENT;
var connected = false;
var term;
var ws;

var step = 99;
var commandSystem = false;
var trigger = false;
var binary_state = 0;
var put_file_name = null;
var put_file_data = null;
var get_file_name = null;
var get_file_data = null;
var cmd = "";
var arrCMD = [];
var arrfile = [];
var log = [];
console.log(document.getElementById('status').value)
var arraddons = [];
//var arraddons = JSON.parse(window.localStorage.getItem('addons'));
console.log(window.localStorage.getItem('addons'))
//connect('ws://' + localStorage.nsc_prompt_ip + ':' + '8266' + '/')
setInterval(function() {
    autosaveBlock();
}, 100);
autoloadBlock();

function calculate_size(win) {
    var cols = ((win.innerWidth) / 7) | 0;
    var rows = Math.max(24, Math.min(32, (win.innerHeight - 180) / 12)) | 0;
    return [cols, 12];
}

(function() {
    window.onload = function() {
        var size = calculate_size(self);
        term = new Terminal({
            cols: size[0],
            rows: size[1],
            useStyle: true,
            screenKeys: true,
            cursorBlink: false
        });
        term.open(document.getElementById("term"));
    };
    window.addEventListener('resize', function() {
        var size = calculate_size(self);
        term.resize(size[0], size[1]);
    });
    if (connected === "false" && trigger) {

        $('#step1').trigger('click');
        setTimeout(function() {}, 15000);
        setTimeout(function() {}, 30000);
        setTimeout(function() {
            $('#step3miss').trigger('click');
            $('#step3miss').trigger('click');
        }, 45000);
    }
}).call(this);

function button_click() {
    if (connected) {
        ws.send(String.fromCharCode(4))
        ws.close();
    } else {
        document.getElementById('url').disabled = true;
        document.getElementById('button').value = "Disconnect";
        document.getElementById('status').innerHTML = '<i class="material-icons" data-toggle="tooltip" data-placement="bottom"    title="status : Connect">network_wifi</i>';
        connected = true;
        $('#ide_output_collapsible_header').trigger('click');
        connect('ws://' + document.getElementById('url').value + ':8266/');
        localStorage.nsc_prompt_ip = document.getElementById('url').value
    }
}

function prepare_for_connect() {
    document.getElementById('url').disabled = false;
    document.getElementById('button').value = "Connect";
    document.getElementById('status').innerHTML = '<i class="material-icons" data-toggle="tooltip" data-placement="bottom"    title="status : Disconnect">perm_scan_wifi</i>';

}


function checkCMD(commandCMD) {
    console.log(commandCMD)
    if (cmd.split(":")[1] == "true") {

    } else if (cmd.split(":")[0] == "step1") {
        step = 1;

    } else if (cmd.split(":")[0] == "step2") {
        if (cmd.split(":")[1] == "res") {

            document.getElementById("response").value = cmd.split(":")[2]
            document.getElementById("response").innerHTML = cmd.split(":")[2]
            console.log(document.getElementById("response").value)
        }
        step = 2;

    } else if (cmd.split(":")[0] == "step3") {
        step = 3;
        localStorage.nsc_prompt_ip = document.getElementById("response").value

        localStorage.firsttime = false;
        step = 99;
    } else if (cmd.split(":")[0] == "cmd") {
        if (cmd.split(":")[1] == "manager") {
            var resfile = cmd.split(":")[2]
            sessionStorage.file = resfile;
        }
    }
}

function wizard() {
    console.log(localStorage.firsttime)
    if (step == 3) {

    }
    if (String(localStorage.firsttime) == "true") {
        step = 0;
        $('#step1').trigger('click');
        console.log("tes")
    } else {
        init_first()
    }
}

function init_first() {
    console.log("init")
    switch (step) {
        case 0:
            $('#step1miss').trigger('click');
            $('#step1miss').trigger('click');
            $('#step2').trigger('click');
            break;

        case 1:
            $('#step2miss').trigger('click');
            $('#step2miss').trigger('click');
            $('#step3').trigger('click');
            break;

        case 2:
            $('#step3miss').trigger('click');
            $('#step3miss').trigger('click');
            break;
    }
    switch (step + 1) {
        case 1:
            ws.send('deamon.init("10","","")\r\n')
            break;

        case 2:
            ws.send('deamon.init("20","' + document.getElementById("ssid").value + '","' + document.getElementById("pass_ssid").value + '")\r\n')
            break;

        case 3:
            ws.send('deamon.init("30","' + document.getElementById("key").value + '","")\r\n')
            break;
    }

}

function generate() {
    _import = ""
    _machine = ""

    // Parse the XML into a tree.
    generateXML()
    var code = Blockly.Python.workspaceToCode(workspace);

    var newcode = code.split('$')

    var execcode = _import + "\n" + _machine + "\n"
    // var execcode = _import + "\n"
    for (var i = 1; i < newcode.length; i += 2) {
        execcode += newcode[i]
    };
    console.log()


    editor.setValue(execcode);

    return execcode
}

function generateXML() {
    var arrXml = [];
    var first = true;
    var first_sublib = true;
    var xmlDom = Blockly.Xml.workspaceToDom(workspace);
    var xmlText = Blockly.Xml.domToPrettyText(xmlDom);

    arrXml.push(xmlText.search("Pin"))
    arrXml.push(xmlText.search("WLAN"))
    arrXml.push(xmlText.search("mqtt"))
    arrXml.push(xmlText.search("PWM"))
    arrXml.push(xmlText.search("I2C"))
    arrXml.push(xmlText.search("ADC"))
    arrXml.push(xmlText.search("time"))
    arrXml.push(xmlText.search("urequests"))
    arrXml.push(xmlText.search("json"))
    arrXml.push(xmlText.search("oled"))
    arrXml.push(xmlText.search("beeper"))
    arrXml.push(xmlText.search("math"))
    for (var i = 0; i < arrXml.length; i++) {
        // console.log(arrXml)
        if (arrXml[i] > 0) {

            switch (i) {
                case 0:
                    if (first_sublib) {
                        // console.log(first)
                        _machine += "from machine import Pin"
                        first_sublib = false;
                    } else if (!first_sublib) {
                        _machine += ","
                        _machine += "Pin"

                    }
                    break;
                case 1:
                    if (first) {
                        _import += "import network"
                        first = false;
                    } else if (!first) {
                        _import += ","
                        _import += "network"

                    }
                    break;
                case 2:

                    if (first) {
                        _import += "import mqtt"
                        first = false;
                    } else if (!first) {
                        _import += ","
                        _import += "mqtt"

                    }
                    break;
                case 3:

                    if (first_sublib) {
                        _machine += "from machine import PWM"
                        first_sublib = false;
                    } else if (!first_sublib) {
                        _machine += ","
                        _machine += "PWM"

                    }
                    break;
                case 4:

                    if (first_sublib) {
                        _machine += "from machine import I2C"
                        first_sublib = false;
                    } else if (!first_sublib) {
                        _machine += ","
                        _machine += "I2C"

                    }
                    break;
                case 5:

                    if (first_sublib) {
                        _machine += "from machine import ADC"
                        first_sublib = false;
                    } else if (!first_sublib) {
                        _machine += ","
                        _machine += "ADC"

                    }
                    break;
                case 6:

                    if (first) {
                        _import += "import time"
                        first = false;
                    } else if (!first) {
                        _import += ","
                        _import += "time"

                    }
                    break;

                case 7:
                    if (first) {
                        _import += "import urequests"
                        first = false;
                    } else if (!first) {
                        _import += ","
                        _import += "urequests"
                    }
                    break;
                case 8:
                    if (first) {
                        _import += "import json"
                        first = false;
                    } else if (!first) {
                        _import += ","
                        _import += "json"
                    }
                    break;
                case 9:
                    if (first) {
                        _import += "import oled"
                        first = false;
                    } else if (!first) {
                        _import += ","
                        _import += "oled"
                    }
                    break;

                case 10:
                    if (first) {
                        _import += "import beeper"
                        first = false;
                    } else if (!first) {
                        _import += ","
                        _import += "beeper"
                    }
                    break;

                case 11:
                    if (first) {
                        _import += "import math"
                        first = false;
                    } else if (!first) {
                        _import += ","
                        _import += "math"
                    }
                    break;
            }
        }
    }
}

function Savecode() {
    var code = editor.getValue()
    var nameInput = document.getElementById('filename').value;
    if (!nameInput ? alert("Please fill name") : download(nameInput + '.py', code));
}

function Savecode_edi() {
    var code = generate()
    var nameInput = document.getElementById('filename').value;
    if (!nameInput ? alert("Please fill name") : download(nameInput + '.py', code));
}

function save() {
    var xml = Blockly.Xml.workspaceToDom(workspace);
    var xml_text = Blockly.Xml.domToText(xml);
    var nameInput = document.getElementById('filename').value;
    if (!nameInput ? alert("Please fill name") : download(nameInput + '.xml', xml_text));


}

function loadXml() {
    var parseInputXMLfile = function(e) {
        var xmlFile = e.target.files[0];
        var filename = xmlFile.name;
        var extensionPosition = filename.lastIndexOf('.');
        if (extensionPosition !== -1) {
            filename = filename.substr(0, extensionPosition);
        }

        var reader = new FileReader();
        reader.onload = function() {
            var xml = Blockly.Xml.textToDom(reader.result);
            Blockly.Xml.domToWorkspace(workspace, xml);
            console.log(reader.result);

        };
        reader.readAsText(xmlFile);
    };

    // Create once invisible browse button with event listener, and click it
    var selectFile = document.getElementById('select_file');
    if (selectFile === null) {
        var selectFileDom = document.createElement('INPUT');
        selectFileDom.type = 'file';
        selectFileDom.id = 'select_file';

        var selectFileWrapperDom = document.createElement('DIV');
        selectFileWrapperDom.id = 'select_file_wrapper';
        selectFileWrapperDom.style.display = 'none';
        selectFileWrapperDom.appendChild(selectFileDom);

        document.body.appendChild(selectFileWrapperDom);
        selectFile = document.getElementById('select_file');
        selectFile.addEventListener('change', parseInputXMLfile, false);
    }
    selectFile.click();
}


function showCode() {
    // Generate JavaScript code and display it.
    Blockly.Python.INFINITE_LOOP_TRAP = null;
    var code = Blockly.Python.workspaceToCode(workspace);
    alert(code);
}




function autosaveBlock() {
    var xml = Blockly.Xml.workspaceToDom(workspace);
    var data = Blockly.Xml.domToText(xml);


    // Store data in blob.
    window.localStorage.setItem('autoSaveBlock', data);
}

function autoloadBlock() {
    console.log('-- Loading saved code.')
    var xml = Blockly.Xml.textToDom('<xml><block type="controls_main" x="229" y="170"></block></xml>');
    xml.editable = false;
    xml.deletable = false;
    workspace.clear();
    Blockly.Xml.domToWorkspace(workspace, xml);

    generate()

    var loadedBlock = window.localStorage.getItem('autoSaveBlock');
    console.log(loadedBlock)

    if (!loadedBlock) return;
    if (!(loadedBlock.split('<block type="controls_main"')[1])) {
        loadedBlock = loadedBlock.split('</xml>')[0] + '<block type="controls_main" x="229" y="170"></block></xml>';
    }
    try {
        var xml = Blockly.Xml.textToDom(loadedBlock);
    } catch (e) {

        return;
    }
    if (xml.childElementCount == 0) return;
    workspace.clear();
    Blockly.Xml.domToWorkspace(workspace, xml);
}

function shareAddons() {
    var xml = Blockly.Xml.workspaceToDom(workspace);
    var xml_text = Blockly.Xml.domToText(xml);
    var str = $('form').serialize()
    var str2 = str + "&xml=" + String(xml_text)
    $.post('http://192.168.12.100:100/nsc2017/api/block/addblock', str2).done(function(data) {
        $('#res').append("<br><h3>your id is " + data + "  </h3><br>")
        // $('#send').hide();
        console.log(data)
    });

    console.log(str2)

}

function resetConfig() {
    $('#res').innerHTML = ""
    $('#send').show();
}

function loadAddons() {
    var lenght = $(arraddons).size();
    console.log(lenght)

    for (var i = 0; i < lenght; i++) {
        $.get("http://192.168.12.100:100/nsc2017/api/block/getblock/aid/" + String(arraddons[i]), function(data) {
            console.log(data.file)
            /*var s = document.createElement("script");
    s.type = "text/javascript";
    s.src = data.wifi.files;
    $("head").append(s);
  console.log(data.wifi.xml)
  var xmlToolbox = document.getElementById('toolbox');
  console.log(xmlToolbox);
  var addons = document.createElement('category');
  var categoryTitle ='Addons';
  addons.id = 'catnetwork'
  addons.setAttribute('colour', 210);
  addons.setAttribute('name', "Add-ons");
      for(var i = 0;i < data.wifi.xml.length ; i++){
            var b1 = document.createElement('block')
            b1.setAttribute('type',data.wifi.xml[i])
            addons.appendChild(b1)
      }
  xmlToolbox.appendChild(addons);
  workspace.updateToolbox(xmlToolbox);
*/
            var xml_text = data.file;
            var xml = Blockly.Xml.textToDom(xml_text);
            Blockly.Xml.domToWorkspace(workspace, xml);

            console.log("Load was success.");
        }).done(function() {

        });

    }
};

function connect(url) {
    ws = new WebSocket(url);
    // ws.onclose = function(){
    //   setTimeout(connect(url), 500);
    // }
    ws.binaryType = 'arraybuffer';
    //ws.debug = true;
    // ws.timeoutInterval = 5400;
    ws.onopen = function() {
        term.removeAllListeners('data');
        term.on('data', function(data) {
            // Pasted data from clipboard will likely contain
            // LF as EOL chars.
            data = data.replace(/\n/g, "\r");
            ws.send(data);
        });

        term.on('title', function(title) {
            document.title = title;
        });

        term.focus();
        term.element.focus();
        ws.send('1234\r\n')
        term.write('\x1b[31mWelcome to MicroPython!\x1b[m\r\n');
        ws.send('import deamon\r\n')
        wizard()
        ws.onmessage = function(event) {
            // console.log('onmessage')

            if (event.data == "$") {
                if (commandSystem) {
                    commandSystem = false
                } else {
                    commandSystem = true
                }
            }
            if (!commandSystem) {
                // console.log('not command')
                // console.log(binary_state)
                // console.log(event.data)
                // console.log(event.data instanceof ArrayBuffer)
                if (event.data instanceof ArrayBuffer) {
                    var data = new Uint8Array(event.data);
                    // console.log(binary_state);
                    switch (binary_state) {
                        case 11:
                            // console.log('case 11')
                            // first response for put
                            if (decode_resp(data) == 0) {
                                // send file data in chunks
                                for (var offset = 0; offset < put_file_data.length; offset += 1024) {
                                    ws.send(put_file_data.slice(offset, offset + 1024));
                                }
                                binary_state = 12;
                            }
                            break;
                        case 12:
                            // final response for put
                            if (decode_resp(data) == 0) {
                                term.write('file tranfer successful\r\n');
                                term.write('Sent ' + put_file_name + ', ' + put_file_data.length + ' bytes\r\n');
                            } else {
                                term.write('file tranfer failure\r\n');
                                term.write('Failed sending ' + put_file_name + "\r\n");
                            }
                            binary_state = 0;
                            break;

                        case 21:
                            // first response for get
                            if (decode_resp(data) == 0) {
                                binary_state = 22;
                                var rec = new Uint8Array(1);
                                rec[0] = 0;
                                ws.send(rec);
                            }
                            break;
                        case 22:
                            {
                                // file data
                                var sz = data[0] | (data[1] << 8);
                                if (data.length == 2 + sz) {
                                    // we assume that the data comes in single chunks
                                    if (sz == 0) {
                                        // end of file
                                        binary_state = 23;
                                    } else {
                                        // accumulate incoming data to get_file_data
                                        var new_buf = new Uint8Array(get_file_data.length + sz);
                                        new_buf.set(get_file_data);
                                        new_buf.set(data.slice(2), get_file_data.length);
                                        get_file_data = new_buf;
                                        term.write('Getting ' + get_file_name + ', ' + get_file_data.length + ' bytes\r\n');

                                        var rec = new Uint8Array(1);
                                        rec[0] = 0;
                                        ws.send(rec);
                                    }
                                } else {
                                    binary_state = 0;
                                }
                                break;
                            }
                        case 23:
                            // final response
                            if (decode_resp(data) == 0) {
                                term.write('Got ' + get_file_name + ', ' + get_file_data.length + ' bytes\r\n');
                                if (sel) {
                                    document.getElementById('get_filename').value = get_file_name
                                    editor.setValue(ab2str(get_file_data))
                                } else {
                                    saveAs(new Blob([get_file_data], {
                                        type: "application/octet-stream"
                                    }), get_file_name);
                                }


                            } else {
                                term.write('Failed getting ' + get_file_name + "\r\n");
                            }
                            binary_state = 0;
                            break;
                        case 31:
                            // first (and last) response for GET_VER
                            console.log('GET_VER', data);
                            binary_state = 0;
                            break;
                        default:
                    }
                }
                term.write(event.data);
            } else {

                if (event.data != "$") {
                    arrCMD.push(event.data)

                    if (event.data == "\n" && commandSystem) {
                        for (var i = 0; i < arrCMD.length - 1; i++) {
                            cmd += arrCMD[i]
                        }
                        checkCMD(cmd)
                        log.push(cmd)
                        // console.log(cmd)
                        cmd = ""
                        arrCMD = []
                    };
                }
            }
        };
    };
    ws.onclose = function() {
        connected = false;
        if (term) {
            term.write('\x1b[31mDisconnected\x1b[m\r\n');
        }
        prepare_for_connect();
    }
}

function str2ab(str) {
    var buf = new ArrayBuffer(str.length); // 2 bytes for each char
    var bufView = new Uint8Array(buf);
    for (var i = 0, strLen = str.length; i < strLen; i++) {
        bufView[i] = str.charCodeAt(i);
    }
    return bufView;
}

function ab2str(buf) {
    return String.fromCharCode.apply(null, new Uint16Array(buf));
}

function upload() {
    var code = generate()
    term.write("Upload " + document.getElementById('filename').value + ".py\r\n")
    // console.log(code)
    put_file(code)
}

function upload_editor() {
    var code = editor.getValue();
    // console.log(code);
    put_file(code)
}

function run() {
    ws.send('import ' + document.getElementById('filename').value + '\r\n')
    ws.send(document.getElementById('filename').value + '.main()' + '\r\n')
}

function stop() {
    ws.send(String.fromCharCode(3))

}

function config() {
    wizard()
}

function restart() {
    ws.send(String.fromCharCode(4))
}

function put_file(code) {

    put_file_data = str2ab(code);

    var dest_fname = document.getElementById('filename').value + '.py';
    var dest_fsize = put_file_data.length;
    // console.log(put_file_data)
    // WEBREPL_FILE = "<2sBBQLH64s"
    var rec = new Uint8Array(2 + 1 + 1 + 8 + 4 + 2 + 64);
    rec[0] = 'W'.charCodeAt(0);
    rec[1] = 'A'.charCodeAt(0);
    rec[2] = 1; // put
    rec[3] = 0;
    rec[4] = 0;
    rec[5] = 0;
    rec[6] = 0;
    rec[7] = 0;
    rec[8] = 0;
    rec[9] = 0;
    rec[10] = 0;
    rec[11] = 0;
    rec[12] = dest_fsize & 0xff;
    rec[13] = (dest_fsize >> 8) & 0xff;
    rec[14] = (dest_fsize >> 16) & 0xff;
    rec[15] = (dest_fsize >> 24) & 0xff;
    rec[16] = dest_fname.length & 0xff;
    rec[17] = (dest_fname.length >> 8) & 0xff;
    for (var i = 0; i < 64; ++i) {
        if (i < dest_fname.length) {
            rec[18 + i] = dest_fname.charCodeAt(i);

        } else {
            rec[18 + i] = 0;
        }
    }
    // initiate put
    binary_state = 11;
    // console.log('Sending ' + document.getElementById('filename').value + '...');
    ws.send(rec);
    // var test = rec;
    // console.log(rec)
    // term.write('file tranfer successful\r\n');
}

//webrepl
function decode_resp(data) {
    if (data[0] == 'W'.charCodeAt(0) && data[1] == 'B'.charCodeAt(0)) {
        var code = data[2] | (data[3] << 8);
        return code;
    } else {
        return -1;
    }
}

function put_file_manager() {
    var dest_fname = put_file_name;
    var dest_fsize = put_file_data.length;

    // WEBREPL_FILE = "<2sBBQLH64s"
    var rec = new Uint8Array(2 + 1 + 1 + 8 + 4 + 2 + 64);
    rec[0] = 'W'.charCodeAt(0);
    rec[1] = 'A'.charCodeAt(0);
    rec[2] = 1; // put
    rec[3] = 0;
    rec[4] = 0;
    rec[5] = 0;
    rec[6] = 0;
    rec[7] = 0;
    rec[8] = 0;
    rec[9] = 0;
    rec[10] = 0;
    rec[11] = 0;
    rec[12] = dest_fsize & 0xff;
    rec[13] = (dest_fsize >> 8) & 0xff;
    rec[14] = (dest_fsize >> 16) & 0xff;
    rec[15] = (dest_fsize >> 24) & 0xff;
    rec[16] = dest_fname.length & 0xff;
    rec[17] = (dest_fname.length >> 8) & 0xff;
    for (var i = 0; i < 64; ++i) {
        if (i < dest_fname.length) {
            rec[18 + i] = dest_fname.charCodeAt(i);
        } else {
            rec[18 + i] = 0;
        }
    }

    // initiate put
    binary_state = 11;
    term.write('Sending ' + put_file_name + '...\r\n');
    ws.send(rec);
}

function get_file(name) {
    var src_fname = name

    // WEBREPL_FILE = "<2sBBQLH64s"
    var rec = new Uint8Array(2 + 1 + 1 + 8 + 4 + 2 + 64);
    rec[0] = 'W'.charCodeAt(0);
    rec[1] = 'A'.charCodeAt(0);
    rec[2] = 2; // get
    rec[3] = 0;
    rec[4] = 0;
    rec[5] = 0;
    rec[6] = 0;
    rec[7] = 0;
    rec[8] = 0;
    rec[9] = 0;
    rec[10] = 0;
    rec[11] = 0;
    rec[12] = 0;
    rec[13] = 0;
    rec[14] = 0;
    rec[15] = 0;
    rec[16] = src_fname.length & 0xff;
    rec[17] = (src_fname.length >> 8) & 0xff;
    for (var i = 0; i < 64; ++i) {
        if (i < src_fname.length) {
            rec[18 + i] = src_fname.charCodeAt(i);
        } else {
            rec[18 + i] = 0;
        }
    }

    // initiate get
    binary_state = 21;
    get_file_name = src_fname;
    get_file_data = new Uint8Array(0);
    term.write('Getting ' + get_file_name + '...');
    ws.send(rec);
}

function get_ver() {
    // WEBREPL_REQ_S = "<2sBBQLH64s"
    var rec = new Uint8Array(2 + 1 + 1 + 8 + 4 + 2 + 64);
    rec[0] = 'W'.charCodeAt(0);
    rec[1] = 'A'.charCodeAt(0);
    rec[2] = 3; // GET_VER
    // rest of "rec" is zero

    // initiate GET_VER
    binary_state = 31;
    ws.send(rec);
}

function handle_put_file_select(evt) {
    // The event holds a FileList object which is a list of File objects,
    // but we only support single file selection at the moment.
    var files = evt.target.files;

    // Get the file info and load its data.
    var f = files[0];
    put_file_name = f.name;
    var reader = new FileReader();
    reader.onload = function(e) {
        put_file_data = new Uint8Array(e.target.result);
        document.getElementById('put-file-list').innerHTML = '' + escape(put_file_name) + ' - ' + put_file_data.length + ' bytes';
        document.getElementById('put-file-button').disabled = false;
    };
    reader.readAsArrayBuffer(f);
}

document.getElementById('put-file-select').addEventListener('change', handle_put_file_select, false);
document.getElementById('put-file-button').disabled = true;


//////

function loadfile(num) {
    sel = false;
    arrfile = []
    var resfile = sessionStorage.file
    var res = resfile.split("[")
    var res2 = res[1].split("]")
    var res3 = res2[0].split(",")
    var str2 = res3;
    for (var i = 0; i < str2.length; i++) {
        var tmp1 = str2[i].split("'")
        console.log(tmp1[1])
        arrfile.push(tmp1[1])
        addFile(tmp1[1], i)
    }
    console.log(arrfile)
    console.log(arrfile[num])
    get_file(arrfile[num])
    //
}


function editfile(num) {
    sel = true;
    arrfile = []
    var resfile = sessionStorage.file
    var res = resfile.split("[")
    var res2 = res[1].split("]")
    var res3 = res2[0].split(",")
    var str2 = res3;
    for (var i = 0; i < str2.length; i++) {
        var tmp1 = str2[i].split("'")
        console.log(tmp1[1])
        arrfile.push(tmp1[1])
        addFile(tmp1[1], i)
    }
    console.log(arrfile)
    get_file(arrfile[num])

}
