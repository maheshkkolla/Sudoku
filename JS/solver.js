var fs = require('fs');
var board = JSON.parse(fs.readFileSync("./Data/board.json"));
var answerBoard = {};


var solveAndShow = function() {
	solveGame();
	showAnswer();
	$("#solve").html("Hide Answer");
	$("#check").attr("disabled",true);
}

var showAnswer = function() {
	var keys = Object.keys(answerBoard);
	keys.forEach(function(key){
		if(!answerBoard[key]['readOnly'])
		$("#"+key).html(answerBoard[key]['value']);
		$("#"+key).attr("disabled",true);
	});
}

var cloneBoardToAnswerBoard = function() {
	var keys = Object.keys(board);
	keys.forEach(function(key){
		answerBoard[key] = JSON.parse(JSON.stringify(board[key]));
		if(!board[key]['readOnly']) answerBoard[key]["value"] = "\t";
	});
}

var forEachKeyInBoard = function(functionToExecute){
	var keys = Object.keys(board);
	keys.forEach(functionToExecute);
}

var solveTheCell = function(key){
	if(answerBoard[key]["value"] == "\t")
		answerBoard[key]["value"] = getUniqueNumberFor(key);
}

var solveGame = function() {
	cloneBoardToAnswerBoard();
	var count = 0;
	while(getCountOfEmptyCells() > 0){
		count++;
		forEachKeyInBoard(solveTheCell);
		if(count > 81) return false;
	}
	return true;	
}

var getCountOfEmptyCells = function() {
	var count = 0;
	var keys = Object.keys(answerBoard);
	keys.forEach(function(key){
		if(answerBoard[key]['value'] == "\t") count++;
	});
	return count;
}

var getUniqueNumberFor = function(key) {
	var numbers = [1,2,3,4,5,6,7,8,9];
	var row = key.split("")[0];
	var col = key.split("")[1];
	numbers = removeNumbersOf(numbers, getRowValuesOf(row));
	numbers = removeNumbersOf(numbers,getColValuesOf(col));
	numbers = removeNumbersOf(numbers,getSubBoardValuesOf(key));
	if(numbers.length == 1) return numbers[0];
	return("\t");
}

var getRowValuesOf = function(row) {
	return getValuesOf(row, 0);
}

var getColValuesOf = function(col) {
	return getValuesOf(col, 1);
}

var isIdSameAs = function(id1,id2){
	return (id1 == id2);
}

var isValueOfKeyNotEmpty = function(key) {
	return(answerBoard[key]["value"] != '\t');
}

var getValuesOf = function(id, rowOrCol){
	var values = [];
	forEachKeyInBoard(function(key){
		if(isIdSameAs(id, key.split("")[rowOrCol]) && isValueOfKeyNotEmpty(key)) 
			values.push(answerBoard[key]["value"]);
	});
	return values;
}

var getSubBoardValuesOf = function(key) {
	var subId = answerBoard[key]["subId"];
	var values = [];
	forEachKeyInBoard(function(key){
		if(answerBoard[key]["subId"] == subId && isValueOfKeyNotEmpty(key)) 
			values.push(answerBoard[key]["value"]);
	});
	return values;
}

var removeNumbersOf = function(source, removable) {
	removable.forEach(function(number){
		var index = source.indexOf(number);
		if(index != -1) source.splice(index,1);
	});
	return source;
}

var hideAnswer = function() {
	displayBoard();
	$("#solve").html("Show Answer");
	$("#check").attr("disabled",false);
}

var showOrHide = function() {
	removeCheckFormatClass();
	if($("#solve").html() == "Show Answer") solveAndShow();
	else hideAnswer();
}

