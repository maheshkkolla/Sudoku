var fs = require('fs');
var board = JSON.parse(fs.readFileSync("./Data/board.json"));

var generateNewGame = function() {
	initializeBoard();
	fillBoard();
	fixReadOnlyNumbers();
	fs.writeFileSync("./Data/board.json", JSON.stringify(board));
	showBoard();
}

var fixReadOnlyNumbers = function() {
	for(var row=1;row<=9;row++){
		for(var count=0;count<=3;count++){
			var col = getRandomNumberBelow(9) + 1;
			var key = getKeyFrom(row,col);
			board[key]["readOnly"] = true;
		}
	}
}

var showBoard = function() {
	var keys = Object.keys(board);
	keys.forEach(function(key){
		if(board[key]["readOnly"]){
			$("#"+key).html(board[key]["value"]);
			$("#"+key).attr("class","btn btn-lg btn-default")
			$("#"+key).attr("disabled",true);
			$("#"+key).css("color","black");
		}
	});
}

var getKeyFrom = function(row,col){
	return row.toString() + col.toString();
}

var fillBoard = function() {
	var subBoard = getRandomSubBoard();
	var tempBoard = [];
	for(var i=0;i<3;i++){
		for(var j=0;j<3;j++){
			tempBoard.push(getFullRowWith(subBoard));
			subBoard = swapRowsOfSubBoard(subBoard);
		}
		subBoard = swapColsOfSubBoard(subBoard);
	}
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

var swapSimilarColsOfBands = function(tempBoard) {
	for(var col=0; col<9; col+=2){
		var index2 = col + 3;
		if(index2>8) index2 -= 9;
		for(var row=0;row<9;row++){
			var temp = tempBoard[row][col];
			tempBoard[row][col] = tempBoard[row][index2];
			tempBoard[row][index2] = temp;
		}
	}
	return tempBoard;
}

var swapRowsOf = function(tempBoard) {
	for(var band=0;band<9;band+=3){
		var index1 = band + getRandomNumberBelow(3);
		var index2 = band + getRandomNumberBelow(3);
		var temp = tempBoard[index1];
		tempBoard[index1] = tempBoard[index2];
		tempBoard[index2] = temp;
	}
	return tempBoard;
}

var swapColsOf = function(tempBoard) {
	for(var band=0;band<9;band+=3) {
		var index1 = band + getRandomNumberBelow(3);
		var index2 = band + getRandomNumberBelow(3);
		for(var row=0;row<9;row++){
			var temp = tempBoard[row][index1];
			tempBoard[row][index1] = tempBoard[row][index2];
			tempBoard[row][index2] = temp;
		}
		return tempBoard;
	}
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
// var getRowTwo = function(subBoard) {
// 	return(subBoard[1].concat(subBoard[0]).concat(subBoard[2]));
// }
// var getRowThree = function(subBoard) {
// 	return(subBoard[2].concat(subBoard[1]).concat(subBoard[0]));
// }

var fillBoardWith = function(tempBoard){
	for(var row=0;row<tempBoard.length;row++){
		for(var col=0; col<tempBoard.length;col++){
			var key = getKeyFrom(row+1,col+1);
			board[key]['value'] = tempBoard[row][col];
		}
	}
}


var getRandomSubBoard = function() {
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


var gotClick = function(id) {
	var position = $("#"+id).position();
	$("#numbersModal").css("top",position.top);
	$("#numbersModal").css("left",position.left);
	$("#hidden").attr("num",id);
	$("#numbersModal").modal("show");
}

var markNumber = function(number){
	var id = $("#hidden").attr("num");
	$("#"+id).html(number);
	$("#numbersModal").modal("hide");
} 


//....................Solver..........................

var solveGame = function() {
	var keys = Object.keys(board);
	keys.forEach(function(key){
		if(board[key]["value"] == "\t"){
			board[key]["value"] = getUniqueNumberFor(key);
		}
	});
}

var getUniqueNumberFor = function(key) {
	var numbers = [1,2,3,4,5,6,7,8,9];
	var row = key.split("")[0];
	var col = key.split("")[1];
	numbers = removeNumbersOf(numbers, getRowValuesOf(row));
	numbers = removeNumbersOf(numbers,getColValuesOf(col));
	numbers = removeNumbersOf(numbers,getSubBoardValuesOf());
	if(numbers.lenght == 1) return numbers[0];
	return("\t");
}
