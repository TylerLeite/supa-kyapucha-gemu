if (GT === null || typeof(GT) != "object"){ var GT = new Object();}

GT.Player = function(name, piece, theme) {
	this.name = name;
	this.piece = piece;
	this.theme = theme;
	this.rating = 1500;
};

GT.Settings = function() {
	this.players = [];

	this.singlePlayer = false;
	this.numPlayers = 0;

	var filens = this.getTwoDistinctRandomLogos();

	this.addPlayer('Human', filens[0], 'standard');
	this.addPlayer('CPU', filens[1], 'standard');
};

GT.Settings.prototype.getTwoDistinctRandomLogos = function() {
	/*
	var choices = ['1cm', '2am', '2ne1', '2pm', '4minute', 'akdongmusician',
				   'aoa', 'apink', 'b1a4', 'bap', 'bigbang', 'blockb', 'bts',
				   'crayonpop', 'dalshabet', 'exo', 'fiestar', 'fx', 'girlsday',
				   'girlsgeneration', 'gna', 'got7', 'hellovenus', 'hyuna',
				   'infinite', 'iu', 'juniel', 'kara', 'mamamoo', 'mblaq', 'missa',
				   'ninemuses', 'nsyoong', 'nuest', 'orangecaramel', 'redvelvet',
				   'shinee', 'sistar', 'sonamoo', 'spica', 'superjunior', 't-ara',
				   'ukiss', 'vixx', 'winner', 'wondergirls'];
    //*/

	var choices = ['white', 'black'];

	var rand1 = Math.floor(Math.random() * choices.length);
	var rand2 = Math.floor(Math.random() * choices.length);

	while (rand1 === rand2) {
		rand2 = Math.floor(Math.random() * choices.length);
	}

	var out = [];
	out.push(choices[rand1]);
	out.push(choices[rand2]);

	return out;
};

GT.Settings.prototype.addPlayer = function(name, tile, theme) {
	this.numPlayers += 1;
	var theme = 'standard'
	var piece = 'img/pieces/' + tile + '.png';
	var player = new GT.Player(name, piece, theme);

	this.players.push(player);
};

GT.Settings.prototype.changeTheme = function(player, theme) {
	if (player > numPlayers || player <= 0){
		return;
	} else {
		this.players[player-1].theme = theme;
	}
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
GT.Settings.prototype.getTheme = function(player) {
	return this.players[player].theme;
};
GT.Settings.prototype.getName = function(player) {
	return this.players[player].name;
};
