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

GT.AI.prototype.willCapture = function(sx, sy, xdir, ydir, safe, first) {
	// TODO
	var empty = 0;
	var oppTurn = 1;
	var turn = 2;

	sx = parseInt(sx);
	sy = parseInt(sy);

	var nx = sx + xdir;
	var ny = sy + ydir;

	if (!GT.validTile(turn) || !this.gamestate.inBounds(nx, ny)){
		return false;
	} else if (this.gamestate.get(nx, ny) == empty){
		return false;
	} else if (this.gamestate.get(nx, ny) == turn && (!first || safe)){
		return true;
	} else if (this.gamestate.get(nx, ny) == oppTurn){
		if (this.willCapture(nx, ny, xdir, ydir, safe, false)){
			return true;
		} else {
			return false;
		}
	}
}

GT.AI.prototype.checkCaptures = function(moves, safe) {
	var captures = [];

	for (var i = 0; i < moves.length; i++){
		var mv = moves[i]

		for (var xdir = -1; xdir < 2; xdir++){
			for (var ydir = -1; ydir < 2; ydir++){
				if (this.willCapture(mv[0], mv[1], xdir, ydir, safe, true)){
					captures.push(moves[i]);
					break;
				}
			}
		}
	}

	return captures;
}

GT.AI.prototype.filterCaptures = function(moves) {
	return this.checkCaptures(moves, false);
}

GT.AI.prototype.filterSafes = function(moves) {
	return this.checkCaptures(moves, true);
}

GT.AI.prototype.makeMove = function() {
	var legalMoves = this.gamestate.getEmptySquares();
	var edges = this.filterEdges(legalMoves);
	var captures = this.filterCaptures(legalMoves);
	var safes = this.filterSafes(legalMoves);
	var edgeCaps = this.filterCaptures(edges);
	var edgeSafes = this.filterSafes(edges);
	var corners = [];
	if (edges.length > 0){
		corners = this.filterCorners(edges);
	}

	var rand; var out;
	if (corners.length > 0) {
		rand = Math.floor(Math.random() * corners.length);
		out = corners[rand].split("");
	} else if (edges.length > 0){
		if (edgeCaps.length > 0){
			rand = Math.floor(Math.random() * edgeCaps.length);
			out = edgeCaps[rand].split("");
		} else if (edgeSafes.length > 0){
			rand = Math.floor(Math.random() * edgeSafes.length);
			out = edgeSafes[rand].split("");
		} else {
			rand = Math.floor(Math.random() * edges.length);
			out = edges[rand].split("");
		}
	} else if (captures.length > 0){
		rand = rand = Math.floor(Math.random() * captures.length);
		out = captures[rand].split("");
	} else if (safes.length > 0){
		rand = Math.floor(Math.random() * safes.length);
		out = safes[rand].split("");
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
