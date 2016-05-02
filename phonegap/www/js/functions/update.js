////////////////////////////////////UPDATES/////////////////////////////////////

function update(){
	updateBoard();
	updateScore();
	updateAlert();
	updateMenu();
}

function updateMenu(){
	return;
}

function updatePrompt(){
	$('.prompt').show();
	$('.overlay').show();
}

function updateAlert(){
	if (sBoard.emp() === 0){
		var dom = sBoard.dominance();
		var winner = dom[0];
		var p1 = dom[1].toString();
		var p2 = dom[2].toString();

		if (p2 > p1){
			var temp = p2;
			p2 = p1;
			p1 = temp;
		}

		if (winner <= maxTurn){
			$('.alert-message').text(settings.getName(winner-1) + " wins! (" + p1 + " to " + p2 +")");
		} else {
			$('.alert-message').text('It\'s a tie!');
		}
		$('.alert').show();
		$('.overlay').show();
	}
}

/*
* This function updates the scores by checking the dominance function
* of the baord object nad calling increase/decrease score
*/
function updateScore(){
	var dom = sBoard.dominance();
	score1 = scoreVal[0][0]*10+scoreVal[0][1]
	score2 = scoreVal[1][0]*10+scoreVal[1][1]
	if( score1 > dom[1]){
		decreaseScore('.score1',score1,dom[1],0);
	} else if (score1 < dom[1]){
		increaseScore('.score1',score1,dom[1],0);
	}
	if(score2 > dom[2]){
		decreaseScore('.score2',score2,dom[2],1);
	} else if (score2 < dom[2]){
		increaseScore('.score2',score2,dom[2],1);
	}
}

/*
* Updates the UI to display the current layout
*/
function updateBoard() {
	for (var y = 0; y < sBoard.hgt(); y++){
		for (var x = 0; x < sBoard.wdt(); x++){
			var file = '.' + String.fromCharCode(97+x);
			var rank = '.' + (y+1).toString();

			if (sArray[y][x] != (maxTurn + 1)){
				var pnum = '1';
				if (sArray[y][x] == 2 || sArray[y][x] == 5){
					pnum = '2';
				}

				/*
				* this part adds player logos to the discs
				* it is a bit more complex in order to accomidate more than
				* two players since there are only two sides to a disc
				*/
				var player = 'player'+pnum;
				var front = $(file).children(rank).find('.front');
				var back = $(file).children(rank).find('.back');
				var disc = $(file).children(rank).children('.disc');
				if (disc.attr('class').indexOf('flipped') <= -1){
					if (front.attr('class').indexOf(player) <= -1){
						player = player + ' back';
						back.attr('class', player);
						disc.toggleClass('flipped');
					}
				} else {
					if (back.attr('class').indexOf(player) <= -1){
						player = player + ' front';
						front.attr('class', player);
						disc.toggleClass('flipped');
					}
				}
				disc.hide().show(0);
			} else {
				console.log("test");
				$(file).children(rank).children().remove();
				$(file).children(rank).css('opacity',0.6.toString());
			}
		}
	}
}
