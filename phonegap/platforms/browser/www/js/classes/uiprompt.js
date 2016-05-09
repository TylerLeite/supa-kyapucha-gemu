if (GT === null || typeof(GT) != "object") { var GT = new Object(); }
if (GT.vars === null || typeof(GT.vars) != "object") { GT.vars = new Object(); }

GT.UI.Prompt = function(){};

GT.UI.Prompt.prototype.initialize = function(){
  $('.prompt').hide();
  $('.overlay').hide();
};

GT.UI.Prompt.prototype.reset = function(){
  this.initialize();
};

GT.UI.Prompt.prototype.update = function(){
  $('.prompt').show();
  $('.overlay').show();
};

GT.UI.Prompt.prototype.submit = function(){
  var name = $('.prompt-input').val();
  var re = /^[a-zA-Z0-9_-]{3,16}$/;
  if (!re.test(name)){
    $('.prompt-message').css({color:"red"});
    $('.prompt-message').text("Uh... that's no good");
  } else {
    GT.vars.player.save.name = name;
    setStore = JSON.stringify(GT.vars.player.save);
    reset();
    localStorage.setItem("save",setStore);
  }
};
