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
GT.AI.prototype.hasEmpty = function(sx,sy,xdir,ydir){
	if (xdir === 0 && ydir === 0){
		return false;
	}
	sx = parseInt(sx);
	sy = parseInt(sy);

	var empty = 3;
	var nx = sx + xdir;
	var ny = sy + ydir;
	if (!GT.validTile(turn) || !this.gamestate.inBounds(nx, ny)){
		return 'x';
	} else if (this.gamestate.get(nx, ny) == empty){
		return nx.toString()+ny.toString();
	} else {
		return this.hasEmpty(nx,ny,xdir,ydir);
	}
};

GT.AI.prototype.besideOpp = function(sx, sy, xdir, ydir, turn) {
	// TODO

	if (xdir === 0 && ydir === 0){
		return false;
	}
	sx = parseInt(sx);
	sy = parseInt(sy);

	var empty = 3;
	var nx = sx + xdir;
	var ny = sy + ydir;
	if (!GT.validTile(turn) || !this.gamestate.inBounds(nx, ny)){
		return false;
	} else if (this.gamestate.get(nx, ny) == empty){
		return false;
	} else if (this.gamestate.get(nx, ny) == turn){
		if (this.besideOpp(nx, ny, xdir, ydir, turn)){
			return true;
		} else {
			return false;
		}
	} else {
		if (this.besideOpp(nx, ny, xdir, ydir, turn)){
			return false;
		} else {
			return true;
		}
	}
};

GT.AI.prototype.checkCaptures = function(moves, safe, turn) {
	var captures = [];
	var safes = [];
	for (var i = 0; i < moves.length; i++){
		var mv = moves[i];
		var found = false;
		for (var xdir = -1; xdir < 2; xdir++){
			for (var ydir = -1; ydir < 2; ydir++){
				var negx = xdir * -1;
				var negy = ydir * -1;
				var e = this.hasEmpty(mv[0], mv[1], negx, negy);
				//console.log(this.besideOpp(mv[0], mv[1], xdir, ydir, turn),this.hasEmpty(mv[0], mv[1], negx, negy), mv[0], mv[1], xdir, ydir, turn);
				if (this.besideOpp(mv[0], mv[1], xdir, ydir, turn) && e[0] != 'x'){
					captures.push(e);
					found = true;
				}
			}
		}
		if (found === false){
			safes.push(moves[i]);
		}
	}
	if (safe){
		return safes;
	}
	return captures;
};

GT.AI.prototype.checkBadEdge = function(x, y){
	//Bad edge is one that either creates a hole or
};

GT.AI.prototype.filterCaptures = function(moves,opp) {
	var oppSpaces = this.gamestate.getPlayerSquares(opp);
	var caps = this.checkCaptures(oppSpaces, false, opp);
	console.log(caps);
	var filteredCaps = []
	for (var i = 0; i < caps.length; i++){
		for (var j = 0; j < moves.length; j++){
			if (caps[i] == moves[j]){
				filteredCaps.push(caps[i]);
				break;
			}
		}
	}
	return filteredCaps;
};

GT.AI.prototype.filterSafes = function(moves) {
	return this.checkCaptures(moves, true, 2);
};
GT.AI.prototype.chooseSpace = function(moves){
	var rand; var out;
	rand = Math.floor(Math.random() * moves.length);
	out = moves[rand].split("");
	return out;
};
GT.AI.prototype.bestMove = function(moves){
	var counts = {};
	var best = [];
	var max = 0;
	console.log(moves);
	for (var i = 0; i < moves.length; i++){
		var a = moves[i];
		if(!counts[a]){
			counts[a] = 1;
		} else {
			counts[a]++;
		}
		if (counts[a]>max){
			best = [a];
			max = counts[a];
		} else if(counts[a] === max) {
			best.push(a);
		}
	}
	return best;
};
GT.AI.prototype.makeMove = function() {
	var legalMoves = this.gamestate.getEmptySquares();
	var edges = this.filterEdges(legalMoves);
	var captures = this.bestMove(this.filterCaptures(legalMoves,1));
	var safes = this.filterSafes(legalMoves);
	var edgeCaps = this.filterCaptures(edges,1);
	var edgeSafes = this.filterSafes(edges);
	var edgeNeeds = this.filterUnneeded(edgeSafes);
	var corners = [];
	console.log(captures);
	console.log(safes);
	if (edges.length > 0){
		corners = this.filterCorners(edges);
	}
	var priorities = [corners, captures, edgeNeeds, edgeSafes, edges, safes, legalMoves];

	var out = [];
	for (var a in priorities){
		if (priorities[a].length != 0){
			out = this.chooseSpace(priorities[a]);
			break;
		}
	}
	if (out.length === 0){
		out = ['-1','-1'];
	}

	if (corners.length > 0) {
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
