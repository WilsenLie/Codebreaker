var myDoc = document.getElementById("gameCanvas");
var myCanvas = myDoc.getContext("2d");
var score = 0;
var color = ["black", "white", "red", "blue", "yellow", "purple", "green", "#ff4dc4"];
var listY = [50,100,150,200,250,300,350,400, 450];
var sampleAns = [];
var p1, p2, targetScore, countPlayer;
var playerScore = {
	p1Score : 0,
	p2Score : 0
};


//main function
function starter() {
	sampleAns = [];
	randomAns();
	createLayout();
	createBiggerCircle();
	createBigCircle();
	createMedCircle();
}

//randomize the real answer
function randomAns() {
	sampleAns = [];
	var arr = [];
	var i = 0;
	for (var u = 0; u<5; u++) {
		i = Math.floor(Math.random()*8);
		if (arr.length == 0 || arr.indexOf(i) == -1) {
			sampleAns.push(color[i]);
			arr.push(i);
		}
		else {u--;}	
	}
}

////////////////////////////////////////////////////////////////////
//Drawing section

//To check either mouse clicked inside a circle
function isPointInsideCircle(pointX,pointY,circleX,circleY,r){
    var dx=circleX-pointX;
    var dy=circleY-pointY;
    return  ( dx*dx+dy*dy<=r*r);
}

//get mouse position
//I got it from HTML5 Canvas Tutorial
function getPosMouse(canvas, event) {
	var rect = canvas.getBoundingClientRect();
	return {
		x: event.clientX - rect.left,
		y: event.clientY - rect.top
	};
}

//function to draw circles
function makeCircles(x,y,r) {
	myCanvas.beginPath();
	myCanvas.arc(x,y,r,0,2*Math.PI);
	myCanvas.stroke();
	myCanvas.closePath();
}

//the main layout
function createLayout () {
	myCanvas.strokeRect(20, 20, 440, 500);
	
	myCanvas.moveTo(80,20); //left line
	myCanvas.lineTo(80,520);
	myCanvas.stroke();
	
	myCanvas.moveTo(300,20); //right line
	myCanvas.lineTo(300,520);
	myCanvas.stroke();
	
	myCanvas.lineWidth = 2;
}

//Bigger circle ; To choose color & remove
function createBiggerCircle () {
	var yi = 50;
	for (var i=0;i<9;i++) {
		makeCircles(500,yi,20,0,2*Math.PI);
		if (i==8) { //delete button
			myCanvas.fillStyle = "black";
			myCanvas.font = "30px Arial";
			myCanvas.fillText("X",490,460);
			continue;
		}
		myCanvas.fillStyle = color[i];
		myCanvas.fill();
		yi += 50;
	}
}

//big circle;(answer)
function createBigCircle () {
	var xi = 110; 
	yi = 45;
	for (var i=0;i<12;i++) {
		for (var j=0;j<5;j++) {
			makeCircles(xi,yi,15,0,2*Math.PI);
			xi += 40;
		}
		xi = 110;
		yi += 40;
	}
}

//Medium circle ; (matched)
function createMedCircle () {
	xi = 320; 
	yi = 45;
	for (var i=0;i<12;i++) {
		for (var j=0;j<5;j++) {
			makeCircles(xi,yi,10,0,2*Math.PI);
			xi += 30;
		}
		xi = 320;
		yi += 40;
	}
}


/////////////////////////////////////////////////////
//All calculation and algorithm

//To check the winner and ask for restart
function checkWin(playerName) {
	alert (playerName + " is the winner");
	var temp2 = true;
	while (temp2) {
		var YN = prompt("Do you want to play again? (Type Y for yes, N for No)", "Y");
		if (YN == "Y" || YN == "y") {
			alert ("yes");
			temp2 = false;
			location.reload();
		}
		else if (YN == "N" || YN == "n") {
			alert ("Thank you for playing");
			temp2 = false;
		}
	}
}

