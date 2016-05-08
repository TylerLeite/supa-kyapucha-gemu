if (GT === null || typeof(GT) != "object") { var GT = new Object(); }

GT.vars.turn = 1;
GT.vars.gamemode = "single";
GT.vars.board = new GT.Board(7,7);
GT.vars.board.tiles = GT.vars.board.tiles();
GT.vars.level = 0;
GT.vars.Scoreboard = [[0,0],[0,0]];
GT.vars.settings = new GT.Settings();
GT.vars.opponent = {};
GT.vars.player = {};
GT.vars.opponent.ai = new GT.AI(GT.vars.board);
GT.vars.player.save = {name:"", theme:"standard", chip:"standard", progress:0};
