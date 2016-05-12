if (GT === null || typeof(GT) != 'object'){ var GT = new Object();}

/**
 * @constructor
 * @param {GT.Tile.type} type What kind of tile is being made
 * @param {boolean} supa Whether the tile is a SUPA tile (can't be captured)
 */
GT.Tile = function(type, supa) {
	this.type = type;
	if (!GT.Tile.valid(type)){
		this.type = 0;
	}

	this.isSupa = supa;
	this.visible = true;
};

/**
 * All possible types of tile
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
  * @param {int} height The height of the board
 */
GT.Board = function(width, height) {
	this.width = width;
	this.height = height;

	this.tiles = new Array(height);
	for (var i = 0; i < height; i++){
		this.tiles[i] = new Array(width);
	}

	this.legalityRules = [this.outOfBounds, this.tileOccupied];
	this.actionsBetweenMoves = [this.changeTurn];
	this.winConditions = [];

	this.kyapuchas = [];
	this.reset();
};

/// Member functions ///

/**
 * Create a copy of a Board that can be edited without modifying the original
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
 * Check whether a tile is a valid choice
 * @return {GT.Tile.type} Whose this.turn it must be by process of elimination
 */
GT.Board.prototype.oppTurn = function() {
	if (this.turn == GT.Tile.types.PLAYER1){
		return GT.Tile.types.PLAYER2;
	} else if (this.turn == GT.Tile.types.PLAYER2){
		return GT.Tile.types.PLAYER1;
	} else {
		return GT.Tile.types.UNDEFINED;
	}
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
 * @return {String[]} All empty squares in 'XY' format
 */
GT.Board.prototype.getPlayerSquares = function() {
	var pSpaces = [];
	for (var i = 0; i < this.height(); i++){
		for (var j = 0; j < this.width(); j++){
			if (this.get(i,j) == this.turn){
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
		if (!cur.supa){
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
		return new GT.Tile(GT.Tile.types.UNDEFINED, true);
	} else {
		if (this.tiles[y][x]){
			return this.tiles[y][x];
		} else {
			return new GT.Tile(GT.Tile.types.EMPTY, false);
		}
	}
};

/**
 * Find the most dominant tile
 * @return {[GT.Tile.type, int, int]} Which player's tiles appear the most on
 *     the board, or EMPTY if it's a tie, numbers of each type of tile
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

/// LEGALITY RULES ///
///  Things that can't happen. If any returns true, the move is illegal

/**
 * Return whether (x, y) is a valid position on the board
 * @param {int} x X position to check
 * @param {int} y Y position to check
 * @return {boolean} Whether the position falls within the board's boundaries
 */
GT.Board.prototype.outOfBounds = function(x, y) {
	if (x >= this.width || x < 0){
		return true;
	} else if (y >= this.height || y < 0){
		return true;
	} else {
		return false;
	}
};

/**
 * Return whether the the square at (x, y) is taken up
 * @param {int} x X position to check
 * @param {int} y Y position to check
 * @return {boolean} Whether the square is occupied
 */
GT.Board.prototype.tileOccupied = function(x, y) {
	if (this.get(x, y).type == GT.Tile.types.EMPTY){
		return false;
	} else {
		return true;
	}
};

/**
 * Return whether the the square at (x, y) is taken up by someone other than the
 *  current player
 * @param {int} x X position to check
 * @param {int} y Y position to check
 * @return {boolean} Whether the square is occupied
 */
GT.Board.prototype.tileOccupiedByOpponent = function(x, y) {
	var type = this.get(x, y).type;
	if (type == this.turn || type == GT.Tile.types.EMPTY){
		return false;
	} else {
		return true;
	}
};

/**
 * Return whether the the square at (x, y) is possible to capture
 * @param {int} x X position to check
 * @param {int} y Y position to check
 * @return {boolean} Whether the tile is possible to capture
 */
GT.Board.prototype.tileIndestructible = function(x, y) {
	return this.get(x, y).isSupa;
};

/// WIN CONDITIONS ///

//TODO//TODO//TODO//TODO//TODO//TODO//TODO//TODO//TODO//TODO//TODO//TODO//TODO//

// ACTIONS BETWEEN MOVES ///
/**
 * Changes the current turn
 */
GT.Board.prototype.changeTurn = function() {
	this.turn = this.oppTurn();
};

/// GAME LOGIC ///

GT.Board.prototype.runGame = function() {

};

/**
 * Makes a move in the game. The following steps are involved:
 *  Fetch move from player
 *  Check if that move is legal
 *  Place the piece
 *  Check for captures
 *  Perform captures
 *  Check for win conditions
 *  Perform any in-between-move actions
 *  Check for win conditions again
 * @return {boolean} Whether the current game is over
 */
GT.Board.prototype.makeMove = function() {
	var move = [];
	var legalMove = true;
	while (!legalMove){
		move = prompt();
		legalMove = this.checkLegal(move[0], move[1]);
	}

	this.placePiece(move[0], move[1]);

	if (this.checkWincons()){
		//TODO SOMEONE JUST WON
	} else {
		if (this.finishedWithMove()){
			this.betweenMoves();
		}

		if (this.checkWincons()){
			//TODO SOMEONE JUST WON
		} else {
			return true;
		}
	}
};

/*
 * Prompt the current player for a move (poll AI or prompt human)
 */
GT.Board.prototype.prompt = function(x, y) {
	return [x, y];
};

/*
 * Checks whether a given move would be legal
 * @param {int} x The x coordinate of the location to check
 * @param {int} y The y coordinate of the location to check
 * @return {boolean} Whether the move passes all legality rules
 */
GT.Board.prototype.checkLegal = function(x, y) {
	for (var i = 0; i < this.legalityRules.length; i++) {
		if (this.legalityRules[i](x, y)){
			return false;
		}
	}

	return true;
};

/*
 * Attempt to place a piece at the location (x, y)
 * @param {int} x The x coordinate of the location at which to place the piece
 * @param {int} y The y coordinate of the location at which to place the piece
 * @return {boolean} Whether the move was legal
 */
GT.Board.prototype.placePiece = function(x, y) {
	var tile = new GT.Tile(this.turn, false);
	this.set(x, y, tile);

	//check captures
	this.checkCaptures(x, y);

	//do captures
	this.doCaptures();

	return true;
};

/*
 * Check to see if someone has won yet
 * @return {boolean} True if all wincons are met, else false
 */
GT.Board.prototype.checkWincons() {
	//This is going to change
	return this.emptySquares == 0;
};


/*
 * Check for captures in a single direction
 * @param {int} sx The x position at which to start
 * @param {int} sy The y position at which to start
 * @param {int} xdir The x component of the direction to check
 * @param {int} ydir The y component of the direction to check
 * @return {boolean} true if there was a capture in that direction, else false
 */
GT.Board.prototype.checkOneDirection(sx, sy, xdir, ydir) {
	var nx = sx + xdir;
	var ny = sy + ydir;


	if (!this.inBounds(nx, ny)){
		return false;
	} else if (this.get(nx, ny).type == GT.Tile.types.EMPTY){
		return false;
	} else if (this.get(nx, ny).type == this.turn){
		if (this.get(sx, sy) != this.turn){
			this.kyapuchas.push([sx, sy]);
		}
		return true;
	} else if (this.get(nx, ny).turn == this.oppTurn()){
		if (this.checkOneDirection(nx, ny, xdir, ydir)){{
			this.kyapuchas.push([sx, sy]);
		}
		return true;
	} else {
		return false;
	}
};

/*
 * Check to see if placing a piece at (x, y) would cause any captures
 * @param {int} x The x position where the piece was placed
 * @param {int} y The y position where the piece was placed
 * @modifies this.kyapuchas
 * @effects fills this.kyapuchas with the pieces that got captured
 * @return {boolean} true if captures occurred, else false
 */
GT.Board.prototype.checkCaptures(x, y) {
	this.kyapuchas = [];
	var out = false;

	for (var i = -1; i < 2; i++){
		for (var j = 0; j < 2; j++){
			var nx = x+i;
			var ny = y+i;
			if (this.inBounds(nx, ny) && this.get(nx, ny).type == this.oppTurn()){
				out = out || this.checkOneDirection(x, y, i, j);
			}
		}
	}

	return out;
};


/*
 * Perform any captures that occurred do to the last move
 */
GT.Board.prototype.doCaptures() {
	for (var i = 0; i < this.kyapuchas.length(); i++){
		var cur = this.kyapuchas[i];
		var tile = new GT.Tile(this.turn, false);
		this.set(cur[0], cur[1], tile);
	}
};

/*
 * Perform any actions that must occur between moves
 */
GT.Board.prototype.betweenMoves() {
	for (var i = 0; i < this.actionsBetweenMoves; i++){
		this.actionsBetweenMoves[i]();
	}
};
