if (GT === null || typeof(GT) != 'object'){ var GT = new Object();}

/**
 * @constructor
 * @param {GT.Tile.type} type What kind of tile is being made
 * @param {boolean} supa Whether the tile is a SUPA tile (can't be captured)
 */
GT.Tile = function (type, supa) {
	this.type = type;
	if (!GT.Tile.valid(type)){
		this.type = 0;
	}

	this.isSupa = supa;
	this.visible = true;
}

/**
 * Tile enumeration
 */
GT.Tile.types = {
	UNDEFINED: 0,
	PLAYER1: 1,
	PLAYER2: 2,
	EMPTY: 3,
	CRITTER: 4
};

/**
 * Check whether a tile is a valid choice
 * @param {GT.Tile.type} tile The tile to check
 * @return {boolean} Whether the tile is valid
 */
GT.Tile.valid = function(tile) {
	for (var t in GT.Tile.type){
		if (GT.Tile.types[t] == tile){
			return true;
		}
	}

	return false;
};

/**
 * @constructor
 * @param {int} width The width of the board
 */
GT.Board = function(width, height) {
	this.width = width;
	this.height = height;

	this.tiles = new Array(height);
	for (var i = 0; i < height; i++){
		this.tiles[i] = new Array(width);
	}

	this.kyapuchas = [];
	this.reset();
};

/**
 * Check whether a tile is a valid choice
 * @param {GT.Tile.type} turn The current turn
 * @return {GT.Tile.type} Whose turn it must be by process of elimination
 */
GT.Board.oppTurn = function(turn) {
	if (turn == GT.Tile.types.PLAYER1){
		return GT.Tile.types.PLAYER2;
	} else if (turn == GT.Tile.types.PLAYER2){
		return GT.Tile.types.PLAYER1;
	} else {
		return GT.Tile.types.UNDEFINED;
	}
};

/**
 * Create a copy of this object that can be edited without modifying the original
 * @param {GT.Board} that The board to copy
 * @return {GT.Board} A copy of this object
 */
GT.Board.deepCopy = function(that) {
	var out = new GT.Board(that.width, that.height);
	for (var i = 0; i < that.height; i++){
		for (var j = 0; j < that.width; j++){
			out.set(that.get(i, j));
		}
	}

	return out;
};

/**
 * Clear the board, setting all times to be empty
 */
GT.Board.prototype.reset = function() {
	for (var y = 0; y < this.height(); y++){
		for (var x = 0; x < this.width(); x++){
			this.tiles[y][x] = GT.Tile.type.EMPTY;
		}
	}

	this.emptySquares = this.height() * this.width();
};

/**
 * Return whether the (x, y) is a valid position on the board
 * @param {int} x X position to check
 * @param {int} y Y position to check
 * @return {boolean} Whether the position falls within the board's boundaries
 */
GT.Board.prototype.inBounds = function(x, y) {
	if (x >= this.width || x < 0){
		return false;
	} else if (y >= this.height || y < 0){
		return false;
	} else {
		return true;
	}
};

/**
 * Return a list of all empty squares
 * @return {String[]} All empty squares in 'XY' format
 */
GT.Board.prototype.getEmptySquares = function() {
	var out = [];
	for (var j = 0; j < this.height; j++){
		for (var i = 0; i < this.width; i++){
			if (this.tiles[j][i] === GT.Tile.type.EMPTY){
				out.push(i.toString() + j.toString());
			}
		}
	}
	return out;
};

/**
 * Return a list of all squares taken by a specific player
 * @param {GT.Tile.type} turn Which player to find the tiles of
 * @return {String[]} All empty squares in 'XY' format
 */
GT.Board.prototype.getPlayerSquares = function(turn){
	var pSpaces = [];
	for (var i = 0; i < this.height(); i++){
		for (var j = 0; j < this.width(); j++){
			if (this.get(i,j) == turn){
				pSpaces.push(i.toString() + j.toString());
			}
		}
	}
	return pSpaces;
};

/**
 * Set the tile at (x, y)
 * @param {int} x X position of the tile to place
 * @param {int} y Y position of the tile to place
 * @param {GT.Tile} tile Which tile to place on the board
 * @return {boolean} Whether the tile was successfully set
 */
GT.Board.prototype.set = function(x, y, tile) {
	if (!this.inBounds(x, y) || !GT.validTile(tile)){
		return false;
	} else {
		var cur = this.get(x, y);
		if (!cur.supa) {
			this.tiles[y][x] = tile;
			return true;
		}

		return false;
	}
};

/**
 * Get a tile from the position (x, y) on the board
 * @param {int} x The x-position of the tile to retrieve
 * @param {int} y The y-position of the tile to retrieve
 * @return {GT.Tile} The tile at (x, y)
 */
