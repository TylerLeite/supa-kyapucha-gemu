/////////////////////////////////OTHER FUNCTIONS////////////////////////////////

/*
* on window orientation change resize everything ... this probably
* doesn't work correctly
*/
$(window).on("orientationchange",function(){
	setTimeout(function(){
		$('#board').children().hide().show(0);
		$('.score-board').empty();
		resize();
		updateScore();
		$('.alert').hide();
	},100);
});
/*
* This function increases the score of a scoreboard given the
* scoreboard class, the old score and the new score
* setTimeout is to make it look all cool and count uppy... the score
* board has a separate tens and ones place cause I'm an asshole and it
* looks nicer when counting up to have it this way.  You can fix it if
* you want to make it simple again.
*/
function increaseScore(label,oldS,newS,w){
	if (oldS < newS){
		if(scoreVal[w][1] === 9){
			scoreVal[w][0] += 1;
			$(label).children('.tens').text(scoreVal[w][0].toString());
			scoreVal[w][1] = 0;
			$(label).children('.ones').text(scoreVal[w][1].toString());
		} else {
			scoreVal[w][1] += 1;
			$(label).children('.ones').text(scoreVal[w][1].toString());
		}
		oldS += 1;
		setTimeout(function(){increaseScore(label,oldS,newS,w)}, 100);
	}
}

/*
* Opposite of the increase score function
*/
function decreaseScore(label,oldS,newS,w){
	if (oldS > newS){
		if(scoreVal[w][1]===0){
			scoreVal[w][0] -= 1;
			$(label).children('.tens').text(scoreVal[w][0].toString());
			scoreVal[w][1] = 9;
			$(label).children('.ones').text(scoreVal[w][1].toString());
		} else {
			scoreVal[w][1] -= 1;
			$(label).children('.ones').text(scoreVal[w][1].toString());
		}
		oldS -= 1;
		setTimeout(function(){decreaseScore(label,oldS,newS,w)}, 100);
	}
}

/*
* makes randobot moves
*/
function aiMove() {
	var mv = randoBot.makeMove();
	var file = '.' + String.fromCharCode(97+mv[0]);
	var rank = '.' + (mv[1]+1).toString();
	$(file).children(rank).click();
}

/*
* Handles when a tile is clicked, first checks if valid, then changes the
* tile and updates the board, then checks if all tiles have been filled
* and if so declares a winner.
*/
function addTile() {
	var file = $(this).parent().attr('class').slice(-1).charCodeAt(0) - 97;
	var rank = parseInt($(this).attr('class').slice(-1)) - 1;

	if (sBoard.place(file, rank, turn)){
		var front = '<div class="player'+turn.toString()+' front"></div>';
		var back = '<div class="player'+turn.toString()+' back"></div>';
		$(this).append('<div class="disc">'+front+back+'</div>');
		$(this).css("opacity",(1.0).toString());
		if (turn === maxTurn){
			turn = 1;
		} else {
			turn += 1;
			if (single === true && sBoard.emp() > 0){
				$('.board-rank').off('click',addTile);
				setTimeout(function(){
					$('.board-rank').on('click',addTile);
					aiMove();
				}, 1000);
			}
		}
		update();
	}
}

/*
* Calculate the maximum height and width of each square, then take the
* smaller of the two and use that as the square size. Minus 20 takes into
* account the padding used.
*/
function getSquareSize(){
	var winHgt = $(window).height();
	var winWdt = $(window).width();
	var fileWdt = (1/sBoard.wdt()) * (winWdt - 20);
	var rankHgt = (1/sBoard.hgt()) * (winHgt - 20);
	var squareSize = Math.floor(Math.min(fileWdt,rankHgt));
	return squareSize;
}
/*
* This function returns the next character in the alphabet
*/
function nextChar(c) {
	return String.fromCharCode(c.charCodeAt(0) + 1);
}
