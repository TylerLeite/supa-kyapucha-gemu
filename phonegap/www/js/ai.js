/**
 * The Big Bad GOTHELLO AI
 * Right now it sucks, but one day it will rule
 * TODO:
 *    Pattern matching to avoid holes like X...XX or XX.X.X
 *    Choose move based on some heuristic rather than randomly
 *        -Be more aggressive with edge placement
 *        -Be more safe with captures
 *    Remember moves as blocks, try to avoid touching a block to an enemy piece
 */

if (GT === null || typeof(GT) != "object") { var GT = new Object();}

/**
 * @constructor
 */
GT.AI = function(board) {
	this.gamestate = board;
	this.testbed = this.gamestate.deepCopy();
	this.history = [];
	//00, 01, 11, 10
	this.corners = [false, false, false, false];
};

/**
 * Runs a heuristic on this.testbed to evaluate the positition
 * @return {Number} The score for the position
 */
GT.AI.prototype.analyzePosition = function() {
	return;
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

GT.AI.prototype.dontNeedMove = function(x, y) {
	// Check if an edge move has high prioritah

	var width = this.gamestate.wdt() - 1;
	var height = this.gamestate.hgt() - 1;

	if (this.corners[0] && this.corners[1]){
		return x == 0;
	}

	if (this.corners[1] && this.corners[2]){
		return y == 0;
	}

	if (this.corners[2] && this.corners[3]){
		return x == width;
	}

	if (this.corners[3] && this.corners[0]){
		return y == height;
	}
};

GT.AI.prototype.filterUnneeded = function(moves) {
	var out = []
	for (var i = 0; i < moves.length; i++){
		var mv = moves[i];
		if (!this.dontNeedMove(mv[0], mv[1])){
			out.push(mv);
		}
	}

	return out;
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
};

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
};

GT.AI.prototype.checkBadEdge = function(x, y){
	//Bad edge is one that either creates a hole or
};

GT.AI.prototype.filterCaptures = function(moves) {
	return this.checkCaptures(moves, false);
};

GT.AI.prototype.filterSafes = function(moves) {
	return this.checkCaptures(moves, true);
};

GT.AI.prototype.makeMove = function() {
	var legalMoves = this.gamestate.getEmptySquares();
	var edges = this.filterEdges(legalMoves);
	var captures = this.filterCaptures(legalMoves);
	var safes = this.filterSafes(legalMoves);
	var edgeCaps = this.filterCaptures(edges);
	var edgeSafes = this.filterSafes(edges);
	var edgeNeeds = this.filterUnneeded(edgeSafes);
	var corners = [];

	if (edges.length > 0){
		corners = this.filterCorners(edges);
	}

	var rand; var out;
	if (corners.length > 0) {
		rand = Math.floor(Math.random() * corners.length);
		out = corners[rand].split("");
		var width = this.gamestate.wdt() - 1;
		var height = this.gamestate.hgt() - 1;
		if (out[0] == 0 && out[1] == height){
			this.corners[0] = true;
		} else if (out[0] == 0 && out[1] == 0){
			this.corners[1] = true;
		} else if (out[0] == width && out[1] == 0){
			this.corners[2] = true;
		} else if (out[0] == width && out[1] == height){
			this.corners[3] = true;
		}
	} else if (edges.length > 0){
		if (edgeCaps.length > 0){
			rand = Math.floor(Math.random() * edgeCaps.length);
			out = edgeCaps[rand].split("");
		} else if (edgeSafes.length > 0){
			if (edgeNeeds.length > 0){
				rand = Math.floor(Math.random() * edgeNeeds.length);
				out = edgeNeeds[rand].split("");
			} else {
				rand = Math.floor(Math.random() * edgeSafes.length);
				out = edgeSafes[rand].split("");
			}
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

	this.history.push(out);
	return out;
};

GT.AI.reset = function(){
	this.history = [];
	this.corners = [false, false, false, false];
};
