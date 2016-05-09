if (GT === null || typeof(GT) != "object") { var GT = new Object();}

/**
 * @constructor
 * @param {string} ai Name of the computer being played against
 * @param {player} player Player object representing the player
 */
GT.Game = function(ai, player) {
	this.player1 = GT.cpus[ai];
	this.player2 = player;
	this.board = new Board;
};
