var game = [];

var generateNewGame = function() {
	for(var row = 0; row < 9;row++){
		fillRowWith(row, generateRandomNumbersRow());
	}
	showNumbersOnBoard();
}

var generateRandomNumbersRow = function() {
	var numbers = [1,2,3,4,5,6,7,8,9];
	var randomNumbersRow = [];
	for(var i=0; i<9; i++){
		var index = Math.floor(Math.random() * numbers.length);
		randomNumbersRow.push(numbers[index]);
		numbers.splice(index,1);
	}
	return randomNumbersRow;
}

var fillRowWith = function(rowNo, row) {
	game.push([]);
	var colNo = 0;
	while(row.length > 0){
		var numberToFill = row[0];
		// if(isNumberExistsInCol(colNo, numberToFill, rowNo)){
		// 	row.push(numberToFill);
		// 	console.log(row.toString());
		// }else{
			game[rowNo].push(row[0]);
			colNo++;
		// }
		row.splice(0,1);
	}
}

var isNumberExistsInCol = function(colNo, number, maxRow) {
	for(var row = 0; row < maxRow; row++) {
		if(game[row][colNo] == number) return true;
	}
	return false;
}

var showNumbersOnBoard = function() {
	game.forEach(function(row, rowNo){
		row.forEach(function(col, colNo){
			var id = (rowNo + 1).toString() + (colNo + 1).toString();
			$("#"+id).html(col);
		});
	}); 
}