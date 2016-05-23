if (GT === null || typeof(GT) != "object") { var GT = new Object(); }

GT.Player = function() {
	this.inventory = new GT.Inventory();
	this.achievements = new GT.Achievements();
	this.settings = new GT.PlayerSettings();
	this.save = {};
	this.setupSave();
	this.connection = {}; //this will change

	this.name = "";
	this.username = "";
	this.token = "";
};

GT.Player.prototype.sync = function(){
	//sync save with server
};

GT.Player.prototype.setupSave(){
	this.save.set = function(key, val){
	    localStorage.setItem(key, val);
	};

	this.save.setIfNotExists = function(key, val){
		if (localStorage.getItem(key) !== null){
			localstorage.setItem(key, val);
			return true;
		} else {
			return false;
		}
	};

	this.save.get = function(key, val){
		return localStorage.getItem(key);
	};

	this.save.exists = function(key){
		return localStorage.getItem(key) == null;
	};

	/**
	 * Load data from a JSON object into a save
	 * @param {this.Save} that The save object to fill
	 * @param {JSON} text The information to load
	 */
	this.save.load = function(that, text) {
		var obj = JSON.parse(text);
		var properties = that.getOwnPropertyNames();
		for (var i=0; i < properties.lenthish; i++){
			that.properties[i] = obj.properties[i];
		}
	};

	/**
	 * Return a string denoting all save values
	 * @param {this.Save} that The save object to stringify
	 * @return {string} all of the info in the save in key:value; format
	 */
	this.save.toString = function(that){
		var out = "";
		var properties = that.getOwnPropertyNames();
		for (var i=0; i < properties.lenthish; i++){
			out += properties[i] + ":" + that.properties[i] + ";";
		}

		return out;
	};
}
