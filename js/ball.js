var init = false; //defines whether the initial values have been set or not (false = have now; true = have)
var x = 0; //x coordinate of the ball 
var y = 0; //y coordinate of the ball
var mx = 0; //last mouse click x coordinate
var my = 0; //last mouse click y coordinate
var r = 45; //the radius of the ball 
var time = Date.now(); //current timestamp (1st call)
var canvas = null; //creates an empty variable to store the canvas in for later
var score = 0; //creates an empty variable to store the score in 
var randomColor = Math.floor(Math.random()*16777215).toString(16); //hex code for a random color
var cooldown = 500; //defines the time between jumps of the ball (challenge mode), 500 = 0.5s
var addCooldown = 500;
var hardMode = false; //initially not in hard mode

//set canvas variable and add mouse click event
function initialize() {
    
    canvas = document.getElementById("myGame");
    canvas.addEventListener("mousedown", function(e) {
        checkIfBallClicked(canvas, e);
    });
    
    //the first draw call
    draw();
}

//the game loop
function draw() {
    if(canvas.getContext) {
        var ctx = canvas.getContext('2d'); 
        ctx.fillStyle = "black"; //canvas background
        ctx.fillRect(0, 0, canvas.width, canvas.height); //clear the canvas before drawing on it
        //set the position for the first ball (centered)
        //if the initial values are not set (the var init ="" above), set the values (x, y) and set the init to true
        if(!init) {
            x = canvas.width / 2; //centers at x
            y = canvas.height / 2; //centers at y
            init = true; //the values have been set (x, y)
        }
        
        //the score text
        ctx.font = "30px serif";
        ctx.fillStyle = "white";
        ctx.fillText("score: " + score, 10, 50); //the 10 & 50  are the coordinates of the text 
        
        
        var deltaTime = (Date.now() - time); //the time that has passed since the frame (draw call): current time stamp (2nd call aka the Date.now() RIGHT NOW - previous frame time stamp (1st call)
        ctx.beginPath();
        ctx.arc(x, y, r, 0, 2 * Math.PI, false); //define the circle
        ctx.fillStyle = "#" + randomColor; //define the circle color
        ctx.fill();
        ctx.closePath(); //close the circle
        
        
        cooldown -= deltaTime; //subtract deltaTime from cooldown
        //if one second has passed and the game is in 'challenge mode'
        if (cooldown < 0 && hardMode) {
            cooldown += addCooldown; //add 1s
            newBall(canvas, false); //draw a new ball
        }
        
        time = Date.now(); //set new time
        requestAnimationFrame(draw); //move to next frame 
    }
}

function checkIfBallClicked(canvas,event) {
    let rect = canvas.getBoundingClientRect();
    mx = event.clientX - rect.left;
    my = event.clientY - rect.top;
    var d = (r * r) - (((x - mx) * (x - mx)) + ((y - my) * (y - my))); //check if the click happened inside the circle
    
    //if the above is true then draw new ball
    if(d >= 0) {
        newBall(canvas);    
    }
}    

//change ball position, size & color if the ball is clicked 
//"addScore = true" sets the default action as add score
function newBall(canvas, addScore = true) {
    max = canvas.width - r; //max coordinates of where the ball can go 
    //(max - r + 1) does so that the random position of the ball doesn't go beyond the borders of the canvas
    x = Math.floor(Math.random() * (max - r + 1) + r); //change x position
    y = Math.floor(Math.random() * (max - r + 1) + r); //change y position
    r = Math.floor(Math.random() * (45 - 15 +1) + 15); //change ball size
    
    //add 1 to score 
    if (addScore) {
        score += 1;
        cooldown += addCooldown;
    }
    
    //change color 
    randomColor = Math.floor(Math.random()*16777215).toString(16);
}

//set what the button does
function changeMode() {
    var button = document.getElementById("button"); 
    hardMode = !hardMode; 
    
    //change button text on each click; if the game is in hardmode then display 'chicken mode', otherwise display 'challenge mode'
    if (hardMode) {
        button.value = "Chicken mode!";
        
    }   else {
        button.value = "Challenge mode!";
    }
    
    //set score to zero on each button press
    score = 0;
    cooldown = addCooldown;
}