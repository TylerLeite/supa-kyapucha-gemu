/**
 * The Big Bad GOTHELLO AI
 * Right now it sucks, but one day it will rule
 */

 if (GT === null || typeof(GT) != "object") { var GT = new Object();}

GT.AI = function(board) {
	this.gamestate = board;
};

GT.AI.prototype.makeMove = function() {
	var legalMoves = this.gamestate.getEmptySquares();
	var rand = Math.floor(Math.random() * legalMoves.length);
	var out = legalMoves[rand].split("");
	out[0] = parseInt(out[0]);
	out[1] = parseInt(out[1]);
	return out;
};
