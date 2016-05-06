if (GT === null || typeof(GT) != "object") { var GT = new Object(); }

GT.UI.vars = function(){
  var turn = 1;
  var gamemode = "single";
  var board = new GT.Board(7,7);
  var level = 0;
  var Scoreboard = [[0,0],[0,0]];
  var settings = new GT.Settings();
  var save = {name:"", theme:"standard", chip:"standard", progress:0};
};

GT.UI.vars.opponent = function(){
  var ai = new GT.AI(this.board);
};

GT.UI.vars.player = function(){
  var save = {name:"", theme:"standard", chip:"standard", progress:0};
};
