if (GT === null || typeof(GT) != "object"){ var GT = new Object();}

GT.Player = function(name, piece) {
	this.name = name;
	this.piece = piece;
	this.rating = 1500;
};

GT.Settings = function() {
	this.players = [];

	this.singlePlayer = false;
	this.numPlayers = 0;

	var choices = ['2ne1', '4minute', 'aoa', 'apink', 'fx',
	               'girlsgeneration', 'kara', 'sonamoo', 'wondergirls'];
	var rand1 = Math.floor(Math.random() * choices.length);
	var rand2 = Math.floor(Math.random() * choices.length);

	while (rand1 === rand2) {
		rand2 = Math.floor(Math.random() * choices.length);
	}

	this.addPlayer('Human', choices[rand1]);
	this.addPlayer('CPU', choices[rand2]);
};

GT.Settings.prototype.addPlayer = function(name, tile) {
	this.numPlayers += 1;

	var piece = 'img/pieces/' + tile + '.png';
	var player = new GT.Player(name, piece);

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
