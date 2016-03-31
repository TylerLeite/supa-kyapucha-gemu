if (GT === null || typeof(GT) != "object"){ var GT = new Object();}

/**
 * Tile enumeration
 */
GT.Tile = {
	UNDEFINED : 0,
	EMPTY: 3,
	PLAYER1: 1,
	PLAYER2: 2
};

/**
 * Check whether a tile is a valid choice
 * @param {Tile} tile The tile to check
 * @return {boolean} Whether the tile is valid
 */
GT.validTile = function(tile) {
	for (var t in GT.Tile){
		if (GT.Tile[t] == tile){
			return true;
		}
	}

	return false;
};

/**
 * Check whether a tile is a valid choice
 * @param {Tile} tile The current turn
 * @return {Tile} Whose turn it must be by process of elimination
 */
GT.oppTurn = function(turn) {
	if (turn == GT.Tile.PLAYER1){
		return GT.Tile.PLAYER2;
	} else if (turn == GT.Tile.PLAYER2){
		return GT.Tile.PLAYER1;
	} else {
		return GT.Tile.UNDEFINED;
	}
};

/**
 * @constructor
 */
GT.Board = function(wdt, hgt) {
	this._width = wdt;
	this._height = hgt;

	this._tiles = new Array(hgt);
	for (var i = 0; i < hgt; i++){
		this._tiles[i] = new Array(wdt);
	}

	this.reset();
};

/**
 * Return the board's tiles
 * @return {Array<Array<Tile>>} The board's tiles
 */
GT.Board.prototype.tiles = function() {
	return this._tiles;
};

/**
 * Return the board's width
 * @return {int} The board's width
 */
GT.Board.prototype.wdt = function() {
	return this._width;
};

/**
 * Return the board's height
 * @return {int} The board's height
 */
GT.Board.prototype.hgt = function() {
	return this._height;
};

/**
 * Return the number of empty squares
 * @return {int} Number of empty squares
 */
GT.Board.prototype.emp = function() {
	return this.emptySquares;
};

/**
 * Return a list of all random squares
 * @return {array<String>} All empty squares in 'XY' format
 */
GT.Board.prototype.getEmptySquares = function() {
	var out = [];
	for (var j = 0; j < this._height; j++){
		for (var i = 0; i < this._width; i++){
			if (this._tiles[j][i] === GT.Tile.EMPTY){
				out.push(i.toString() + j.toString());
			}
		}
	}
	return out;
};

/**
 * Clear the board, setting all times to be empty
 */
GT.Board.prototype.reset = function() {
	for (var y = 0; y < this.hgt(); y++){
		for (var x = 0; x < this.wdt(); x++){
			this._tiles[y][x] = GT.Tile.EMPTY;
		}
	}

	this.emptySquares = this.hgt() * this.wdt();
};

/**
 * Return whether the (x, y) is a valid position on the board
 * @param {int} x X position to check
 * @param {int} y Y position to check
 * @return {boolean} Whether the position falls within the board's boundaries
 */
GT.Board.prototype.inBounds = function(x, y) {
	if (x >= this._width || x < 0){
		return false;
	} else if (y >= this._height || y < 0){
		return false;
	} else {
		return true;
	}
};

/**
 * Set the tile at (x, y)
 * @param {int} x X position of the tile to place
 * @param {int} y Y position of the tile to place
 * @param {Tile} tile Which tile to place on the board
 * @return {boolean} Whether the tile was successfully set
 */
GT.Board.prototype.set = function(x, y, tile) {
	if (!this.inBounds(x, y) || !GT.validTile(tile)){
		return false;
	} else {
		this._tiles[y][x] = tile;
		return true;
	}
};

/**
 * Get a tile from the position (x, y) on the board
 * @param {int} x The x-position of the tile to retrieve
 * @param {int} y The y-position of the tile to retrieve
 * @return {Tile} The tile at (x, y)
 */
GT.Board.prototype.get = function(x, y) {
	if (!this.inBounds(x, y)){
		return GT.Tile.UNDEFINED;
	} else {
		return this._tiles[y][x];
	}
};

/**
 * Find the most dominant tile
 * @return {Tile} Which player's tiles appear the most on the board or EMPTY if
 *     it's a tie
 */
GT.Board.prototype.dominance = function() {
	// Find counts of each player's tile
	var cts = [0, 0];
	for (var y = 0; y < this._height; y++){
		for (var x = 0; x < this._width; x++){
			if (this._tiles[y][x] == GT.Tile.PLAYER1){
				cts[0] += 1;
			} else if (this._tiles[y][x] == GT.Tile.PLAYER2){
				cts[1] += 1;
			}
		}
	}

	// See which is bigger
	if (cts[0] > cts[1]){
		return [GT.Tile.PLAYER1, cts[0], cts[1]];
	} else if (cts[1] > cts[0]){
		return [GT.Tile.PLAYER2, cts[0], cts[1]];
	} else {
		return [GT.Tile.EMPTY, cts[0], cts[1]];
	}
};

/**
 * Checks if a move will cause a capture in a given direction, perform any captures
 *     that occur
 * @param {int} sx X-position to start at
 * @param {int} sy y-position to start at
 * @param {int} xdir X-component of the direction to check
 * @param {int} ydir Y-component of the direction to check
 * @param {Tile} turn Whose turn it is
 * @return {boolean} Whether a capture in the give direction is caused by the move
 */
GT.Board.prototype.checkReversi = function(sx, sy, xdir, ydir, turn) {
	var nx = sx + xdir;
	var ny = sy + ydir;

	if (!GT.validTile(turn) || !this.inBounds(nx, ny)){
		return false;
	} else if (this.get(nx, ny) == GT.Tile.EMPTY){
		return false;
	} else if (this.get(nx, ny) == turn){
		this.set(sx, sy, turn); // Comment this out if just checking
		return true;
	} else if (this.get(nx, ny) == GT.oppTurn(turn)){
		if (this.checkReversi(nx, ny, xdir, ydir, turn)){
			this.set(sx, sy, turn) // Comment this out if just checking
			return true;
		} else {
			return false;
		}
	}
};

/**
 * Attempt to place a piece on the given tile
 * @param {int} x The x-position to try to place the tile at
 * @param {int} y The y-position to try to place the tile at
 * @param {Tile} turn Whose turn it is
 * @return {boolean} Whether the tile was successfully placed
 */
GT.Board.prototype.place = function(x, y, turn) {
	if (!GT.validTile(turn)){
		return false;
	} else if (!this.inBounds(x, y) ||  this.get(x, y) != GT.Tile.EMPTY){
		return false;
	}

	this.set(x, y, turn);
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
