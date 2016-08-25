//Backend
var currentpoints = 0;
var rollCount = 0;
var turn = 0;
var gameOver = false;
var totalPlayers = [];
var robotNames =['Spade','DeathGrip','KillaClone','CompSlayer','System32','MaulWare','BioSphere','Lizard','TrojanMule','VampireWalrus','ERROR 404',"Blade","Blazer","Lazer", "DragonFace", "Porky", "DiscoDuck", "Mike Tyson", "GitSum!","Spark","GageRage",'Das Boot','CyberneticSimon', 'Das BoT', "Nerf Me", "RAM Job"];

function Player (name) {
  this.name = name;
  this.totalPoints = 0;
  this.isRobot = false;
}

function Robot () {
  var nameSelector =Math.floor(Math.random()*26);
  this.name = robotNames[nameSelector];
  this.totalPoints = 0;
  this.isRobot = true;
  this.isHard = false;
}

var roll = function(){
  if(gameOver===false){
    return Math.floor(Math.random()*6)+1;
  }
}
var hardRoll = function()
{
  // debugger;
  do
  {
    var roboRoll = roll();
    console.log("Hard Roll: " +roboRoll);
    if(roboRoll === 1) {
      currentpoints = 0;
      break;
    }
    else {
      currentpoints += roboRoll;
    }
  }
  while(currentpoints <= 20);
  updateScore();
}


var easyRoll = function()
{
  var roboRoll1 = roll();
  var roboRoll2 = roll();
  console.log("roboroll!")
  console.log("roboroll1 " + roboRoll1)
  console.log("roboroll2 " + roboRoll2)
  if(roboRoll1 == 1 || roboRoll2 == 1)
  {
    currentpoints = 0;
    updateScore();
  }
  else
  {
    currentpoints = roboRoll1 + roboRoll2;

    updateScore();
  }
}



var addRoll = function(roll){
  if(gameOver === false)
  {
    if(roll == 1)
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
  for(var i =0; i<totalPlayers.length;i++){
    if(totalPlayers[i].totalPoints>=100){
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

  var outputShow = function () {

    $("#output").empty();
    $("#turn-player").text(totalPlayers[turn].name);
    totalPlayers.forEach(function(player){
      if(player.isHard)
      {
        $("#output").append("<li><span id='hard'>" + player.name +": " +"</span>"+player.totalPoints + "</li>");
      }
      else if(player.isRobot)
      {
        $("#output").append("<li><span id='easy'>" + player.name +": " +"</span>"+player.totalPoints + "</li>");
      }
      else{
        $("#output").append("<li><span id='players'>" + player.name +": " +"</span>"+player.totalPoints + "</li>");
      }

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
  $("button#robot-easy").click(function(){
    var robot = new Robot();
    if(totalPlayers.length < 5)
    {
      totalPlayers.push(robot);
    }

  });
  $("button#robot-hard").click(function(){
    var robot = new Robot();
    robot.isHard =true;
    if(totalPlayers.length < 5)
    {
      totalPlayers.push(robot);
    }
  });

  console.log(totalPlayers);
  $("button#roll").click(function() {
      rollCount = roll();
      while(totalPlayers[turn].isRobot)
      {
        if(totalPlayers[turn].isHard){
          hardRoll();
        }else{
          easyRoll();
        }
        outputShow();
        isGameOver();
        if(gameOver)
        {
          $("#player").text(totalPlayers[turn].name);
          $(".game-over").show();
          break;
        }
      //   $("#current").hide(); //hide the current roll view during play
      }
      if(!totalPlayers[turn].isRobot)
      {
        addRoll(rollCount);
        outputShow();
         //$("#current").show(); //hide the current roll during
      }
      isGameOver();
      $("#current-roll").text(rollCount);
      console.log(currentpoints)
      $("#turn-total").text(currentpoints);
  });
  $("button#hold").click(function(){
    // if(totalPlayers[turn].isRobot){
    // $("#current").hide(); //hide the current roll view during play
    // }else{
    //   $("#current").show(); //hide the current roll during
    // }

    $("#output").empty();
    if(currentpoints !==0){
      updateScore();
    }
    while(totalPlayers[turn].isRobot)
    {
      if(totalPlayers[turn].isHard){
        hardRoll();
      }else{
        easyRoll();
      }

      outputShow();
      console.log("I GOT HERE");
      isGameOver();
      if(gameOver)
      {
        $("#player").text(totalPlayers[turn].name);
        $(".game-over").show();
        break;
      }
    }

    isGameOver();
    outputShow();
    //$("#turn-player").text(totalPlayers[turn].name);
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
