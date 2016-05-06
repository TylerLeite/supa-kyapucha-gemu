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
GT.AI.prototype.oddGaps = function(moves){
	var empty = 3;
	var oddMoves = [];
	for (var m = 0; m < moves.length; m++){
		x = parseInt(moves[m][0]);
		y = parseInt(moves[m][1]);
		for (var i = 0; i < Math.max(this.gamestate.wdt(), this.gamestate.hgt()); i++){
			if (!this.gamestate.inBounds(x+1, y) || !this.gamestate.inBounds(x-1, y)){
				if (this.gamestate.get(x,y+i) != empty && this.gamestate.get(x,y-i) != empty){
					oddMoves.push(moves[m]);
					break;
				} else if (this.gamestate.get(x,y+i) != empty || this.gamestate.get(x,y-i) != empty){
					break;
				}
			} else {
				if (this.gamestate.get(x+i,y) != empty && this.gamestate.get(x-i,y) != empty){
					oddMoves.push(moves[m]);
					break;
				} else if (this.gamestate.get(x+i,y) != empty || this.gamestate.get(x-i,y) != empty){
					break;
				}
			}
		}
	}
	return oddMoves;
};
GT.AI.prototype.closerTo = function(moves,turn, oppTurn){
	var empty = 3;
	closerMoves = [];
	for (var m = 0; m < moves.length; m++){
		x = parseInt(moves[m][0]);
		y = parseInt(moves[m][1]);
		var closer = false;
		var dist = 0;
		for (var i = 0; i < this.gamestate.wdt(); i++){
			if (this.gamestate.get(x+i,y) == oppTurn || this.gamestate.get(x-i,y) == oppTurn){
				closer = false;
				dist = i;
				break;
			} else if (this.gamestate.get(x+i,y) == turn || this.gamestate.get(x-i,y)== turn){
				closer = true;
				dist = i;
				break;
			}
		}
		for (var j = 0; j < this.gamestate.hgt(); j++){
			if (this.gamestate.get(x,y+j) == oppTurn || this.gamestate.get(x,y-j) == oppTurn){
				if (j < dist){
					closer = false;
				}
				break;
			} else if (this.gamestate.get(x,y+j) == turn || this.gamestate.get(x,y-j)== turn){
				if (j < dist){
					closer = true;
				}
				break;
			}
		}
		if (closer === true){
			closerMoves.push(moves[m]);
		}
	}
	return closerMoves;
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
		//return 'x';
		return false;
	} else if (this.gamestate.get(nx, ny) == empty){
		return nx.toString()+ny.toString();
	} else {
		return this.hasEmpty(nx,ny,xdir,ydir);
	}
};

//GT.AI.prototype.besideOpp = function(sx, sy, xdir, ydir, turn) {
GT.AI.prototype.besideOpp = function(sx, sy, xdir, ydir, turn, det) {
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
		if (det){
			return true;
		}
		return false;
	} else if (this.gamestate.get(nx, ny) == empty){
		return false;
	} else if (this.gamestate.get(nx, ny) == turn){
		if (this.besideOpp(nx, ny, xdir, ydir, turn)){
		//if (det){
			return true;
		}
/*
	} else {
		if (this.besideOpp(nx, ny, xdir, ydir, turn)){
			return false;
		} else {
			return true;
		}
//*/
		return false;
	} else if (this.gamestate.get(nx, ny) == turn){
		return this.besideOpp(nx, ny, xdir, ydir, turn, false);
	} else {
		return this.besideOpp(nx, ny, xdir, ydir, turn, true);
	}
};

GT.AI.prototype.checkCaptures = function(moves, safe, turn) {
	var captures = [];
	var safes = [];
	for (var i = 0; i < moves.length; i++){
		var mv = moves[i];
		var found = false;
		for (var xdir = -1; xdir < 2; xdir++){
			var negx = xdir * -1;
			for (var ydir = -1; ydir < 2; ydir++){
/**
				var negx = xdir * -1;
				var negy = ydir * -1;
				var e = this.hasEmpty(mv[0], mv[1], negx, negy);
				//console.log(this.besideOpp(mv[0], mv[1], xdir, ydir, turn),this.hasEmpty(mv[0], mv[1], negx, negy), mv[0], mv[1], xdir, ydir, turn);
				if (this.besideOpp(mv[0], mv[1], xdir, ydir, turn) && e[0] != 'x'){
//*/
				var negy = ydir * -1;
				var e = this.hasEmpty(mv[0], mv[1], negx, negy);
				/*if(mv[0] == '0' && mv[1] == '2'){
					if (e != 'x'){console.log(mv[0],mv[1],xdir,ydir,e, this.besideOpp(mv[0], mv[1], xdir, ydir, turn, false))}
				}*/
				if (this.besideOpp(mv[0], mv[1], xdir, ydir, turn, false) && e != false){
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

GT.AI.prototype.filterDefenses = function(moves, me){
	var empty = 3;
	var mySpaces = this.gamestate.getPlayerSquares(me);
	var caps = this.checkCaptures(mySpaces, false, me);
	var defenses = [];
	var best = 0;
	for (var i = 0; i < caps.length; i++){
		this.gamestate.set(parseInt(caps[i][0]),parseInt(caps[i][1]),me);
		var newcaps = this.checkCaptures(mySpaces, false, me);
		if ((caps.length - newcaps.length) > best){
			defenses.push(caps[i]);
		}
		this.gamestate.set(parseInt(caps[i][0]),parseInt(caps[i][1]),empty);
	}
	return defenses;
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
	//console.log(moves);
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
	//var edgeCaps = this.filterCaptures(edges,1);

	var edgeCaps = this.bestMove(this.filterCaptures(edges,1));

	var edgeSafes = this.filterSafes(edges);
	var edgeClose = this.closerTo(edgeSafes, 2, 1);
	var edgeNeeds = this.filterUnneeded(edgeSafes);
	var defenses = this.filterDefenses(legalMoves,2);
	var oddGaps = this.oddGaps(edgeSafes);
	var corners = [];
/**
	console.log(captures);
	console.log(safes);
	if (edges.length > 0){
		corners = this.filterCorners(edges);
	}
	var priorities = [corners, captures, edgeNeeds, edgeSafes, edges, safes, legalMoves];
//*/
	console.log(oddGaps);
	console.log(edgeSafes);
	console.log(edgeClose);
	if (edges.length > 0){
		corners = this.filterCorners(edges);
	}
	var priorities = [corners, defenses, edgeCaps, edgeClose, oddGaps, edgeNeeds, captures, edgeSafes, safes, legalMoves];
//*/

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
