if (GT === null || typeof(GT) != "object"){ var GT = new Object();}

GT.Player = function(name, piece) {
	this.name = name;
	this.piece = piece;
}

GT.Settings = function() {
	this.players = [];

	this.singlePlayer = false;
	this.numPlayers = 0;

	this.addPlayer('Human', '4minute');
	this.addPlayer('CPU', 'kara');
}

GT.Settings.prototype.addPlayer = function(name, tile) {
	this.numPlayers += 1;
	piece = 'img/pieces/' + tile + '.png';
	player = new Player(name, piece);
	this.players.push(player);
}

GT.Settings.prototype.changePiece(player, tile) {
	if (player > numPlayers || player <= 0){
		return;
	} else {
		this.players[player-1].tile = tile;
	}
}

GT.Settings.prototype.changeName(player, name) {
	if (player > numPlayers || player <= 0){
		return;
	} else {
		this.players[player-1].name = name;
	}
}

GT.Settings.prototype.setSinglePlayer = function() {
	this.singlePlayer = true;
}

GT.Settings.prototype.setMultiPlayer = function() {
	this.singlePlayer = false;
}
