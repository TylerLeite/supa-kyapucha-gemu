if (GT === null || typeof(GT) != "object") { var GT = new Object();}

/**
 * @constructor
 */
GT.Actor = function(name) {
	this.name = name;
	this.picture = 'img/npc/' + name + '/' + name + '.png';
	this.piece = 'img/npc/' + name + '/piece.png';
	this.music = 'aud/npc/' + name + '.ogg';
};

GT.Actor.prototype.setupAI = function(level, aggression, foresight) {
	//
};

GT.Actor.prototype.setDialogue = function(meet, victory, defeat) {
	//
};

/**
 * @constructor
 */
GT.Player.prototype = new Actor();
GT.Player.prototype.constructor = GT.Player;
GT.Player = function(name) {
	//
};
