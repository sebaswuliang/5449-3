// --- Pong Game Constants ---
const canvas = document.getElementById('pongCanvas');
const ctx = canvas.getContext('2d');
const WIDTH = canvas.width;
const HEIGHT = canvas.height;

// Paddle properties
const PADDLE_WIDTH = 12;
const PADDLE_HEIGHT = 90;
const PADDLE_MARGIN = 16;

// Ball properties
const BALL_SIZE = 16;
const BALL_SPEED = 6;

// Left paddle (player)
let leftPaddleY = HEIGHT / 2 - PADDLE_HEIGHT / 2;

// Right paddle (AI)
let rightPaddleY = HEIGHT / 2 - PADDLE_HEIGHT / 2;
let aiSpeed = 5;

// Ball
let ballX = WIDTH / 2 - BALL_SIZE / 2;
let ballY = HEIGHT / 2 - BALL_SIZE / 2;
let ballVelX = BALL_SPEED * (Math.random() > 0.5 ? 1 : -1);
let ballVelY = BALL_SPEED * (Math.random() * 2 - 1);

// Scores
let leftScore = 0;
let rightScore = 0;

// --- Game Functions ---

function resetBall() {
    ballX = WIDTH / 2 - BALL_SIZE / 2;
    ballY = HEIGHT / 2 - BALL_SIZE / 2;
    ballVelX = BALL_SPEED * (Math.random() > 0.5 ? 1 : -1);
    ballVelY = BALL_SPEED * (Math.random() * 2 - 1);
}

// Draw everything
function draw() {
    // Clear
    ctx.clearRect(0, 0, WIDTH, HEIGHT);

    // Draw net
    ctx.fillStyle = "#444";
    for (let y = 0; y < HEIGHT; y += 32) {
        ctx.fillRect(WIDTH / 2 - 2, y, 4, 18);
    }

    // Draw paddles
    ctx.fillStyle = "#fff";
    ctx.fillRect(PADDLE_MARGIN, leftPaddleY, PADDLE_WIDTH, PADDLE_HEIGHT);
    ctx.fillRect(WIDTH - PADDLE_MARGIN - PADDLE_WIDTH, rightPaddleY, PADDLE_WIDTH, PADDLE_HEIGHT);

    // Draw ball
    ctx.fillRect(ballX, ballY, BALL_SIZE, BALL_SIZE);

    // Draw scores
    ctx.font = "bold 32px Arial";
    ctx.textAlign = "center";
    ctx.fillText(leftScore, WIDTH / 2 - 60, 40);
    ctx.fillText(rightScore, WIDTH / 2 + 60, 40);
}

// Update game state
function update() {
    // Move ball
    ballX += ballVelX;
    ballY += ballVelY;

    // Ball collision with top/bottom
    if (ballY <= 0) {
        ballY = 0;
        ballVelY *= -1;
    } else if (ballY + BALL_SIZE >= HEIGHT) {
        ballY = HEIGHT - BALL_SIZE;
        ballVelY *= -1;
    }

    // Ball collision with left paddle
    if (
        ballX <= PADDLE_MARGIN + PADDLE_WIDTH &&
        ballY + BALL_SIZE >= leftPaddleY &&
        ballY <= leftPaddleY + PADDLE_HEIGHT
    ) {
        ballX = PADDLE_MARGIN + PADDLE_WIDTH;
        ballVelX *= -1;
        // Add effect based on where it hit the paddle
        let hitPos = (ballY + BALL_SIZE / 2) - (leftPaddleY + PADDLE_HEIGHT / 2);
        ballVelY = hitPos * 0.25;
    }

    // Ball collision with right paddle
    if (
        ballX + BALL_SIZE >= WIDTH - PADDLE_MARGIN - PADDLE_WIDTH &&
        ballY + BALL_SIZE >= rightPaddleY &&
        ballY <= rightPaddleY + PADDLE_HEIGHT
    ) {
        ballX = WIDTH - PADDLE_MARGIN - PADDLE_WIDTH - BALL_SIZE;
        ballVelX *= -1;
        let hitPos = (ballY + BALL_SIZE / 2) - (rightPaddleY + PADDLE_HEIGHT / 2);
        ballVelY = hitPos * 0.25;
    }

    // Ball out of bounds
    if (ballX < 0) {
        rightScore++;
        resetBall();
    } else if (ballX > WIDTH) {
        leftScore++;
        resetBall();
    }

    // AI paddle follows ball
    let rightPaddleCenter = rightPaddleY + PADDLE_HEIGHT / 2;
    if (ballY + BALL_SIZE / 2 > rightPaddleCenter + 10) {
        rightPaddleY += aiSpeed;
    } else if (ballY + BALL_SIZE / 2 < rightPaddleCenter - 10) {
        rightPaddleY -= aiSpeed;
    }
    // Clamp AI paddle
    rightPaddleY = Math.max(0, Math.min(HEIGHT - PADDLE_HEIGHT, rightPaddleY));
}

// Mouse movement controls left paddle
canvas.addEventListener('mousemove', function (e) {
    const rect = canvas.getBoundingClientRect();
    const mouseY = e.clientY - rect.top;
    leftPaddleY = mouseY - PADDLE_HEIGHT / 2;
    // Clamp
    leftPaddleY = Math.max(0, Math.min(HEIGHT - PADDLE_HEIGHT, leftPaddleY));
});

// Main loop
function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

gameLoop();