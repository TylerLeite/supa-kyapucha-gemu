if (GT === null || typeof(GT) != "object") { var GT = new Object(); }
if (GT.vars === null || typeof(GT.vars) != "object") { GT.vars = new Object(); }

function appendFiles(){
  /*
  * In each file column, for the height of the board, add rank squares
  */
  $('.board-file').each(function() {
    number = GT.vars.board.hgt();
    for (var i = 0; i < GT.vars.board.hgt(); i++){
      $(this).append('<div class="board-rank ' + number + '"></div>');
      number -= 1;
    }
  });
}

GT.UI.Board = function(){};

GT.UI.Board.prototype.initialize = function(){
  /*
  *	Since jQuery can only change styles for existing DOM objects, this for
  * loop adds style tags to the html to style the divs from the start.  The
  * loop styes the logos for each player based on the settings class.
  */
  var player;
  for (var i = 1; i < 3; i++){
    player = ".player" + i.toString();
    var url = "url('" + GT.vars.settings.getPiece(i-1) + "')";
    $("<style type='text/css'>"+player+"{ background-image: "+url+"; }</style>")
      .appendTo(document.documentElement);
    $("<style type='text/css'>"+player+" { background-size: contain; }</style>")
      .appendTo(document.documentElement);
  }
  /*
  * For the width of the board, add file columns
  */
  var letter = 'a';
  for (i = 0; i < GT.vars.board.wdt(); i++){
    $('.game-board').append('<div class="board-file ' + letter + '"></div>');
    letter = nextChar(letter);
  }
  appendFiles();

  for (i = 1; i < GT.vars.settings.numPlayers + 1; i++){
    player = '.player' + i.toString();
    $(player).css('background-image', 'url("' + GT.vars.settings.getPiece(i-1) + '")');
    $(player).css('background-size', 'contain');
  }
};

GT.UI.Board.prototype.reset = function(){
  function resetBoard(){
    GT.vars.board.reset();
    this.updateBoard();
  }
};

GT.UI.Board.prototype.resize = function(){
	var squareSize = getSquareSize();
	var winHgt = $(window).height();
	/*
	* Change the height and width of the columns and rows to fit the screen
	* minus 20 takes into account 10 px of padding on top and bottom
	*/
	$('.board-file').css('width',squareSize.toString());
	$('.board-file').css('height',(winHgt-20).toString());
	$('.board-rank').css('height',squareSize.toString());
};

GT.UI.Board.prototype.update = function(){
  for (var y = 0; y < GT.vars.board.hgt(); y++){
    for (var x = 0; x < GT.vars.board.wdt(); x++){
      var file = '.' + String.fromCharCode(97+x);
      var rank = '.' + (y+1).toString();

      if (GT.vars.board.tile[y][x] != (3)){
        var pnum = '1';
        if (GT.vars.board.tile[y][x] == 2 || GT.vars.board.tile[y][x] == 5){
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
        $(file).children(rank).css('opacity',(0.6).toString());
      }
    }
  }
};

GT.UI.Board.prototype.addTile = function(){
  /*
  * Handles when a tile is clicked, first checks if valid, then changes the
  * tile and updates the board, then checks if all tiles have been filled
  * and if so declares a winner.
  */
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
    GT.UI.update();
  }
};
