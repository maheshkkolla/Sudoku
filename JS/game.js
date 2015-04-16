var fs = require('fs');
var board = JSON.parse(fs.readFileSync("./Data/board.json"));

var generateNewGame = function() {
	initializeBoard();
	fillBoard();
	fs.writeFileSync("./Data/board.json", JSON.stringify(board));
	showBoard();
}

var showBoard = function() {
	var keys = Object.keys(board);
	keys.forEach(function(key){
		$("#"+key).html(board[key]["value"]);
	});
}

var getKeyFrom = function(row,col){
	return row.toString() + col.toString();
}

var fillBoard = function() {
	var subBoard = getSubBoard();
	var tempBoard = [];
	for(var i=0;i<3;i++){
		tempBoard.push(getRowOne(subBoard));
		tempBoard.push(getRowTwo(subBoard));
		tempBoard.push(getRowThree(subBoard));
		subBoard = getChangedSubBoard(subBoard);
	}
	fillBoardWith(tempBoard);
}

var getChangedSubBoard = function(subBoard) {
	var newSubBoard = [[],[],[]];
	for(var row=0;row<3;row++){
		newSubBoard[row].push(subBoard[row][2]);
		newSubBoard[row].push(subBoard[row][0]);
		newSubBoard[row].push(subBoard[row][1]);
	}
	return newSubBoard;
}

var getRowOne = function(subBoard) {
	return(subBoard[0].concat(subBoard[2]).concat(subBoard[1]));
}
var getRowTwo = function(subBoard) {
	return(subBoard[1].concat(subBoard[0]).concat(subBoard[2]));
}
var getRowThree = function(subBoard) {
	return(subBoard[2].concat(subBoard[1]).concat(subBoard[0]));
}

var fillBoardWith = function(tempBoard){
	for(var row=0;row<tempBoard.length;row++){
		for(var col=0; col<tempBoard.length;col++){
			var key = getKeyFrom(row+1,col+1);
			board[key]['value'] = tempBoard[row][col];
		}
	}
}


var getSubBoard = function() {
	var subBoard = [];
	var numbers = [1,2,3,4,5,6,7,8,9];
	for(var row=0;row<3;row++){
		subBoard.push([]);
		for(var col=0;col<3;col++){
			var index = getRandomNumberBelow(numbers.length);
			subBoard[row].push(numbers[index]);
			numbers.splice(index,1);
		}
	}
	return subBoard;
}

var getRandomNumberBelow = function(number) {
	return Math.floor(Math.random() * number);
}

var initializeBoard = function() {
	var subId = 1;
	for(var row=1;row<=9;row++) {
		for(var col=1;col<=9;col++) {
			var key = row.toString() + col.toString();
			board[key] = {"value":"\t", "readOnly":false, "subId": subId,"ans":"\t"};
			if(col % 3 == 0) subId++;
		}
		if((subId-1) % 3 == 0 && row % 3 != 0){
			subId = subId - 3;
		}
	}
}
