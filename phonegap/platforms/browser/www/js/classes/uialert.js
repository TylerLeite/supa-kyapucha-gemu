if (GT === null || typeof(GT) != "object") { var GT = new Object(); }
if (GT.vars === null || typeof(GT.vars) != "object") { GT.vars = new Object(); }

GT.UI.Alert = function(){};

/**
 * Initializes the alert popup by hiding the overlay and alert
 * from the user view.
 */
GT.UI.Alert.prototype.initialize = function(){
  $('.alert').hide();
  $('.overlay').hide();
};

/**
 * @see         initialize
 */
GT.UI.Alert.prototype.reset = function(){
  this.initialize();
};

/**
 * Goes to the board class to get the dominant player, and
 * displays who the winner is by showing the alert and showing
 * the overlay.
 */
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

/**
 * If the game is in single player mode then this forces the AI
 * to initially move it is the AI's turn to go first.  
 */
GT.UI.Alert.prototype.submit = function(){
  reset();
  if (GT.vars.gamemode === 'single' && GT.vars.turn === 2){
    aiMove();
  }
};
