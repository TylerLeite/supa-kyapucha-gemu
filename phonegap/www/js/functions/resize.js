/////////////////////////////////////RESIZES////////////////////////////////////

function resize(){
	resizeMenu();
	resizeBoard();
	resizeScoreBoard();
	resizeText();
}

/*
*	This function resizes the text of the scores to be the right height and
* width, this is separated from the resize function because it needs to be
* called after the DOM objects are initialized since it relies on the
* height and width of the .score container.
*/
function resizeText(){
	var digitHgt = $('.text-resize').height();
	var digitWdt = Math.floor($('.text-resize').width()/2);
	$('.sizer').css("fontSize","1px");
	fontSize = 1
	while($('.sizer').height() < digitHgt && $('.sizer').width()<digitWdt){
		fontSize += 1
		$('.sizer').css("font-size", fontSize+"px");
		$('.ones').css("font-size", fontSize+"px");
		$('.tens').css("font-size", fontSize+"px");
	}
}

function resizeMenu(){
	var winHgt = $(window).height();
	var winWdt = $(window).width();
	var floatSize = Math.floor(Math.min(winHgt, winWdt) * .40);
	floatSize = floatSize.toString() + "px";
	$('.menu-float').css({height:floatSize, width:floatSize});
}
/*
*	The resize function resizes the board DOM objects to the right size.
*/
function resizeScoreBoard(){
	var squareSize = getSquareSize();
	var winHgt = $(window).height();
	var winWdt = $(window).width();
	/*
	* remHgt is the remaining board height left after the board is sized
	* remWdt is the remaining width
	* logo1/2 and score1/2 are divs to hold the logos and scores
	*/
	var remHgt = winHgt-(squareSize*sBoard.hgt());
	var remWdt = winWdt-(squareSize*sBoard.wdt());
	var logo1 = '<div class = "logo logo1"></div>';
	var score1 = '<div class = "score score1"><div class = "tens">0</div><div class = "ones">0</div></div>'
	var logo2 = '<div class = "logo logo2"></div>';
	var score2 = '<div class = "score score2"><div class = "tens">0</div><div class = "ones">0</div></div>'

	/*
	* If the remaining height is greater, show only the top scoreboard
	* Size the scoreboard to the correct height (at least 50px + 20padding)
	* Make the scoreboard full width and top 0
	* Pad the game-board accordingly
	* Append the logo and score divs
	* Resize the logo and score divs
	* If scoreboard is less than 50px hide it
	*/
	var logoSize;
	if (remHgt > remWdt){
		if (remHgt >= 140){
			$('.score-board').css('height', ((remHgt/2)-20).toString());
			$('.score-board').append(logo1+score1+logo2+score2);

			var extraPad = (remHgt/2)-20;
			extraPad += ((remHgt - extraPad - 50) / 4);
			$('.game-board').css('padding-top', extraPad.toString()+"px");

			var logoWdt = (1/4) * (winWdt);
			var logoHgt = (remHgt/2)-20;
			logoSize = Math.floor(Math.min(logoWdt,logoHgt));
			$('.logo').css("width", logoSize.toString());
			$('.logo').css("height", logoSize.toString());
			$('.score').css("width", logoSize.toString());
			$('.score').css("height", logoSize.toString());
			var extraLogo = winWdt - (logoSize * 4);
			$('.logo2').css("margin-left",extraLogo.toString()+"px");

			$('.top-score').css({left:'0',top:'0'});
			$('.top-score').css("height", logoSize.toString());
			$('.top-score').css("width","100%");
			$('.bottom-score').hide();
		} else {
			$('.top-score').hide();
			$('.bottom-score').hide();
		}
	} else {
		/*
		* Otherwise add the logos to the top and bottom scores and
		* make sure the game-board is centered
		*/
		$('.top-score').append(logo1+score1);
		$('.top-score').css({top:"10px",left:"10px"});

		$('.bottom-score').show();
		$('.bottom-score').append(logo2+score2);

		$('.game-board').css('padding-top', "10px")
		var logoWdt = (remWdt/2)-20;
		var logoHgt = (winHgt*.6);
		logoSize = Math.floor(Math.min(logoWdt/2,logoHgt));
		$('.score-board').css('width', (logoSize*2).toString());
		$('.score-board').css('height', logoSize.toString());
		if (remWdt/2 >= 400){
			$('.top-score').css('left', (((remWdt/2)-400)/2).toString()+"px");
			$('.bottom-score').css('right', (((remWdt/2)-400)/2).toString()+"px");
		}
	}
	logoSize = Math.min(logoSize,200).toString()+"px";
	$('.text-resize').css({height:logoSize,width:logoSize});
}

function resizeBoard(){

	var squareSize = getSquareSize();
	var winHgt = $(window).height();
	/*
	* Change the height and width of the columns and rows to fit the screen
	* minus 20 takes into account 10 px of padding on top and bottom
	*/
	$('.board-file').css('width',squareSize.toString());
	$('.board-file').css('height',(winHgt-20).toString());
	$('.board-rank').css('height',squareSize.toString());
}
