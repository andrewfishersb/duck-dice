//Backend
var currentpoints = 0;
var rollCount = 0;
var turn = 1;
var gameOver = false;
var playerOne = new Player(1);
var playerTwo = new Player(2);

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
      if(turn === 1){
      turn = 2;
      }
      else if(turn === 2)
      {
      turn =1;
      }
      currentpoints = 0;
    }
    else {
      currentpoints += roll;
    }
  }
}

var updateScore = function(){
  if(turn===1){
    playerOne.totalPoints +=currentpoints;
    turn =2;
  }else{
    playerTwo.totalPoints +=currentpoints;
    turn =1;
  }
  currentpoints=0;
}

var isGameOver =function(playerOnePoints,playerTwoPoints){
  playerOnePoints = playerOne.totalPoints;
  playerTwoPoints = playerTwo.totalPoints;

  if(playerOnePoints>=10){
    gameOver=true;
    console.log(gameOver);
    turn =1;
  }else if(playerTwoPoints>=10){
    gameOver =true;
    console.log(gameOver);
    turn = 2;
  }
}

var resetGame= function(){
  playerOne.totalPoints =0;
  playerTwo.totalPoints =0;
  currentpoints =0;
  rollCount=0;
  gameOver = false;

}

//Front End
$(document).ready(function() {
  var resetInterface = function(){
    resetGame();
    $("#current-roll").text(rollCount);
    $("#turn-total").text(currentpoints);
    $("#output1").text(playerOne.totalPoints);
    $("#output2").text(playerTwo.totalPoints);

  }

  $("button#roll").click(function() {
    rollCount = roll();
    addRoll(rollCount);
    $("#current-roll").text(rollCount);
    $("#turn-total").text(currentpoints);

  });
  $("button#hold").click(function(){
    updateScore();
    $("#output1").text(playerOne.totalPoints);
    $("#output2").text(playerTwo.totalPoints);
    isGameOver(playerOne.totalPoints,playerTwo.totalPoints);
    if(gameOver)
    {
      $("#player").text(turn);
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
