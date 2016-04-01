if (GT === null || typeof(GT) != "object"){ var GT = new Object();}

GT.Player = function(name, piece) {
	this.name = name;
	this.piece = piece;
};

GT.Settings = function() {
	this.players = [];

	this.singlePlayer = false;
	this.numPlayers = 0;

	this.addPlayer('Human', '4minute');
	this.addPlayer('CPU', 'girlsgeneration');
};

GT.Settings.prototype.addPlayer = function(name, tile) {
	this.numPlayers += 1;
<<<<<<< HEAD
	piece = 'img/pieces/' + tile + '.png';
	player = new GT.Player(name, piece);
=======
	var piece = '..img/pieces/' + tile + '.png';
	var player = new GT.Player(name, piece);
>>>>>>> 88b432d081e9e1cab4ae2121df92ef38339cb34d
	this.players.push(player);
};

GT.Settings.prototype.changePiece = function(player, tile) {
	if (player > numPlayers || player <= 0){
		return;
	} else {
		this.players[player-1].tile = tile;
	}
};

GT.Settings.prototype.changeName = function(player, name) {
	if (player > numPlayers || player <= 0){
		return;
	} else {
		this.players[player-1].name = name;
	}
};

GT.Settings.prototype.setSinglePlayer = function() {
	this.singlePlayer = true;
};

GT.Settings.prototype.setMultiPlayer = function() {
	this.singlePlayer = false;
};
GT.Settings.prototype.getPiece = function(player) {
	return this.players[player].piece;
};
GT.Settings.prototype.getName = function(player) {
	return this.players[player].name;
};