//The game part, the most important part
function playTheGame() {
	var count = 0;
	var x1 = 110; 
	var y1 = 45;
	var x2 = 320;
	var y2 = 45;
	var stage = 0;
	var whoseTurn = 0;
	var yourAns = [];
	
	myDoc.addEventListener('click', function(event) 
	{
		var mousePos = getPosMouse(myDoc, event); 
		for (var i=0; i<color.length; i++) {
			var check = 0;
			var matchedPegs = [];
			if (isPointInsideCircle(mousePos.x, mousePos.y, 500,listY[i],20)) {
				
				makeCircles(x1,y1,15,0,2*Math.PI);
				x1 += 40;
				myCanvas.fillStyle = color[i];
				myCanvas.fill();
				count++;
				yourAns.push(color[i]);
				if (count == 5) {
					stage++;
					for (var z=0; z<5; z++) {
						var count2 = 0;
						//if the answer and position is correct
						if (sampleAns.indexOf(yourAns[z]) >= 0 && yourAns[z] == sampleAns[z]) { 
							matchedPegs.push(0);
							check++;
						}
						//if the answer is correct but wrong position
						else if (sampleAns.indexOf(yourAns[z]) >= 0 && yourAns[z] != sampleAns[z]) {
							matchedPegs.push(1);
						}
						//wrong
						else {
							matchedPegs.push("x");
						}
					}
					//put the marks
					for (var z=0; z<5; z++) {
						makeCircles(x2,y2,10,0,2*Math.PI);
						x2 += 30;
						if (matchedPegs[z] == "x") {
							continue;
						}
						myCanvas.fillStyle = color[matchedPegs[z]];
						myCanvas.fill();
					}
					//new trial
					x1 = 110;
					x2 = 320;
					y1 += 40;
					y2 += 40;
					count = 0;
					yourAns = [];
				}
				if (stage == 12 && check != 5) { //no correct answer
					alert("No point");
					alert ("The answer is : " + sampleAns[0] +","+ sampleAns[1] +","+ sampleAns[2] +","+ sampleAns[3] +","+ sampleAns[4]);
					if (whoseTurn == 0) {
						stage = 0;
						y1 = 45; //restart y position
						y2 = 45;
						myCanvas.fillStyle = "#8c8c8c";
						myCanvas.fillRect(0,0,550,550);
						matchedPegs = [];
						if (countPlayer == 1) { //only 1 player
							starter();
						}
						else {
							whoseTurn = 1; //change player
							turn(1);
							starter();
						}
					}
					else if (whoseTurn == 1) {
						stage = 0;
						y1 = 45; //restart y position
						y2 = 45;
						whoseTurn = 0; //change player
						myCanvas.fillStyle = "#8c8c8c";
						myCanvas.fillRect(0,0,550,550);
						matchedPegs = [];
						turn(0);
						starter();
					}
				}
				//if there is correct answer
				if (check == 5) {
					if (stage == 1) {
						alert ("Lucky");
						score += 7;
					}
					else if (stage <= 4) {
						alert ("5 Points");
						score += 5;
					}
					else if (stage >= 5 && stage <=8) {
						alert ("4 Points");
						score += 4;
					}
					else if (stage >= 9 && stage <= 12) {
						alert ("3 Points");
						score += 3;
					}
					alert ("The answer is : " + sampleAns[0] +","+ sampleAns[1] +","+ sampleAns[2] +","+ sampleAns[3] +","+ sampleAns[4]);
					if (whoseTurn == 0) {
						playerScore.p1Score += score;
						document.getElementById("p1Score").innerHTML = playerScore.p1Score;
						if (playerScore.p1Score >= targetScore) {
							checkWin(p1);
						}
						stage = 0;
						score = 0; //restart the score
						y1 = 45; //restart y position
						y2 = 45;
						myCanvas.fillStyle = "#8c8c8c";
						myCanvas.fillRect(0,0,550,550);
						matchedPegs = [];
						if (countPlayer == 1) { //only 1 player
							starter();
						}
						else {
							whoseTurn = 1; //change player
							turn(1);
							starter();
						}
					}
					else if (whoseTurn == 1) {
						playerScore.p2Score += score;
						document.getElementById("p2Score").innerHTML = playerScore.p2Score;
						if (playerScore.p2Score >= targetScore) {
							checkWin(p2);
						}
						stage = 0;
						score = 0; //restart the score
						y1 = 45; //restart y position
						y2 = 45;
						whoseTurn = 0; //change player
						myCanvas.fillStyle = "#8c8c8c";
						myCanvas.fillRect(0,0,550,550);
						matchedPegs = [];
						turn(0);
						starter();
					}
				}
			}
			//delete function
			else if (isPointInsideCircle(mousePos.x, mousePos.y, 500,450,20)) {
				if (x1-40 >= 110) {
					x1-=40;
					makeCircles(x1,y1,15,0,2*Math.PI);
					myCanvas.fillStyle = "#8c8c8c";
					myCanvas.fill();
					matchedPegs.pop();
					yourAns.pop();
					check--;
					count--;
				}
				break;
			}
		} 
	}, false);
}	

