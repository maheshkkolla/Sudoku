var fs = require('fs');
// var board = JSON.parse(fs.readFileSync("./Data/board.json"));

var getChangedBoard = function() {
	board = JSON.parse(fs.readFileSync("./Data/board.json"));
}

var generateNewGame = function(level) {
	$("#loading").show();
	setTimeout(function(){
		initializeBoard();
		fillBoardWithNumbers();
		makeAsPuzzleByRemovingSomeNumbers(level);
		fs.writeFileSync("./Data/board.json", JSON.stringify(board));
		displayBoard();
	},0);
}

var formatThingsAfterDisplayBoard = function() {
	$("#loading").hide();
	$("#solve").attr("disabled",false);
	$("#check").attr("disabled",false);
	$("#saveGameBtn").attr("disabled",false);
}

var makeAsPuzzleByRemovingSomeNumbers = function(level) {
	for(var count=0; count<level; count++){
		var key = removeANumberFromBoard();
		if(cannotSolve()) count = rollBackRemove(key, count);
	}
}

var rollBackRemove = function(key, count) {
	putBackTheNumberRemovedIn(key);
	return count - 1;
}

var removeANumberFromBoard = function() {
	var row = getRandomNumberBelow(9)+1;
	var col = getRandomNumberBelow(9)+1
	var key = makeKeyOutOf(row, col);
	removeTheNumberIn(key);
	return key;
}

var cannotSolve = function() {
	return(!solveGame());
}

var putBackTheNumberRemovedIn = function(key) {
	board[key]["value"] = board[key]["ans"];
	board[key]["readOnly"] = true;
}

var removeTheNumberIn = function(key){
	board[key]["value"] = "\t";
	board[key]["readOnly"] = false;
}

var forEachKeyInBoard = function(functionToExecute){
	var keys = Object.keys(board);
	keys.forEach(functionToExecute);
}

var isKeyReadOnly = function(key) {
	return board[key]["readOnly"];
}

var formatReadOnlyCells = function(key) {
	$("#"+key).attr("disabled",true);
	$("#"+key).css("color","black");
}

var formatVariableCells = function(key) {
	$("#"+key).attr("disabled",false);
	$("#"+key).css("color","cornflowerblue");
}

var displayBoard = function() {
	forEachKeyInBoard(function(key){
		$("#"+key).html(board[key]["value"]);
		if(isKeyReadOnly(key)) formatReadOnlyCells(key);
		else {
			if(board[key]['value'] == "\t") $("#"+key).html("&nbsp;&nbsp;");
			formatVariableCells(key);
		}
	});
	formatThingsAfterDisplayBoard();
}

var makeKeyOutOf = function(row,col){
	return row.toString() + col.toString();
}

var fillBandWithRows = function(tempBoard,subBoard) {
	for(var row=0;row<3;row++){
		tempBoard.push(getFullRowWith(subBoard));
		subBoard = swapRowsOfSubBoard(subBoard);
	}
}

var fillBandsOfTempBoard = function(tempBoard,subBoard) {
	for(var band=0;band<3;band++){
		fillBandWithRows(tempBoard,subBoard);
		subBoard = swapColsOfSubBoard(subBoard);
	}
}

var fillTempBoardUsing = function(subBoard) {
	var tempBoard = [];
	fillBandsOfTempBoard(tempBoard,subBoard);
	return tempBoard;
}

var fillBoardWithNumbers = function() {
	var subBoard = getRandomSubBoard();
	var tempBoard = fillTempBoardUsing(subBoard);
	tempBoard = swapRowsAndColsOf(tempBoard);
	fillBoardWith(tempBoard);
}

var swapRowsAndColsOf = function(tempBoard) {
	// tempBoard = swapSimilarRowsOfBands(tempBoard);
	tempBoard = swapSimilarColsOfBands(tempBoard);
	for(var count=0; count<9; count++){
		tempBoard = swapRowsOf(tempBoard);
		tempBoard = swapColsOf(tempBoard);
	}
	return tempBoard;
}

// var swapSimilarRowsOfBands = function(tempBoard) {
// 	for(var row=0;row<9;row+=2){
// 		var index2 = row + 3; 
// 		if(index2>8)index2 -= 9;
// 		var temp = tempBoard[row];
// 		tempBoard[row] = tempBoard[index2];
// 		tempBoard[index2] = temp;
// 	}
// 	return tempBoard;
// }

