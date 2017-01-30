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
var _import = ""
var _machine = ""
var space = Blockly.Python.INDENT;
var d_space = Blockly.Python.INDENT + Blockly.Python.INDENT;
var t_space = Blockly.Python.INDENT + Blockly.Python.INDENT + Blockly.Python.INDENT;
connect('ws://' + localStorage.nsc_prompt_ip + ':' + '8266' + '/');
var put_file_name = null;
var put_file_data = null;

var arraddons = [];
//var arraddons = JSON.parse(window.localStorage.getItem('addons'));
console.log(window.localStorage.getItem('addons'))

setInterval(function() {
    autosaveBlock();
}, 100);
autoloadBlock();




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

    document.getElementById('code_output').value = execcode;
    editor.setValue(execcode);


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
            }
            // if (first) {
            //     first = false;
            // }
            // if (!first) {
            //     _import += ","
            //     _machine += ","
            // }

        }

    }

    console.log(arrXml)
    document.getElementById('code_output').value = xmlText;

}

function Savecode() {
    var code = Blockly.Python.workspaceToCode(workspace);
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
            Blockly.Xml.domToWorkspace(workspace, xml);

            console.log("Load was success.");
        }).done(function() {

        });

    }
};

function connect(url) {
    ws = new WebSocket(url);
    ws.binaryType = 'arraybuffer';
    ws.onopen = function() {
        var connected = document.getElementById('status');
        connected.value = "true"
        connected.setAttribute('title', "status : Connected")
        connected.innerHTML = '<p >wifi_tethering</p>'
        var connected = document.getElementById('button');
        connected.value = "disconnect"
        ws.send('1234\r\n');
        console.log('\x1b[31mWelcome to MicroPython!\x1b[m\r\n');
        ws.onmessage = function(event) {
            if (event.data instanceof ArrayBuffer) {
                var data = new Uint8Array(event.data);
                switch (binary_state) {
                    case 11:
                        // first response for put
                        console.log(decode_resp(data))
                        if (decode_resp(data) == 0) {
                            // send file data in chunks
                            console.log(put_file_data)
                            for (var offset = 0; offset < put_file_data.length; offset += 1024) {
                                ws.send(put_file_data.slice(offset, offset + 1024));
                            }
                            console.log('end of 11')
                            binary_state = 12;
                        }
                        break;
                    case 12:
                        put_file_data = str2ab('');
                        // final response for put
                        if (decode_resp(data) == 0) {
                            //update_file_status('Sent ' + put_file_name + ', ' + put_file_data.length + ' bytes');
                        } else {
                            //update_file_status('Failed sending ' + put_file_name);
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
                                    update_file_status('Getting ' + get_file_name + ', ' + get_file_data.length + ' bytes');
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
                            update_file_status('Got ' + get_file_name + ', ' + get_file_data.length + ' bytes');
                            saveAs(new Blob([get_file_data], {
                                type: "application/octet-stream"
                            }), get_file_name);
                        } else {
                            update_file_status('Failed getting ' + get_file_name);
                        }
                        binary_state = 0;
                        break;
                    case 31:
                        // first (and last) response for GET_VER
                        console.log('GET_VER', data);
                        binary_state = 0;
                        break;
                }
            }
            //console.log(event.data);
        };
    };
    ws.onclose = function() {
        var connected = document.getElementById('status');
        connected.value = "false"
        connected.setAttribute('title', "status : disconnected")
        connected.innerHTML = '<p >perm_scan_wifi</p>'

        var connected = document.getElementById('button');
        connected.value = "connect"
        console.log('\x1b[31mDisconnected\x1b[m\r\n');



    }
}

function decode_resp(data) {
    if (data[0] == 'W'.charCodeAt(0) && data[1] == 'B'.charCodeAt(0)) {
        var code = data[2] | (data[3] << 8);
        return code;
    } else {
        return -1;
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

function put_file() {



    var code = Blockly.Python.workspaceToCode(workspace);

    console.log(code)
    code = code.split('start')
    code = code[1].split('end')
    document.getElementById('repl').value = code[0];

    put_file_data = str2ab(code[0]);

    var dest_fname = document.getElementById('filename').value + '.py';
    var dest_fsize = put_file_data.length;
    console.log(dest_fname)
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
    console.log('Sending ' + put_file_name + '...');
    ws.send(rec);
    console.log(rec)
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
        console.log(e.target.result)
        put_file_data = new Uint8Array(e.target.result);
        console.log(put_file_data)
        document.getElementById('put-file-list').innerHTML = '' + escape(put_file_name) + ' - ' + put_file_data.length + ' bytes';
        document.getElementById('put-file-button').disabled = false;
    };
    reader.readAsArrayBuffer(f);
    console.log(f)
}
