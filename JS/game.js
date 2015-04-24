var fs = require("fs");

// var board = JSON.parse(fs.readFileSync("./Data/board.json"));

var displayBoard = function() {
	$("#loading").hide();
	$("#solve").attr("disabled",true);
	$("#check").attr("disabled",true);
	$("#saveGameBtn").attr("disabled",true);
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
	$("#numbersModal").css("width","160px");
	for(var number=1;number<=9;number++){
		$("#numbersModalBody").append("<button onclick='markNumber("+number+")'  class='btn btn-default btn-m'>"+number+"</button>");
		if(number % 3 == 0)$("#numbersModalBody").append("<br>");
	}
}

var getHtmlButtonWithId = function(id){
	return "<button id='" + id + "' onclick = gotClick(id) class='btn btn-lg btn-default' disabled>&nbsp;&nbsp;</button>";	
}

var removeCheckFormatClass = function(){
	forEachKeyInBoard(function(key){
		$("#"+key).attr("class","btn btn-lg btn-default");
	});
}

var gotClick = function(id) {
	removeCheckFormatClass();
	var position = $("#"+id).position();
	$("#numbersModal").css("top",position.top);
	$("#numbersModal").css("left",position.left);
	$("#hiddenNumber").attr("num",id);
	$("#numbersModal").modal("show");
}

var markNumber = function(number){
	var id = $("#hiddenNumber").attr("num");
	$("#"+id).html(number);
	$("#numbersModal").modal("hide");
	board[id]["value"] = number;
} 


var checkAnswer = function() {
	var count = 0;
	forEachKeyInBoard(function(key){
		if((board[key]["value"] != board[key]["ans"])) {
			$("#"+key).attr("class","btn btn-lg btn-wrong");
			count++;
		}
	});
	if(count == 0) alert("Well Done!! Good Job!!");
}


var gotBodyClick = function() {
	alert("hai");
}

var saveGame = function() {
	var name = $("#name").val();
	if(name == "") $("#errMssg").show();
	else{
		saveTheBoardForFuture(name);
		$("#errMssg").hide();
		$("#saveGame").modal("hide");
	}
}

var saveTheBoardForFuture = function(name) {
	var src = "./Data/board.json";
	var dest = "./Data/SavedGames/" + name + ".json";
	fs.writeFileSync(src, JSON.stringify(board));
	fs.writeFileSync(dest, fs.readFileSync(src));
	alert("Saved Successfully");
}

var openLoadGameDialog = function() {
	addSavedGamesToList();
	$("#loadGame").modal("show");
}

var addSavedGamesToList = function() {
	var list = fs.readdirSync("./Data/SavedGames");
	$("#listOfSavedGames").html("");
	if(list.length == 0)$("#listOfSavedGames").append("No Saved Games");

	list.forEach(function(fileName){
		fileName = fileName.split(".")[0];
		$("#listOfSavedGames").append("<li class='list' onclick='loadGame(\""+fileName+"\")'>"+fileName+"</li>");
	});
}
var loadGame = function(fileName) {
	var src = "./Data/SavedGames/"+fileName+".json";
	var dest = "./Data/board.json";
	fs.writeFileSync("./Data/board.json", fs.readFileSync("./Data/SavedGames/"+fileName+".json"));
	getChangedBoard();
	displayBoard();
	$("#loadGame").modal("hide");
}

var openSaveGameDialog = function() {
	$('#saveGame').modal("show");
}

var cancel = function(id) {
	$("#"+id).modal("hide");
}

$(document).ready(displayBoard);



