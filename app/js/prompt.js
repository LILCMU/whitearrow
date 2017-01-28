if(!localStorage.nsc_prompt_ip){
        document.getElementById('url').value = '192.168.4.1'
      }
      else if(localStorage.nsc_prompt_ip){
        document.getElementById('url').value = localStorage.nsc_prompt_ip
      }

var term;
var ws;
var connected = document.getElementById('status').getAttribute('value');
var trigger = false;
var binary_state = 0;
var put_file_name = null;
var put_file_data = null;
var get_file_name = null;
var get_file_data = null;
var cmd="";
var arrCMD = [];
var log=[];

function openTerm() {

//console.log('term1.html?'+'ip='+ document.getElementById('url').value + '&port=' = document.getElementById('port_url').value)
document.getElementById('openshell').setAttribute('href', 'term1.html?'+'ip='+ document.getElementById('url').value + '&port=' + document.getElementById('port_url').value);
}




function calculate_size(win) {
  
    var cols = Math.max(30, Math.min(80, (win.innerWidth - 180) / 5)) | 0;
    var rows = Math.max(12, Math.min(24, (win.innerHeight - 180) / 12)) | 0;
    return [cols, rows];
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
      term.open(document.getElementById("repl"));
    
 

    };
    window.addEventListener('resize', function() {
        var size = calculate_size(self);
        term.resize(size[0], size[1]);
    });
    if(connected==="false" && trigger){
        
            $('#step1').trigger('click');
           

        setTimeout(function() {
             $('#step1miss').trigger('click'); 
            $('#step1miss').trigger('click'); 
            $('#step2').trigger('click');
          
}, 15000);
        setTimeout(function() {
            $('#step2miss').trigger('click'); 
            $('#step2miss').trigger('click'); 
            $('#step3').trigger('click');
            
}, 30000);
setTimeout(function() {
$('#step3miss').trigger('click');
            $('#step3miss').trigger('click');

}, 45000);


             
    }

}).call(this);

function button_click() {
    if (connected) {
        ws.close();
    } else {
        document.getElementById('url').disabled = true;
        document.getElementById('port_url').disabled = true;
        document.getElementById('button').value = "Disconnect";
         var connected = document.getElementById('status');
      connected.value = "true"
      connected.setAttribute('title',"status : Connected")
      connected.innerHTML ='<p >wifi_tethering</p>'
        localStorage.nsc_prompt_ip = document.getElementById('url').value;
        connect('ws://'+ document.getElementById('url').value +':'+ document.getElementById('port_url').value + '/');
    }
}

function prepare_for_connect() {
    document.getElementById('url').disabled = false;
    document.getElementById('port_url').disabled = false;
    document.getElementById('button').value = "Connect";
}

function update_file_status(s) {
    document.getElementById('file-status').innerHTML = s;
}

function connect(url) {
    var commandSystem = false
    ws = new WebSocket(url);
    ws.binaryType = 'arraybuffer';
    term.write('\x1b[36mconnected to  '+url+ '  \x1b[m\r\n');
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
        term.write('\x1b[31mWelcome to MicroPython!\x1b[m\r\n');

        ws.onmessage = function(event) {
            if(event.data=="~"){
                if (commandSystem) {
                    commandSystem = false
                    console.log('end cmd')
                } else{commandSystem = true};
            }

            if(!commandSystem){
            if (event.data instanceof ArrayBuffer) {
                var data = new Uint8Array(event.data);
                switch (binary_state) {
                    case 11:
                        // first response for put
                        if (decode_resp(data) == 0) {
                            // send file data in chunks
                            for (var offset = 0; offset < put_file_data.length; offset += 1024) {
                                ws.send(put_file_data.slice(offset, offset + 1024));
                            }
                            binary_state = 12;
                        }
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

                }
            }

            term.write(event.data);
            
                }
                else{
                    //commmand
                    arrCMD.push(event.data)
                    if(event.data=="\n"){
                        for (var i =  0; i < arrCMD.length; i++) {
                                cmd += arrCMD[i];
                            };
                            log.push(cmd)
                            cmd="";
                            arrCMD = [];
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

function decode_resp(data) {
    if (data[0] == 'W'.charCodeAt(0) && data[1] == 'B'.charCodeAt(0)) {
        var code = data[2] | (data[3] << 8);
        return code;
    } else {
        return -1;
    }
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



function getQueryVariable(variable) {
  var query = window.location.search.substring(1);
  var vars = query.split("&");
  for (var i=0;i<vars.length;i++) {
    var pair = vars[i].split("=");
    if (pair[0] == variable) {
      return pair[1];
    }
  } 
  alert('Query Variable ' + variable + ' not found');
}

