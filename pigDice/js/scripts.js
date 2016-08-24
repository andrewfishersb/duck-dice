//Backend
var currentpoints = 0;
var rollCount = 0;
var turn = 0;
var gameOver = false;
var totalPlayers = [];

function Player (name) {
  this.name = name;
  this.totalPoints = 0;
}

var roll = function(){
  if(gameOver===false){
    return Math.floor(Math.random()*6)+1;
  }
}

var addRoll = function(roll){
  if(gameOver === false)
  {
    if(roll === 1)
    {
      if(turn >= (totalPlayers.length - 1)){
        turn = 0;
      }
      else{
        turn ++;
      }
      currentpoints = 0;
    }
    else {
      currentpoints += roll;
    }
  }
}

var updateScore = function(){
  console.log(totalPlayers[turn].name);
    totalPlayers[turn].totalPoints +=currentpoints;
    if(turn >= (totalPlayers.length - 1)){
      turn = 0;
    }
    else{
      turn ++;
    }
    currentpoints=0;
}

var isGameOver =function(){
  for(var i =0; i<totalPlayers.length-1;i++){
    if(totalPlayers[i].totalPoints>=10){
      gameOver=true;
      turn=i;
      break;
    }
  }
}

var resetGame= function(){
  totalPlayers.forEach(function(player){
    player.totalPoints =0;
  });
  currentpoints =0;
  rollCount=0;
  gameOver = false;

}

//Front End
$(document).ready(function() {
  var resetInterface = function(){
    resetGame();
    $("#output").empty();
    $("#current-roll").text(rollCount);
    $("#turn-total").text(currentpoints);
    totalPlayers.forEach(function(player){
      $("#output").append("<li>" + player.totalPoints + "</li>");
    });
  }

  $("button#add").click(function(){
    var player = new Player($("#name").val());
    if(totalPlayers.length < 5)
    {
      totalPlayers.push(player);
    }
    $("#name").val("");
  });
  console.log(totalPlayers);
  $("button#roll").click(function() {
    rollCount = roll();
    addRoll(rollCount);
    $("#current-roll").text(rollCount);
    $("#turn-total").text(currentpoints);

  });
  $("button#hold").click(function(){
    $("#output").empty();
    updateScore();
    totalPlayers.forEach(function(player){
      $("#output").append("<li>" + player.totalPoints + "</li>");
    });
    isGameOver();
    if(gameOver)
    {
      $("#player").text(totalPlayers[turn].name);
      $(".game-over").show();
    }
  });
  $("button.game-over").click(function(){
    resetInterface();
    $(".game-over").hide();
  });
  $("button#rage").click(function(){
    resetInterface();
  });



});
