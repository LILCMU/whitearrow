var imac=0
var iip=0
var arrDevice=[]
	var name_d="";
	var macD="";
	var ipD="";
	if(window.localStorage.getItem('device')){
		var arrDevice = JSON.parse(window.localStorage.getItem('device'));
		for (i = 0 ; i < arrDevice.length; i++) {
		addDevice(arrDevice[i].name,arrDevice[i].mac,arrDevice[i].ip,false)
		};
		
	}
	else{
		console.log("NOUN")

		
	}

//addDevice("micropython1","17:18:19:20","102.41.41.22","disconnect")
function fetchdata () {

	ws.send('import ubinascii\r\nimport network\r\nsta_if = network.WLAN(network.STA_IF)\r\nsta_if.active(1)\r\n')	
	ws.send('ubinascii.hexlify(sta_if.config("mac"))\r\n')	
	
	arrDevice.push({"name":name_d,"mac":macD,"ip":ipD})
	console.log(arrDevice)
	window.localStorage.setItem('device', JSON.stringify(arrDevice));
}

function addDevice(name,mac,ip,status) {

		var  content = document.getElementById('listDevice');

		var tmp1 = document.createElement('div')
		tmp1.setAttribute('class','card')
		

		var tmp2 = document.createElement('div')
		tmp2.setAttribute('class','header bg-light-green')
		tmp1.appendChild(tmp2)

		var tmp3 = document.createElement('h2')
		tmp3.innerHTML = name
		tmp2.appendChild(tmp3)

		var tmp4 = document.createElement('ul')
		tmp4.setAttribute('class','header-dropdown m-r--5')
		tmp4.innerHTML =   '<li>'
                            +        '<a href="javascript:void(0);" data-toggle="cardloading" data-loading-effect="rotation" data-loading-color="lightGreen">'
                             +          ' <i class="material-icons">loop</i>'
                             +       '</a>'
                            +  '  </li>'
                            +    '<li class="dropdown">'
                            +       ' <a href="javascript:void(0);" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">'
                             +         '  <i class="material-icons">more_vert</i>'
                             +     '  </a>'
                             +       '<ul class="dropdown-menu pull-right">'
                              +         ' <li><a href="javascript:void(0);">Action</a></li>'
                              +         ' <li><a href="javascript:void(0);">Another action</a></li>'
                             +          ' <li><a href="javascript:void(0);">Something else here</a></li>'
                            +       ' </ul>'
                           +   '  </li>'
 
		tmp2.appendChild(tmp4)

		var tmp5 = document.createElement('div')
		tmp5.setAttribute('class','body')
		tmp1.appendChild(tmp5)

		var tmp6 = document.createElement('div')
		tmp6.setAttribute('id','mac'+imac)
		tmp6.appendChild(document.createTextNode('MAC:'+String(mac))); 
		tmp5.appendChild(tmp6)

		var tmp7 = document.createElement('div')
		tmp7.setAttribute('id','ip'+iip)
		tmp7.appendChild(document.createTextNode('ip Address:'+String(ip))); 
		tmp5.appendChild(tmp7)


		content.appendChild(tmp1);

		

	
	
}


////////// File manager //////////////
var arrFile=[];
var str="";
var str2="";
function refreshFile() {
	ws.send('\r\nimport os\r\n')
	ws.send('\r\nprint(os.listdir())\r\n')	
}
/*
setInterval(function(){
	ws.onmessage = function(event) {

	arrFile.push(event.data)
	if(event.data=="\n"){
		for (var i =  0; i < arrFile.length; i++) {
 			str += arrFile[i];
 		};

 		if(arrFile[0]=="["){
 			str2 = str;
 			var res = str2.split("[")
 			var res2 = res[1].split("]")
 			var res3 = res2[0].split(",")
 			str2 = res3;
 			for (var i =  0; i < str2.length; i++) {
	 			addFile(str2[i])
 			}

 		console.log(arrFile[0])
			
 		}
 		if(arrFile[0]=="b"){
 			str2=""
 			str2 = str.split("b'");
 			str2 = str2[1].split("'");
 			console.log(str2[0])
 			macD = str2[0]
 			console.log(str2)
 		}

 		
			arrFile = [];

 		}

 		
 		
 			
	}
  
},100)
*/
function addFile(nameFile) {
		var  content = document.getElementById('listfile');

		var tmp1 = document.createElement('div')
		tmp1.setAttribute('class','info-box bg-teal')
		tmp1.innerHTML = '<div class="icon"><i class="material-icons">insert_drive_file</i></div>'

		var tmp2 = document.createElement('div')
		tmp2.setAttribute('class','content')
		tmp2.innerHTML = '<a href="javascript:;"> <i class="material-icons">cloud_download</i></a> <a href="javascript:;"> <i class="material-icons">mode_edit</i></a> <a href="javascript:;"><i class="material-icons">delete</i></a> '
		tmp1.appendChild(tmp2)

		var tmp3 = document.createElement('div')
		tmp3.setAttribute('class','text')
		tmp3.appendChild(document.createTextNode(nameFile)); 
		tmp2.appendChild(tmp3)

		content.appendChild(tmp1);
}	

