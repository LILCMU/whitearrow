
var setting = '<ul class="header-dropdown m-r--5">'
                            +   '<li class="dropdown">'
                              +      '<a href="javascript:void(0);" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">'
                               +         '<i class="material-icons">more_vert</i>'
                               +     '</a>'
                                +    '<ul class="dropdown-menu pull-right">'
                                +       '<li><a href="javascript:void(0);">Action</a></li>'
                                +        '<li><a href="javascript:void(0);">Another action</a></li>'
                                 +       '<li><a href="javascript:void(0);">Something else here</a></li>'
                                +    '</ul>'
                               + '</li>'
var count=0;
var arrContent=[];
var typeContent;
var setup=true;
var  content = document.getElementById('content');
	if(window.localStorage.getItem('moniterBlock')){
		var arrContent = JSON.parse(window.localStorage.getItem('moniterBlock'));
		var lenght = $(arrContent).size();
		console.log(lenght)

		for(var i=0;i<lenght;i++){
			count = i
			makeblock(document.getElementById('content'),parseInt(arrContent[String(i)].type));
		}
		count = lenght
		setup=false;
	}
	else{
		console.log("NOUN")
		setup=false;
	}

function clrArr() {
	
	window.localStorage.setItem('moniterBlock', []);

}
function createContent () {
	typeContent = document.getElementById('type').value;
	makeblock(document.getElementById('content'),typeContent);
}
function  makeblock(contentp,typeContentp) {


	console.log(arrContent)
	console.log(typeContentp+ "....."+count)
	if(typeContentp==1){
		var tmp1 = document.createElement('div')
		tmp1.setAttribute('class','col-xs-12 col-sm-12 col-md-4 col-lg-4')

		var tmp2 = document.createElement('div')
		tmp2.setAttribute('class','card')
		tmp1.appendChild(tmp2)

		var tmp3 = document.createElement('div')
		tmp3.setAttribute('class','header bg-red')
		tmp3.innerHTML = setting;
		tmp2.appendChild(tmp3)

		var tmp4 = document.createElement('div')
		tmp4.setAttribute('class','body')
		tmp2.appendChild(tmp4)

		var tmp5 = document.createElement('button')              //In body
		tmp5.setAttribute('class','btn bg-red waves-effect')
		tmp5.appendChild(document.createTextNode('Button'+String(count))); 
		tmp4.appendChild(tmp5)



		tmp1.setAttribute('id','contentId' + String(count))
		tmp3.appendChild(document.createTextNode('ButtonGPIO'+String(count))); 
		contentp.appendChild(tmp1);
		count++;
		


	}
	else if (typeContentp==2)
	{	
		

		var tmp1 = document.createElement('div')
		tmp1.setAttribute('class','col-xs-12 col-sm-12 col-md-6 col-lg-6')
		

		var tmp2 = document.createElement('div')
		tmp2.setAttribute('class','card')
		tmp1.appendChild(tmp2)

		var tmp3 = document.createElement('div')
		tmp3.setAttribute('class','body bg-red')
		tmp3.innerHTML =  setting + '<div class="irs-demo"><input type="text" id="range_01" value="" /></div>'
		tmp2.appendChild(tmp3)
		

		tmp1.setAttribute('id','contentId' + String(count))
		tmp3.appendChild(document.createTextNode('Slider'+String(count))); 
		contentp.appendChild(tmp1);
		count++;

	}
	else if (typeContentp==3){

	}
	else if (typeContentp==4){

		var tmp1 = document.createElement('div')
		tmp1.setAttribute('class','col-xs-12 col-sm-12 col-md-6 col-lg-6')

		var tmp2 = document.createElement('div')
		tmp2.setAttribute('class','card')
		tmp1.appendChild(tmp2)

		var tmp3 = document.createElement('div')
		tmp3.setAttribute('class','header bg-cyan')
		tmp3.innerHTML = '<div id="line1"></div><br><div id="line2"></div>'
		tmp2.appendChild(tmp3)

		var tmp4 = document.createElement('div')
		tmp4.setAttribute('class','body')
		tmp2.appendChild(tmp4)

		tmp1.setAttribute('id','contentId' + String(count))
		tmp4.appendChild(document.createTextNode('Screen'+String(count))); 
		contentp.appendChild(tmp1);
		
		count++;

	}
	else if (typeContentp==5){
		var tmp1 = document.createElement('div')
		tmp1.setAttribute('class','col-xs-12 col-sm-12 col-md-4 col-lg-4')

		var tmp2 = document.createElement('div')
		tmp2.setAttribute('class','card')
		tmp1.appendChild(tmp2)

		var tmp3 = document.createElement('div')
		tmp3.setAttribute('class','header bg-green')
		tmp3.innerHTML = setting;
		tmp2.appendChild(tmp3)

		var tmp4 = document.createElement('div')
		tmp4.setAttribute('class','body')
		tmp2.appendChild(tmp4)

		var tmp5 = document.createElement('h2')              //In body
		tmp5.setAttribute('class','valueContentId'+String(count))
		tmp4.appendChild(tmp5)



		tmp1.setAttribute('id','contentId' + String(count))
		tmp3.appendChild(document.createTextNode('Sensor'+String(count))); 
		contentp.appendChild(tmp1);
		
		count++;

	}
	else if (typeContentp==6){
		
		var tmp1 = document.createElement('div')
		tmp1.setAttribute('class','col-xs-12 col-sm-12 col-md-4 col-lg-6')
	

		var tmp2 = document.createElement('div')
		tmp2.setAttribute('class','card')
		tmp1.appendChild(tmp2)

		var tmp3 = document.createElement('div')
		tmp3.setAttribute('class','header bg-red')
		tmp3.innerHTML = setting;
		tmp2.appendChild(tmp3)

		var tmp4 = document.createElement('div')
		tmp4.setAttribute('class','body')
		tmp2.appendChild(tmp4)

		var tmp5 = document.createElement('input')              //In body
		tmp5.className = "knob"
		tmp5.setAttribute('value','0')
		tmp5.setAttribute('data-width','125')
		tmp5.setAttribute('data-height','125')
		tmp5.setAttribute('data-thickness','0.25')
		tmp5.setAttribute('data-fgColor','#00BCD4')
		tmp5.setAttribute('readonly','readonly')
		tmp4.appendChild(tmp5)



		tmp1.setAttribute('id','contentId' + String(count))
		tmp3.appendChild(document.createTextNode('Circle'+String(count))); 
		contentp.appendChild(tmp1);
		count++;
		
	

	}
	else if (typeContentp==7){

	}
	if(!setup){
	arrContent.push({id:count,type:typeContentp})
	window.localStorage.setItem('moniterBlock', JSON.stringify(arrContent));
	}
	
}



///////handle-recive-sensor//////////
/*
 setInterval(function(){
				var a;
	var arrRec= [];
	var str="";
ws.onmessage = function(event) {

	arrRec.push(event.data)
	
 	if(event.data=="\n"){
 		for (var i =  0; i < arrRec.length; i++) {
 			str += arrRec[i];
 		};
 		arrRec = [];
 		
 	}
 	var str2 = str.split(":",4)
 	if(str2[1]=="sensor")
 	document.getElementById('line1').innerHTML = str2[2] +parseInt(str2[3]);
 	
 }
	}, 100);*/
	