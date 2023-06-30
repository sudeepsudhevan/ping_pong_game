const canvas = document.getElementById("game");
const context = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;


const paddleWidth = 18,
    paddleHeight = 120,
    paddleSpeed = 8,
    ballRadius = 12,
    initialBallSpeed = 8,
    maxBallSpeed = 60,
    netWidth = 5,
    netColor = "WHITE";

//Draws the net
function drawNet() {
    for (let i = 0; i <= canvas.height; i += 15) {
        drawRect(canvas.width / 2 - netWidth / 2, i, netWidth, 10, netColor);
    }
}

//Draws the rectangle
function drawRect(x, y, width, height, color) {
    context.fillStyle = color;
    context.fillRect(x, y, width, height);

}

//Draws the circle
function drawCircle(x, y, radius, color) {
    context.fillStyle = color;
    context.beginPath();
    context.arc(x, y, radius, 0, Math.PI * 2, false);
    context.closePath();
    context.fill();
}

//Draws the text
function drawText(text, x, y, color, fontSize = 60, fontWeight = 'bold', font = 'Courier New') {
    context.fillStyle = color;
    context.font = `${fontWeight} ${fontSize}px ${font}`;
    context.textAlign = 'center';
    context.fillText(text, x, y);
}

//Create a paddle Object
function createPaddle(x, y, width, height, color) {
    return { x, y, width, height, color, score: 0 };
}

//Create a ball Object
function createBall(x, y, radius, velocityX, velocityY, color) {
    return { x, y, radius, velocityX, velocityY, color, speed: initialBallSpeed };
}

//Define User and Computer Paddle objects
const user = createPaddle(0, canvas.height / 2 - paddleHeight / 2, paddleWidth, paddleHeight, "WHITE");

const com = createPaddle(canvas.width - paddleWidth, canvas.height / 2 - paddleHeight / 2, paddleWidth, paddleHeight, "WHITE");

//Define Ball object

const ball = createBall(canvas.width / 2, canvas.height / 2, ballRadius, initialBallSpeed, initialBallSpeed, "WHITE");

//update user paddle position based on mouse movement
canvas.addEventListener('mousemove', movePaddle);

function movePaddle(event) {
    const rect = canvas.getBoundingClientRect();
    user.y = event.clientY - rect.top - user.height / 2;
}

function checkBallCollision(b, p) {
    return (b.x + b.radius > p.x && b.x - b.radius < p.x + p.width && b.y + b.radius > p.y && b.y - b.radius < p.y + p.height);
}

//reset the ball position, velocity and speed
function resetBall() {
    ball.x = canvas.width / 2;
    ball.y = Math.random() * (canvas.height - ball.radius * 2) + ball.radius;
    ball.velocityX = -ball.velocityX;
    ball.speed = initialBallSpeed;
}

//update game logic
function update() {
    //check for score and reset the ball if needed
    if (ball.x - ball.radius < 0) {
        com.score++;
        resetBall();
    }
    if (ball.x + ball.radius > canvas.width) {
        user.score++;
        resetBall();
    }

    //update ball position
    ball.x += ball.velocityX;
    ball.y += ball.velocityY;

    //update computer paddle position
    com.y += (ball.y - (com.y + com.height / 2)) * 0.1;

    //Top and bottom wall collision
    if (ball.y - ball.radius <= 0 || ball.y + ball.radius > canvas.height) {
        ball.velocityY = -ball.velocityY;
    }

    //Determines which paddle the ball is colliding with

    let player = ball.x + ball.radius < canvas.width / 2 ? user : com;
    if (checkBallCollision(ball, player)) {
        const collidePoint = ball.y - (player.y + player.height / 2);
        const CollisionAngle = (Math.PI / 4) * (collidePoint / (player.height / 2));
        const direction = ball.x + ball.radius < canvas.width / 2 ? 1 : -1;
        ball.velocityX = direction * ball.speed * Math.cos(CollisionAngle);
        ball.velocityY = ball.speed * Math.sin(CollisionAngle);

        //increase ball speed
        ball.speed += 0.2;
        if (ball.speed > maxBallSpeed) {
            ball.speed = maxBallSpeed;
        }
    }
}

//render the game
function render() {
    //clear the canvas with black color
    drawRect(0, 0, canvas.width, canvas.height, "BLACK");

    //draw scores
    drawNet();
    drawText(user.score, canvas.width / 4, canvas.height / 2, "GRAY", 120, 'bold');
    drawText(com.score, (3 * canvas.width) / 4, canvas.height / 2, "GRAY", 120, 'bold');

    //draw paddles

    drawRect(user.x, user.y, user.width, user.height, user.color);
    drawRect(com.x, com.y, com.width, com.height, com.color);

    //draw ball
    drawCircle(ball.x, ball.y, ball.radius, ball.color);

}

//Run the game loop
function gameLoop() {
    update();
    render();

}

//Set the game loop to run 60 frame per second
const framePerSec = 60;
setInterval(gameLoop, 1000 / framePerSec);


