/////////////////////////////////INITIALIZATIONS////////////////////////////////
function initialize(){
	initializeAlert();
	initializePrompt();
	initializeMenu();
	initializeBoard();
	initializeScoreBoard();
}

function initializeAlert(){
	$('.alert').hide();
	$('.overlay').hide();
}

function initializePrompt(){
	$('.prompt').hide();
	$('.overlay').hide();
}

function initializeScoreBoard(){
	$('.score').css({visibility:"hidden"});
	for (var i = 1; i < maxTurn+1; i++){
		var logo = ".logo" + i.toString();
		var url = "url('" + settings.getPiece(i-1) + "')";
		$("<style type='text/css'>"+logo+"{ background-image: "+url+"; }</style>")
			.appendTo(document.documentElement);
		$("<style type='text/css'>"+logo+" { background-size: contain; }</style>")
			.appendTo(document.documentElement);
	}
}

function initializeBoard(){
	/*
	*	Since jQuery can only change styles for existing DOM objects, this for
	* loop adds style tags to the html to style the divs from the start.  The
	* loop styes the logos for each player based on the settings class.
	*/
	for (var i = 1; i < maxTurn+1; i++){
		var player = ".player" + i.toString();
		var url = "url('" + settings.getPiece(i-1) + "')";
		$("<style type='text/css'>"+player+"{ background-image: "+url+"; }</style>")
		.appendTo(document.documentElement);
		$("<style type='text/css'>"+player+" { background-size: contain; }</style>")
		.appendTo(document.documentElement);
	}
	/*
	* For the width of the board, add file columns
	*/
	var letter = 'a';
	for (var i = 0; i < sBoard.wdt(); i++){
		$('.game-board').append('<div class="board-file ' + letter + '"></div>');
		letter = nextChar(letter);
	}
	/*
	* In each file column, for the height of the board, add rank squares
	*/
	$('.board-file').each(function() {
		number = sBoard.hgt();
		for (var i = 0; i < sBoard.hgt(); i++){
			$(this).append('<div class="board-rank ' + number + '"></div>');
			number -= 1;
		}
	});
}
function initializeMenu(){
	if(typeof(Storage) !== "undefined"){
		if(localStorage.getItem("save") !== null){
			//localStorage.clear();
			setStore = localStorage.getItem("save");
			save = setStore;
		} else {
			updatePrompt();
		}
		for (var i = 1; i < settings.numPlayers + 1; i++){
			var player = '.player' + i.toString();
			$(player).css('background-image', 'url("' + settings.getPiece(i-1) + '")');
			$(player).css('background-size', 'contain');
		}
	}
	for (var i = 1; i <= numLevels; i++){
		var img = "background-image: url(img/icons/lvl/"+i.toString()+".png)";
		var obj = '<a href="#board" class = "level" id = "'+i.toString()+'"><div class="menu-float" style="'+img+'"></div></a>'
		$('#level-select').children().first().append(obj);
	}
}
