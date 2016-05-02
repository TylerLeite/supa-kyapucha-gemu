/*
* JqueryMobile has a loader symbol that needs to be hidden after page load
*/
window.onload = function () {
	$(".ui-loader").hide();
}

/*
*	When single, multi or online is clicked, single is toggled to true or false
*/
$('.single').click(function(){single = true;});
$('.multi').click(function(){single = false;});
$('.level').click(function(){level = $(this).attr('id'); window.scrollTo(0,0);});
$('.online').click(function(){single = false;});
/*
* When the back button is pressed, reset everything
*/
$(window).on('hashchange', function(e){
 if (window.location.href.indexOf('board')>-1){
	 GT.Music.switch(GT.vars.music, 'game');
 } else if (window.location.href.indexOf('level-select')>-1){
	 GT.Music.switch(GT.vars.music, 'level-select');
 } else {
	 GT.Music.switch(GT.vars.music, 'menu');
 }
});

$('.back-btn').click(function(){reset(); resetTurn();});

/*
*	When the ok button on the alert is pressed, reset everything and have the
* AI make it's move if it is the first turn in single player mode.
*/

$('.ok-btn').click(function(){
	reset();
	if (single === true && turn === 2){
		aiMove();
	}
});

$('.sub-btn').click(function(){
	var name = $('.prompt-input').val();
	var re = /^[a-zA-Z0-9_-]{3,16}$/
	if (!re.test(name)){
		$('.prompt-message').css({color:"red"});
		$('.prompt-message').text("Uh... that's no good");
	} else {
		save.name = name;
		setStore = JSON.stringify(save);
		reset();
		localStorage.setItem("save",setStore);
	}
});

$('.board-rank').on('click',addTile);