var getSimillarColInNextBand = function(col1) {
	var col2 = col1 + 3;
	if(col2>8) col2 -= 9;
	return col2;
}

var swapSimilarColsOfBands = function(tempBoard) {
	for(var col1=0; col1<9; col1+=2){
		var col2 = getSimillarColInNextBand(col1);
		swapTheseColsIn(col1,col2,tempBoard);
	}
	return tempBoard;
}

var swapTheseColsIn = function(col1,col2,tempBoard){
	for(var row=0;row<9;row++){
		var temp = tempBoard[row][col1];
		tempBoard[row][col1] = tempBoard[row][col2];
		tempBoard[row][col2] = temp;
	}
}

var swapTheseRowsIn = function(row1,row2,tempBoard) {
	var temp = tempBoard[row1];
	tempBoard[row1] = tempBoard[row2];
	tempBoard[row2] = temp;
}

var swapRowsOf = function(tempBoard) {
	for(var band=0;band<9;band+=3){
		var row1 = band + getRandomNumberBelow(3);
		var row2 = band + getRandomNumberBelow(3);
		swapTheseRowsIn(row1,row2,tempBoard);
	}
	return tempBoard;
}

var swapColsOf = function(tempBoard) {
	for(var band=0;band<9;band+=3) {
		var col1 = band + getRandomNumberBelow(3);
		var col2 = band + getRandomNumberBelow(3);
		swapTheseColsIn(col1,col2,tempBoard);
	}
	return tempBoard;
}

var swapRowsOfSubBoard = function(subBoard) {
	var temp = subBoard[0];
	subBoard.splice(0,1);
	subBoard.push(temp);
	return subBoard;
}

var swapColsOfSubBoard = function(subBoard) {
	var newSubBoard = [[],[],[]];
	for(var row=0;row<3;row++){
		newSubBoard[row].push(subBoard[row][2]);
		newSubBoard[row].push(subBoard[row][0]);
		newSubBoard[row].push(subBoard[row][1]);
	}
	return newSubBoard;
}

var getFullRowWith = function(subBoard) {
	return(subBoard[0].concat(subBoard[2]).concat(subBoard[1]));
}

var fillValueInBoard = function(key,value){
	board[key]['ans'] = value;
	board[key]['value'] = value;
}

var fillColsOfRow = function(row,tempBoard) {
	for(var col=0; col<tempBoard.length;col++){
		var key = makeKeyOutOf(row+1,col+1);
		fillValueInBoard(key, tempBoard[row][col]);
	}
}

var fillBoardWith = function(tempBoard){
	for(var row=0;row<tempBoard.length;row++){
		fillColsOfRow(row,tempBoard);
	}
}

var fillSubBoardColOf = function(row, subBoard, numbers) {
	for(var col=0;col<3;col++){
		var index = getRandomNumberBelow(numbers.length);
		subBoard[row].push(numbers[index]);
		numbers.splice(index,1);
	}
}

var fillSubBoardRows = function(subBoard, numbers) {
	for(var row=0;row<3;row++){
		subBoard.push([]);
		fillSubBoardColOf(row, subBoard, numbers);
	}
}

var getRandomSubBoard = function() {
	var subBoard = [];
	var numbers = [1,2,3,4,5,6,7,8,9];
	fillSubBoardRows(subBoard,numbers);
	return subBoard;
}

var getRandomNumberBelow = function(number) {
	return Math.floor(Math.random() * number);
}

var initializeColsOfRow = function(row, subId) {
	for(var col=1;col<=9;col++) {
		var key = makeKeyOutOf(row, col);;
		board[key] = {"value":"\t", "readOnly":true, "subId": subId,"ans":"\t"};
		if(col % 3 == 0) subId++;
	}
}

// var changeSubIdAsPerRow = function(subId, row) {
// 	if((subId-1) % 3 == 0 && row % 3 != 0)
// 		subId = subId - 3;
// 	return subId;
// }

var initializeBoard = function() {
	var subId = 1;
	for(var row=1;row<=9;row++) {
		initializeColsOfRow(row, subId);
		if(row % 3 == 0) subId+=3;
		// subId = changeSubIdAsPerRow(subId, row);
	}
}


