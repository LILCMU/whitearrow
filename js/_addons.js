var arraddons=[];

function addblocktosys (argument) {
	arraddons.push(argument);
	window.localStorage.setItem("addons", JSON.stringify(arraddons));
}


$('[id^=Addons]').click(function(){
  console.log($(this).attr('id'))


 

});
