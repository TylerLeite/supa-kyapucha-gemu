if (GT === null || typeof(GT) != "object") { var GT = new Object(); }
if (GT.vars === null || typeof(GT.vars) != "object") { GT.vars = new Object(); }

function resizeText(){
  var digitHgt = $('.text-resize').height();
  var digitWdt = Math.floor($('.text-resize').width()/2);
  $('.sizer').css("fontSize","1px");
  var fontSize = 1;
  while($('.sizer').height() < digitHgt && $('.sizer').width()<digitWdt){
    fontSize += 1;
    $('.sizer').css("font-size", fontSize+"px");
    $('.ones').css("font-size", fontSize+"px");
    $('.tens').css("font-size", fontSize+"px");
  }
}

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
    if(GT.vars.Scoreboard[w][1] === 9){
      GT.vars.Scoreboard[w][0] += 1;
      $(label).children('.tens').text(GT.vars.Scoreboard[w][0].toString());
      GT.vars.Scoreboard[w][1] = 0;
      $(label).children('.ones').text(GT.vars.Scoreboard[w][1].toString());
    } else {
      GT.vars.Scoreboard[w][1] += 1;
      $(label).children('.ones').text(GT.vars.Scoreboard[w][1].toString());
    }
    oldS += 1;
    setTimeout(function(){increaseScore(label,oldS,newS,w);}, 100);
  }
}

/*
* Opposite of the increase score function
*/
function decreaseScore(label,oldS,newS,w){
  if (oldS > newS){
    if(GT.vars.Scoreboard[w][1]===0){
      GT.vars.Scoreboard[w][0] -= 1;
      $(label).children('.tens').text(GT.vars.Scoreboard[w][0].toString());
      GT.vars.Scoreboard[w][1] = 9;
      $(label).children('.ones').text(GT.vars.Scoreboard[w][1].toString());
    } else {
      GT.vars.Scoreboard[w][1] -= 1;
      $(label).children('.ones').text(GT.vars.Scoreboard[w][1].toString());
    }
    oldS -= 1;
    setTimeout(function(){decreaseScore(label,oldS,newS,w);}, 100);
  }
}

GT.UI.ScoreBoard = function(){};

GT.UI.ScoreBoard.prototype.initialize = function(){
  $('.score').css({visibility:"hidden"});
  for (var i = 1; i < 3; i++){
    var logo = ".logo" + i.toString();
    var url = "url('" + GT.vars.settings.getPiece(i-1) + "')";
    $("<style type='text/css'>"+logo+"{ background-image: "+url+"; }</style>")
      .appendTo(document.documentElement);
    $("<style type='text/css'>"+logo+" { background-size: contain; }</style>")
      .appendTo(document.documentElement);
  }
};

GT.UI.ScoreBoard.prototype.reset = function(){
  $('.score').children('.ones').text("0");
  $('.score').children('.tens').text("0");
  GT.vars.Scoreboard =[[0,0],[0,0]];
};

GT.UI.ScoreBoard.prototype.resize = function(){
  var squareSize = getSquareSize();
  var winHgt = $(window).height();
  var winWdt = $(window).width();
  /*
  * remHgt is the remaining board height left after the board is sized
  * remWdt is the remaining width
  * logo1/2 and score1/2 are divs to hold the logos and scores
  */
  var remHgt = winHgt-(squareSize*GT.vars.board.hgt());
  var remWdt = winWdt-(squareSize*GT.vars.board.wdt());
  var logo1 = '<div class = "logo logo1"></div>';
  var score1 = '<div class = "score score1"><div class = "tens">0</div><div class = "ones">0</div></div>';
  var logo2 = '<div class = "logo logo2"></div>';
  var score2 = '<div class = "score score2"><div class = "tens">0</div><div class = "ones">0</div></div>';

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
  var logoHgt;
  var logoWdt;
  if (remHgt > remWdt){
    if (remHgt >= 140){
      $('.score-board').css('height', ((remHgt/2)-20).toString());
      $('.score-board').append(logo1+score1+logo2+score2);

      var extraPad = (remHgt/2)-20;
      extraPad += ((remHgt - extraPad - 50) / 4);
      $('.game-board').css('padding-top', extraPad.toString()+"px");

      logoWdt = (1/4) * (winWdt);
      logoHgt = (remHgt/2)-20;
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

    $('.game-board').css('padding-top', "10px");
    logoWdt = (remWdt/2)-20;
    logoHgt = (winHgt*0.6);
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
  resizeText();
};

GT.UI.ScoreBoard.prototype.update = function(){
  var dom = GT.vars.board.dominance();
  score1 = GT.vars.Scoreboard[0][0]*10+GT.vars.Scoreboard[0][1];
  score2 = GT.vars.Scoreboard[1][0]*10+GT.vars.Scoreboard[1][1];
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
  if (GT.vars.turn === 1){
    $('.score1').css({opacity:"1.0"});
    $('.logo1').css({opacity:"1.0"});
    $('.score2').css({opacity:"0.6"});
    $('.logo2').css({opacity:"0.6"});
  } else {
    $('.score2').css({opacity:"1.0"});
    $('.logo2').css({opacity:"1.0"});
    $('.score1').css({opacity:"0.6"});
    $('.logo1').css({opacity:"0.6"});
  }
};
