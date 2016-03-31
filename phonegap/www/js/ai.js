/**
 * The Big Bad GOTHELLO AI
 * Right now it sucks, but one day it will rule
 */

if (GT === null || typeof(GT) != "object") { var GT = new Object();}

GT.AI = function(board) {
	this.gamestate = board;
};

GT.AI.prototype.filterCorners = function(moves) {
	var corners = [];
	for (var i = 0; i < moves.length; i++){
		var mv = moves[i];
		if ((mv[0] == 0 || mv[0] == this.gamestate.wdt()-1) &&
					(mv[1] == 0 || mv[1] == this.gamestate.hgt()-1)){
			corners.push(mv);
		}
	}

	return corners;
};

GT.AI.prototype.filterEdges = function(moves) {
	var edges = [];
	for (var i = 0; i < moves.length; i++){
		var mv = moves[i];
		if (mv[0] == 0 || mv[0] == this.gamestate.wdt()-1 ||
					mv[1] == 0 || mv[1] == this.gamestate.hgt()-1){
			edges.push(mv);
		}
	}

	return edges;
};

GT.AI.prototype.makeMove = function() {
	var legalMoves = this.gamestate.getEmptySquares();
	var edges = this.filterEdges(legalMoves);
	var corners = [];
	if (edges.length > 0){
		corners = this.filterCorners(edges);
	}

	var rand; var out;
	if (corners.length > 0) {
		rand = Math.floor(Math.random() * corners.length);
		out = corners[rand].split("");
	} else if (edges.length > 0){
		rand = Math.floor(Math.random() * edges.length);
		out = edges[rand].split("");
	} else if (legalMoves.length > 0){
		rand = Math.floor(Math.random() * legalMoves.length);
		out = legalMoves[rand].split("");
	} else {
		out = ['-1', '-1'];
	}

	out[0] = parseInt(out[0]);
	out[1] = parseInt(out[1]);
	return out;
};
