if (GT === null || typeof(GT) != "object") { var GT = new Object(); }
if (GT.vars === null || typeof(GT.vars) != "object") { GT.vars = new Object(); }
if (GT.const === null || typeof(GT.const) != "object") { GT.const = new Object(); }
if (GT.UI.Prompt === null || typeof(GT.UI.Prompt) != "object") { GT.UI.Prompt = new Object(); }

GT.UI.Menu = function(){};

GT.UI.Menu.prototype.initialize = function(){
  if(typeof(Storage) !== "undefined"){
    if(localStorage.getItem("save") !== null){
      //localStorage.clear();
      setStore = localStorage.getItem("save");
      GT.vars.player.save = setStore;
    } else {
      Prompt.update();
    }
  }
  for (var i = 1; i <= GT.const.levelsct; i++){
    var img = "background-image: url(img/icons/lvl/"+i.toString()+".png)";
    var obj = '<a href="#board" class = "level" id = "'+i.toString()+'"><div class="menu-float" style="'+img+'"></div></a>';
    $('#level-select').children().first().append(obj);
  }
};

GT.UI.Menu.prototype.resize = function(){
  var winHgt = $(window).height();
  var winWdt = $(window).width();
  var floatSize = Math.floor(Math.min(winHgt, winWdt) * 0.40);
  floatSize = floatSize.toString() + "px";
  $('.menu-float').css({height:floatSize, width:floatSize});
};
