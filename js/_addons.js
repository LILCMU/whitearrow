var arraddons=[];

arraddons = JSON.parse(window.localStorage.getItem("addons"))

function addblocktosys (argument) {

	arraddons.push(argument);
	window.localStorage.setItem("addons", JSON.stringify(arraddons));
}

function addons (argument) {
	arraddons = JSON.parse(window.localStorage.getItem("addons"))
	console.log(argument)
	addblocktosys (argument)

}

$('[id^=Addons]').click(function(){

  console.log($(this).attr('id'))

});
