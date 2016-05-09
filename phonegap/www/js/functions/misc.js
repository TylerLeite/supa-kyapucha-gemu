/////////////////////////////////OTHER FUNCTIONS////////////////////////////////
var UI = new GT.UI();
var Alert = new GT.UI.Alert();
var Prompt = new GT.UI.Prompt();
var Menu = new GT.UI.Menu();
var Board = new GT.UI.Board();
var ScoreBoard = new GT.UI.ScoreBoard();
initialize();
resize();
Board.update();
var test = new GT.UI();

function initialize() {
	Alert.initialize();
  Prompt.initialize();
  Menu.initialize();
  Board.initialize();
  ScoreBoard.initialize();
}
function reset(){
	Alert.reset();
  Prompt.reset();
  Board.reset();
  ScoreBoard.reset();
}
function resize(){
	Menu.resize();
  Board.resize();
  ScoreBoard.resize();
}
function update(){
	Board.update();
  ScoreBoard.update();
  Alert.update();
}
/*
* on window orientation change resize everything ... this probably
* doesn't work correctly
*/
$(window).on("orientationchange",function(){
	setTimeout(function(){
		$('#board').children().hide().show(0);
		$('.score-board').empty();
		UI.resize();
		UI.ScoreBoard.update();
		$('.alert').hide();
	},100);
});

/*
* makes randobot moves
*/
function aiMove() {
	var mv = GT.vars.opponent.ai.makeMove();
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
	var fileWdt = (1/GT.vars.board.wdt()) * (winWdt - 20);
	var rankHgt = (1/GT.vars.board.hgt()) * (winHgt - 20);
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

$('.back-btn').click(function(){reset(); resetTurn();});

/*
*	When the ok button on the alert is pressed, reset everything and have the
* AI make it's move if it is the first turn in single player mode.
*/



$('.ok-btn').click(Alert.submit);

$('.sub-btn').click(Prompt.submit);

function addTile(){
	var file = $(this).parent().attr('class').slice(-1).charCodeAt(0) - 97;
  var rank = parseInt($(this).attr('class').slice(-1)) - 1;

  if (GT.vars.board.place(file, rank, GT.vars.turn)){
    var front = '<div class="player'+GT.vars.turn.toString()+' front"></div>';
    var back = '<div class="player'+GT.vars.turn.toString()+' back"></div>';
    $(this).append('<div class="disc">'+front+back+'</div>');
    $(this).css("opacity",(1.0).toString());
    if (GT.vars.turn === 2){
      GT.vars.turn = 1;
    } else {
      GT.vars.turn += 1;
      if (GT.vars.gamemode === 'single' && GT.vars.board.emp() > 0){
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

$('.board-rank').on('click',addTile);
