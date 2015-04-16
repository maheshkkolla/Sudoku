var game = [];
var firstSubBoard = [[],[],[]];

var generateNewGame = function() {
	fillBoard();
	showNumbersOnBoard();

}

var fillBoard = function() {
	fillSubBoardOne();
	for(var i=0;i<3;i++){
		game.push(getRowOne());
		game.push(getRowTwo());
		game.push(getRowThree());
		changeSubBoard();
	}
	swapCols();	
}

var swapCols = function() {
	for(var col=0; col<9; col+=3){
		var index1 = col + getRandomNumberBelow(3);
		var index2 = col + getRandomNumberBelow(3);
		for(var row=0; row<9; row++){
			var temp = game[row][index1];
			game[row][index1] = game[row][index2];
			game[row][index2] = temp;
		}
	}
}

// var swapRows = function() {
// 	for(var i=0;i<9;i+=3){
// 		var index1 = i + getRandomNumberBelow(3);
// 		var index2 = i + getRandomNumberBelow(3);
// 		var temp = game[index1];
// 		game[index1] = game[index2];
// 		game[index2] = temp;
// 	}
// }

var changeSubBoard = function() {
	var newSubBoard = [[],[],[]];
	for(var row=0;row<3;row++){
		newSubBoard[row].push(firstSubBoard[row][2]);
		newSubBoard[row].push(firstSubBoard[row][0]);
		newSubBoard[row].push(firstSubBoard[row][1]);
	}
	firstSubBoard = newSubBoard;
}

var fillSubBoardOne = function() {
	var numbers = [1,2,3,4,5,6,7,8,9];
	for(var row=0;row<3;row++){
		for(var col=0;col<3;col++){
			var index = getRandomNumberBelow(numbers.length);
			firstSubBoard[row].push(numbers[index]);
			numbers.splice(index,1);
		}
	}
}

var getRowOne = function() {
	return(firstSubBoard[0].concat(firstSubBoard[2]).concat(firstSubBoard[1]));
}
var getRowTwo = function() {
	return(firstSubBoard[1].concat(firstSubBoard[0]).concat(firstSubBoard[2]));
}
var getRowThree = function() {
	return(firstSubBoard[2].concat(firstSubBoard[1]).concat(firstSubBoard[0]));
}

var getRandomNumberBelow = function(number) {
	return Math.floor(Math.random() * number);
}


var showNumbersOnBoard = function() {
	game.forEach(function(row, rowNo){
		row.forEach(function(col, colNo){
			var id = (rowNo + 1).toString() + (colNo + 1).toString();
			$("#"+id).html(col);
		});
	}); 
}