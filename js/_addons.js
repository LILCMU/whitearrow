var arraddons=[];


$.post( "http://192.168.12.100:100/nsc2017/api/block/getlistblock", function( res ) {
	var data =res.model;
  console.log(data)
 for (var i = 0; i < data.length ; i++) {
 	
 	console.log(data[i].name)
 
  console.log( "Load was performed." );
  var name = data[i].name
  var uId = data[i].user_id
  var id = data[i].id
  tmp = ' <div class="col-xs-6 col-sm-6 col-md-4 portfolio-item Cloud "><div class="portfolio-wrapper"><div class="portfolio-single"><div class="portfolio-thumb"><p id="name1"> '+ name +' </p></div></div><div class="portfolio-info "><h2> by  '+uId+'</h2><button id="Addons'+id+'">add to Blockly</button></div></div></div>'

$('content').prepend(tmp)
};

}).done(function() {
   
  });

function addblocktosys (argument) {
	arraddons.push(argument);
	window.localStorage.setItem("addons", arraddons);
}


$('[id^=Addons]').click(function(){
  console.log($(this).attr('id'))


 

});
