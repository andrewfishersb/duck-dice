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
  var nameSelector =Math.floor(Math.random()*robotNames.length);
  this.name = robotNames[nameSelector];
  robotNames.splice(nameSelector,1);
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
  var holdCondition =20;
  //20 good earlier on
  //after 50 hold on 15
  //if far behind take risks
  //hold on 35 behind by 30

  for(var i = 0; i < totalPlayers.length; i ++)
  {
    if(totalPlayers[i].totalPoints - totalPlayers[turn].totalPoints > 30 )
    {
      holdCondition = 34;
    }
  }

  if(totalPlayers[turn].totalPoints >=50 && holdCondition < 34)
  {
    holdCondition = 17;
  }


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
  while(currentpoints <= holdCondition);
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
        currentpoints = 0;
        while(totalPlayers[turn].isRobot)
        {
          //isGameOver();
          if(totalPlayers[turn].isHard)
            hardRoll();
          else
            easyRoll();
        }
      }

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

var findLoser = function(playerArray){
  var min = totalPlayers[0].totalPoints;
  var index = 0;
  for(var i =1; i<totalPlayers.length; i++){
    if(min>totalPlayers[i].totalPoints){
      min = totalPlayers[i].totalPoints;
      index = i;
    }
  }
  return index;
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
      $("#roll").attr("disabled",false);
      $("#hold").attr("disabled",false);
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

          var indexOfLoser = findLoser(totalPlayers);
          console.log("Loser: "+ indexOfLoser);
          $("#player").text(totalPlayers[turn].name);
          $("#loser").text(totalPlayers[indexOfLoser].name);
          $(".game-over").show();
          $("#roll").attr("disabled",true);
          $("#hold").attr("disabled",true);
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
      if(gameOver)
      {
        var indexOfLoser = findLoser(totalPlayers);
        console.log("Loser: "+ indexOfLoser);
        $("#player").text(totalPlayers[turn].name);
        $("#loser").text(totalPlayers[indexOfLoser].name);


        $(".game-over").show();
        $("#roll").attr("disabled",true);
        $("#hold").attr("disabled",true);
      }
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

      isGameOver();
      if(gameOver)
      {
        var indexOfLoser = findLoser(totalPlayers);
        console.log("Loser: "+ indexOfLoser);
        $("#player").text(totalPlayers[turn].name);
        $("#loser").text(totalPlayers[indexOfLoser].name);


        $(".game-over").show();
        $("#roll").attr("disabled",true);
        $("#hold").attr("disabled",true);
        break;
      }
    }

    isGameOver();
    outputShow();
    //$("#turn-player").text(totalPlayers[turn].name);
    if(gameOver)
    {
      var indexOfLoser = findLoser(totalPlayers);
      console.log("Loser: "+ indexOfLoser);
      $("#player").text(totalPlayers[turn].name);
      $("#loser").text(totalPlayers[indexOfLoser].name);


      $(".game-over").show();
      $("#roll").attr("disabled",true);
      $("#hold").attr("disabled",true);
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