/////////////////////////////////////////////////////////////
//Everything about text boxes and submit button



function submitNames() {
	p1 = document.getElementById("p1").value;
	p2 = document.getElementById("p2").value;
	targetScore = document.getElementById("targetScore").value;
	var intScore = parseInt(targetScore);
	if (intScore < 25 || intScore > 100 || targetScore == "" || isNaN(intScore)) {
		alert("The target score must be between 25 and 100");
		location.reload();
	}
	var ask = document.getElementById("askName");
	ask.parentNode.removeChild(ask);
	printNames();
}


function printNames() {
	document.getElementById("target2name").innerHTML = "Target Score : ";
	document.getElementById("target2").innerHTML = targetScore;
	if (p1 != "" && p2 != "") {
		document.getElementById("p1Name").innerHTML = p1;
		document.getElementById("p1Score").innerHTML = playerScore.p1Score;
		document.getElementById("p2Name").innerHTML = p2;
		document.getElementById("p2Score").innerHTML = playerScore.p2Score;
		document.getElementById("p1Name").style.color= "blue";
		countPlayer = 2;
	}
	else if (p1 == "" && p2 != "") {
		document.getElementById("p1Name").innerHTML = "Player 1";
		p1 = "Player 1";
		document.getElementById("p1Score").innerHTML = playerScore.p1Score;
		document.getElementById("p2Name").innerHTML = p2;
		document.getElementById("p2Score").innerHTML = playerScore.p2Score;
		document.getElementById("p1Name").style.color= "blue";
		countPlayer = 2;
	}
	else if (p1 != "" && p2 == "") {
		document.getElementById("p1Name").innerHTML = p1;
		document.getElementById("p1Score").innerHTML = playerScore.p1Score;
		countPlayer = 1;
	}
	else if (p1 == "" && p2 == "") {
		document.getElementById("p1Name").innerHTML = "Player 1";
		p1 = "Player 1";
		document.getElementById("p1Score").innerHTML = playerScore.p1Score;
		document.getElementById("p2Name").innerHTML = "Player 2";
		p2 = "Player 2";
		document.getElementById("p2Score").innerHTML = playerScore.p2Score;
		document.getElementById("p1Name").style.color= "blue";
		countPlayer = 2;
	}
	starter();
	playTheGame();
}

function turn(i) {
	if (i==0) {
		document.getElementById("p1Name").style.color= "blue";
		document.getElementById("p2Name").style.color= "black";
	}
	else if (i==1) {
		document.getElementById("p2Name").style.color= "blue";
		document.getElementById("p1Name").style.color= "black";
	}
}	