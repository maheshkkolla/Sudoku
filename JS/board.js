var displayBoard = function() {
	for(var row = 1; row <= 9; row++) {
		for(var col = 1; col <= 9; col++) {
			$("#board").append(getHtmlButtonWithId(row.toString()+col.toString()));
			if(col % 3 == 0) $("#board").append("&nbsp;");
		}
		if(row % 3 == 0) $("#board").append("<p>");
		$("#board").append("<br>");
	}
}

var getHtmlButtonWithId = function(id){
	return "<span class='btn btn-lg btn-default' id='" + id + "'>&nbsp;&nbsp;&nbsp;</span>";	
}

$(document).ready(displayBoard);