
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

