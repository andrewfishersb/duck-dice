//Backend
var currentpoints = 0;
var rollCount = 0;
var turn = 0;
var gameOver = false;
var totalPlayers = [];
var robotNames =['Spade','DeathGrip','KillaClone','CompSlayer','System32','MaulWare','BioSphere','Lizard','TrojanMule','VampireWalrus','ERROR 404',"PassivePolarBear","Blade","Blazer","Lazer", "DragonFace", "Porky", "DiscoDuck", "Mike Tyson", "GitSum!","Spark","GageRage",'Das Boot','CyberneticSimon', 'Das BoT', "Nerf Me", "RAM Job"];

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
  this.isDuck = false;
  this.isBear = false;
}

var roll = function(){
  if(gameOver===false){
    if(totalPlayers[turn].isDuck){
      var num =(Math.floor(Math.random()*6)+1);
      if(num>1){
        num *= 2.5;
      }
      return Math.ceil(num);
    }else if(totalPlayers[turn].isBear){
      var num =(Math.floor(Math.random()*6)+1);
      if(num>1){
        num *= .5;
      }
      return Math.floor(num);
    }else{
      return Math.floor(Math.random()*6)+1;
    }
  }
}
var hardRoll = function()
{
  var holdCondition =20;
  if(totalPlayers[turn].points >= 90){
    holdCondition = 5;
  }
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
        currentpoints = 0;
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
      if(player.isDuck){
        $("#output").append("<li><span id='duck'>" + player.name +": " +"</span>"+player.totalPoints + "</li>");
      }else if(player.isBear){
        $("#output").append("<li><span id='bear'>" + player.name +": " +"</span>"+player.totalPoints + "</li>");
      }else if(player.isHard)
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
  var showFinish = function(){
    var indexOfLoser = findLoser(totalPlayers);
    $("#player").text(totalPlayers[turn].name);
    $("#loser").text(totalPlayers[indexOfLoser].name);
    $(".game-over").show();
    $("#roll").attr("disabled",true);
    $("#hold").attr("disabled",true);
  }

  $("button#add").click(function(){
    var player = new Player($("#name").val());
    var firstLetter = (player.name).charAt(0).toUpperCase();
    player.name = firstLetter + player.name.substring(1);
    if(totalPlayers.length < 5)
    {
      totalPlayers.push(player);
    }
    $("#name").val("");
    outputShow();
  });
  $("button#robot-easy").click(function(){
    var robot = new Robot();
    if(robot.name==='DiscoDuck'){
      robot.isDuck = true;
    }else if(robot.name === 'PassivePolarBear'){
      robot.isBear = true;
      console.log(robot.isBear);
    }
    if(totalPlayers.length < 5)
    {
      totalPlayers.push(robot);
    }
    outputShow();
  });
  $("button#robot-hard").click(function(){
    var robot = new Robot();
    robot.isHard =true;
    if(robot.name==='DiscoDuck'){
      robot.isDuck = true;
    }else if(robot.name === 'PassivePolarBear'){
      robot.isBear = true;
      console.log(robot.isBear);
    }
    if(totalPlayers.length < 5)
    {
      totalPlayers.push(robot);
    }
    outputShow();
  });

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
          showFinish();
          break;
        }
      }
      if(!totalPlayers[turn].isRobot)
      {
        addRoll(rollCount);
        outputShow();
      }
      isGameOver();
      if(gameOver)
      {
        showFinish();
      }
      if(rollCount===1){
        $("#fail").empty();
        $("#fail").show();
        $("#fail").text("You just rolled a one!");
        rollCount=0;
      }else{
        $("#fail").fadeOut();
      }
      $("#current-roll").text(rollCount);
      $("#turn-total").text(currentpoints);
  });
  $("button#hold").click(function(){
    $("#output").empty();
    $("#current-roll").text("0");
    $("#turn-total").text("0");
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
        showFinish();
        break;
      }
    }
    isGameOver();
    outputShow();
    if(gameOver)
    {
      showFinish();
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