GT.Board.prototype.get = function(x, y) {
	if (!this.inBounds(x, y)){
		return new GT.Tile(GT.Tile.type.UNDEFINED, true);
	} else {
		return this.tiles[y][x];
	}
};

/**
 * Find the most dominant tile
 * @return {[GT.Tile.type, int, int]} Which player's tiles appear the most on the
 *     board or EMPTY if it's a tie, numbers of each type of tile
 */
GT.Board.prototype.dominance = function() {
	// Find counts of each player's tile
	var cts = [0, 0];
	for (var y = 0; y < this.height; y++){
		for (var x = 0; x < this.width; x++){
			if (this.tiles[y][x] == GT.Tile.type.PLAYER1){
				cts[0] += 1;
			} else if (this.tiles[y][x] == GT.Tile.type.PLAYER2){
				cts[1] += 1;
			}
		}
	}

	// See which is bigger
	if (cts[0] > cts[1]){
		return [GT.Tile.type.PLAYER1, cts[0], cts[1]];
	} else if (cts[1] > cts[0]){
		return [GT.Tile.type.PLAYER2, cts[0], cts[1]];
	} else {
		return [GT.Tile.type.EMPTY, cts[0], cts[1]];
	}
};

/**
 * Checks if a move will cause a capture in a given direction, perform any captures
 *     that occur
 * @param {int} sx X-position to start at
 * @param {int} sy y-position to start at
 * @param {int} xdir X-component of the direction to check
 * @param {int} ydir Y-component of the direction to check
 * @param {GT.Tile.type} turn Whose turn it is
 * @return {boolean} Whether a capture in the give direction is caused by the move
 */
GT.Board.prototype.realCheckReversi = function(sx, sy, xdir, ydir, turn) {
	var nx = sx + xdir;
	var ny = sy + ydir;

	var tile = new GT.Tile(turn, false);

	if (!GT.validTile(turn) || !this.inBounds(nx, ny)){
		return false;
	} else if (this.get(nx, ny) == GT.Tile.type.EMPTY){
		return false;
	} else if (this.get(nx, ny) == turn){
		if (this.get(sx, sy) != turn){
			this.set(sx, sy, turn) // Comment this out if just checking
			this.kyapuchas.push([sx, sy]);
		}
		return true;
	} else if (this.get(nx, ny) == GT.oppTurn(turn)){
		if (this.realCheckReversi(nx, ny, xdir, ydir, turn)){
			if (this.get(sx, sy) != turn){
				this.set(sx, sy, turn) // Comment this out if just checking
				this.kyapuchas.push([sx, sy]);
			}
			return true;
		} else {
			return false;
		}
	}
};

GT.Board.prototype.checkReversi = function(sx, sy, xdir, ydir, turn){
	this.kyapuchas = [];
	var out = this.realCheckReversi(sx, sy, xdir, ydir, turn);

	/*
	if (this.kyapuchas.length >= 5){
		var newTile;
		if (turn == GT.Tile.type.PLAYER1){
			newTile = GT.Tile.type.PLAYER1SUPER;
		} else if (turn == GT.Tile.type.PLAYER2) {
			newTile = GT.Tile.type.PLAYER2SUPER;
		}

		for (var i = 0; i < this.kyapuchas.length; i++){
			this.set(this.kyapuchas[i][0], this.kyapuchas[i][1], newTile);
		}
	}
	*/

	return out;
};

/**
 * Check whether a specified move is legal
 * @param {int} x The x-position to check for legality
 * @param {int} y The y-position to check for legality
 * @param {GT.Tile.type} turn Whose turn it is
 * @return {boolean} Whether the specified move is legal
 */
GT.Board.prototype.checkLegal = function(x, y, turn=-1) {
	if (!this.inBounds(x, y)){
		return false;
	} else {
		for (var i = 0; i < this.legalityRules.length; i++) {
			if (!this.legalityRules[i](x, y, turn)){
				return false;
			}
		}
	}

	return true;
};

/**
 * Attempt to place a piece on the given tile
 * @param {int} x The x-position to try to place the tile at
 * @param {int} y The y-position to try to place the tile at
 * @param {GT.Tile.type} turn Whose turn it is
 * @return {boolean} Whether the tile was successfully placed
 */
GT.Board.prototype.place = function(x, y, turn) {
	if (!GT.validTile(turn)){
		return false;
	} else if (!this.inBounds(x, y) ||  this.get(x, y) != GT.Tile.type.EMPTY){
		return false;
	}

	var tile = new GT.Tile(turn, false);

	this.set(x, y, tile);
	this.emptySquares -= 1;

	for (var j = -1; j < 2; j++){
		for (var i = -1; i < 2; i++){
			var nx = x+i;
			var ny = y+j;

			if (this.inBounds(x, y) && this.get(nx, ny) == GT.oppTurn(turn)){
				this.checkReversi(x, y, i, j, turn);
			}
		}
	}

	return true;
};
