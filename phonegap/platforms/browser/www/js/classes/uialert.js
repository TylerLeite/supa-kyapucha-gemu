if (GT === null || typeof(GT) != "object") { var GT = new Object(); }
if (GT.vars === null || typeof(GT.vars) != "object") { GT.vars = new Object(); }

GT.UI.Alert = function(){};

GT.UI.Alert.prototype.initialize = function(){
  $('.alert').hide();
  $('.overlay').hide();
};

GT.UI.Alert.prototype.reset = function(){
  this.initialize();
};

GT.UI.Alert.prototype.update = function(){
  if (GT.vars.board.emp() === 0){
    var dom = GT.vars.board.dominance();
    var winner = dom[0];
    var p1 = dom[1].toString();
    var p2 = dom[2].toString();

    if (p2 > p1){
      var temp = p2;
      p2 = p1;
      p1 = temp;
    }

    if (winner <= 2){
      $('.alert-message').text(GT.vars.settings.getName(winner-1) + " wins! (" + p1 + " to " + p2 +")");
    } else {
      $('.alert-message').text('It\'s a tie!');
    }
    $('.alert').show();
    $('.overlay').show();
  }
};

GT.UI.Alert.prototype.submit = function(){
  reset();
  if (GT.vars.gamemode === 'single' && GT.vars.turn === 2){
    aiMove();
  }
};
