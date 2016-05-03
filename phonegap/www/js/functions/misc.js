/////////////////////////////////OTHER FUNCTIONS////////////////////////////////

/*
* on window orientation change resize everything ... this probably
* doesn't work correctly
*/
$(window).on("orientationchange",function(){
	setTimeout(function(){
		$('#board').children().hide().show(0);
		$('.score-board').empty();
		GT.UI.resize();
		GT.UI.ScoreBoard.update();
		$('.alert').hide();
	},100);
});

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

function resetTurn(){
	GT.vars.turn = 1;
}

/*
* JqueryMobile has a loader symbol that needs to be hidden after page load
*/
window.onload = function (){
	$(".ui-loader").hide();
};

/*
* When the back button is pressed, reset everything
*/
$(window).on('hashchange', function(e){
 if (window.location.href.indexOf('board')>-1){
	 GT.Music.switch('game');
 } else if (window.location.href.indexOf('level-select')>-1){
	 GT.Music.switch('level-select');
 } else {
	 GT.Music.switch('menu');
 }
});

/*
*	When single, multi or online is clicked, single is toggled to true or false
*/
$('.single').click(function(){GT.vars.gamemode = 'single';});
$('.multi').click(function(){GT.vars.gamemode = 'multi';});
$('.level').click(function(){GT.vars.level = $(this).attr('id'); window.scrollTo(0,0);});
$('.online').click(function(){GT.vars.gamemode = 'multi';});

$('.back-btn').click(function(){GT.UI.reset(); resetTurn();});

/*
*	When the ok button on the alert is pressed, reset everything and have the
* AI make it's move if it is the first turn in single player mode.
*/

$('.ok-btn').click(GT.UI.Alert.sumbit());

$('.sub-btn').click(GT.UI.Prompt.submit());

$('.board-rank').on('click',GT.UI.Board.addTile());
