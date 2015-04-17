var displayBoard = function() {
	for(var row = 1; row <= 9; row++) {
		for(var col = 1; col <= 9; col++) {
			$("#board").append(getHtmlButtonWithId(row.toString()+col.toString()));
			if(col % 3 == 0) $("#board").append("&nbsp;&nbsp;");
		}
		if(row % 3 == 0) $("#board").append("<p>");
		$("#board").append("<br>");
	}
	initializeNumbersToModal();
}

var initializeNumbersToModal = function(){
	$("#numbersModal").css("width","150px");
	for(var number=1;number<=9;number++){
		$("#numbersModalBody").append("<button onclick='markNumber("+number+")'  class='btn btn-default btn-sm'>"+number+"</button>");
		if(number % 3 == 0)$("#numbersModalBody").append("<br>");
	}
}

var getHtmlButtonWithId = function(id){
	return "<button id='" + id + "' onclick = gotClick(id) class='mybtn btn btn-lg btn-default'>&nbsp;&nbsp;</button>";	
}

$(document).ready(displayBoard);