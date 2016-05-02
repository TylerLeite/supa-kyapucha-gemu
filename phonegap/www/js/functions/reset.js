/////////////////////////////////////RESETS/////////////////////////////////////

function reset(){
	resetBoard();
	resetScoreBoard();
	//resetTurn();
	resetMenu();
	resetAlert();
	resetPrompt();
}

function resetTurn(){
	turn = 1;
}
function resetBoard(){
	sBoard.reset();
	updateBoard();
}

function resetMenu(){
	return;
}

function resetAlert(){
	initializeAlert();
}

function resetPrompt(){
	initializePrompt();
}

function resetScoreBoard(){
	$('.score').children('.ones').text("0");
	$('.score').children('.tens').text("0");
	scoreVal =[[0,0],[0,0]];
}
