if (GT === null || typeof(GT) != "object") { var GT = new Object();}

function src_from_name(name) {
	return 'aud/' + name + '.ogg';
}

GT.Music = function(name) {
	this.src = src_from_name(name);
	this.music = new Audio(this.src);
	this.music.addEventListener('ended', function() {
		this.currentTime = 0;
		this.play();
	}, false);
	this.music.play();
};

GT.Music.prototype.switch = function(name) {
	var src = src_from_name(name);
	this.music.src = src;
	this.music.load();
	this.music.play();
};
