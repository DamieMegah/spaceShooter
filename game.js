const gameArea = document.getElementById('gameArea');
const player = document.getElementById('player');
let bullets = [];
let rocks = [];
let bullet2s = [];
let score = 0;
let scoreBoard = document.getElementById('score');
let keys = {};
let touchX = null;
const audio = document.getElementById('music');
const startButton = document.getElementById('start');
const playButton = document.getElementById('playButton');
const pauseButton = document.getElementById('pauseButton');
let gameInterval;
let createRockInterval;
let createBullet2Interval;
let rockSpeed = 1;
// Event Listeners
window.addEventListener('keydown', (e) => (keys[e.key] = true));
window.addEventListener('keyup', (e) => (keys[e.key] = false));
window.addEventListener('touchstart', handleTouchStart);
window.addEventListener('touchmove', handleTouchMove);
window.addEventListener('touchend', handleTouchEnd);
startButton.addEventListener('click', startGame);
playButton.addEventListener('click', toggleSound);
pauseButton.addEventListener('click', togglePause);
function handleTouchStart(e) {
  touchX = e.touches[0].clientX;
}
function handleTouchMove(e) {
  touchX = e.touches[0].clientX;
}
function handleTouchEnd() {
  touchX = null;
}
function createBullet() {
  const bullet = document.createElement('div');
  bullet.className = 'bullet';
  bullet.style.left = `${player.offsetLeft + player.offsetWidth / 2 - 5}px`;
  bullet.style.bottom = `${gameArea.offsetHeight - player.offsetTop - player.offsetHeight}px`;
  gameArea.appendChild(bullet);
  bullets.push(bullet);
}
function createRock() {
  const x = Math.random() * (gameArea.offsetWidth - 50);
  const rock = document.createElement('div');
  rock.className = 'rock';
  rock.style.left = `${x}px`;
  rock.style.top = `-50px`;
  gameArea.appendChild(rock);
  rocks.push(rock);
}
function moveRocks() {
  rocks.forEach((rock, index) => {
    rock.style.top = `${rock.offsetTop + rockSpeed}rem`;
    if (rock.offsetTop > gameArea.offsetHeight) {
      rock.remove();
      rocks.splice(index, 1);
    }
  });
}
function createBullet2() {
  for (let i = 0; i < 1; i++) {
    const x = Math.random() * (gameArea.offsetWidth - 50);
    const bullet2 = document.createElement('div');
    bullet2.className = 'bullet2';
    bullet2.style.left = `${x}px`;
    bullet2.style.top = `-50px`;
    gameArea.appendChild(bullet2);
    bullet2s.push(bullet2);
  }
}
function moveBullet2() {
  bullet2s.forEach((bullet2, index) => {
    bullet2.style.top = `${bullet2.offsetTop + 5}px`;
    if (bullet2.offsetTop > gameArea.offsetHeight) {
      bullet2.remove();
      bullet2s.splice(index, 1);
    }
  });
}
function movePlayer() {
  if (keys['ArrowLeft'] && player.offsetLeft > 0) {
    player.style.left = `${player.offsetLeft - 10}px`;
  }
  if (keys['ArrowRight'] && player.offsetLeft < gameArea.offsetWidth - player.offsetWidth) {
    player.style.left = `${player.offsetLeft + 10}px`;
  }
  if (keys['ArrowUp'] && player.offsetTop > 0) {
    player.style.top = `${player.offsetTop - 10}px`;
  }
  if (keys['ArrowDown'] && player.offsetTop < gameArea.offsetHeight - player.offsetHeight) {
    player.style.top = `${player.offsetTop + 10}px`;
  }
  if (touchX !== null) {
    let touchPos = touchX - gameArea.getBoundingClientRect().left;
    player.style.left = `${touchPos - player.offsetWidth / 2}px`;
  }
}
function moveBullets() {
  bullets.forEach((bullet, index) => {
    bullet.style.top = `${bullet.offsetTop - 10}px`;
    if (bullet.offsetTop < 0) {
      bullet.remove();
      bullets.splice(index, 1);
    }
    rocks.forEach((rock, rockIndex) => {
      if (isCollision(bullet, rock)) {
        bullet.remove();
        bullets.splice(index, 1);
        rock.remove();
        rocks.splice(rockIndex, 1);
        score++;
        scoreBoard.textContent = `Score: ${score}`;
      }
    });
  });
}
function isCollision(bullet, rock) {
  const bulletRect = bullet.getBoundingClientRect();
  const rockRect = rock.getBoundingClientRect();
  return !(
    bulletRect.top > rockRect.bottom ||
    bulletRect.bottom < rockRect.top ||
    bulletRect.right < rockRect.left ||
    bulletRect.left > rockRect.right
  );
}
function isCollision2(player, bullet2) {
  const playerRect = player.getBoundingClientRect();
  const bullet2Rect = bullet2.getBoundingClientRect();
  return !(
    playerRect.top > bullet2Rect.bottom ||
    playerRect.bottom < bullet2Rect.top ||
    playerRect.right < bullet2Rect.left ||
    playerRect.left > bullet2Rect.right
  );
}
function isPlayerCollision(player, rock) {
  const playerRect = player.getBoundingClientRect();
  const rockRect = rock.getBoundingClientRect();
  return !(
    playerRect.top > rockRect.bottom ||
    playerRect.bottom < rockRect.top ||
    playerRect.right < rockRect.left ||
    playerRect.left > rockRect.right
  );
}
function handlePlayerCollision() {
  rocks.forEach((rock, index) => {
    if (isPlayerCollision(player, rock)) {
      endGame();
      rock.remove();
      rocks.splice(index, 1);
      audio.pause();
      score = 0;
      scoreBoard.textContent = `Score: ${score}`;
    }
  });
}
function handleBullet2Collision() {
  bullet2s.forEach((bullet2, bullet2Index) => {
    if (isCollision2(player, bullet2)) {
      bullet2.remove();
      bullet2s.splice(bullet2Index, 1);
      score += 5;
      scoreBoard.textContent = `Score: ${score}`;
      let intervalId = setInterval(createBullet, 190);
      player.style.backgroundColor = 'blue';
      player.style.transform = 'scale(0.5)';
      bullets.forEach((b) => (b.style.backgroundColor = 'blue'));
      document.getElementById('gameArea').style.background ='url(giphy.webp)';
      function changeInterval() {
        clearInterval(intervalId);
        intervalId = setInterval(createBullet, 300);
      }
      setTimeout(changeInterval, 9000);
      setTimeout(() => {
        clearInterval(intervalId);
        player.style.boxShadow =  '0, 2rem, 1rem, #ffdd00e1';
        player.style.transform = 'scale(1)';
        player.style.backgroundColor = '';
        bullets.forEach((b) => (b.style.backgroundColor = ''));
        document.getElementById('gameArea').style.background = 'lightgray';
      }, 20000);
    }
  });
}
function showGameOverModal(score) {
  const modal = document.getElementById('gameOverModal');
  const finalScore = document.getElementById('finalScore');
  finalScore.textContent = `Your final score is: ${score}`;
  modal.style.display = 'block';
  startButton.display = 'block';
  const closeButton = document.getElementsByClassName('close')[0];
  closeButton.onclick = function() {
    modal.style.display = 'none';
  };
  window.onclick = function(event) {
    if (event.target == modal) {
      modal.style.display = 'none';
    }
  };
}
function endGame() {
  // Assuming you have a variable `score` that holds the player's score
  showGameOverModal(score);
  clearInterval(gameInterval);
  clearInterval(createRockInterval);
  clearInterval(createBullet2Interval);
  cancelAnimationFrame(animationFrameId);
}
// Call `endGame` function when the game is over
function gameLoop() {
  movePlayer();
  moveBullets();
  moveRocks();
  moveBullet2();
  handleBullet2Collision();
  handlePlayerCollision();
  requestAnimationFrame(gameLoop);
}
function startGame() {
  startButton.style.display = 'none';
  gameArea.style.display = 'block';
  pauseButton.style.display = 'block';
  gameInterval = setInterval(createBullet, 300);
  createRockInterval = setInterval(createRock, 2000);
  createBullet2Interval = setInterval(createBullet2, 23000);
  setInterval(() => {
    if (rockSpeed  < 40) {
      rockSpeed += 10; // Increase rock speed every interval
    }
  }, 500);
  
  gameLoop();
}
function toggleSound() {
  if (audio.paused) {
    audio.play();
  } else {
    audio.pause();
  }
}
function togglePause() {
  if (pauseButton.textContent === 'Pause') {
    pauseButton.textContent = 'Play';
    clearInterval(gameInterval);
    clearInterval(createRockInterval);
    clearInterval(createBullet2Interval);
    audio.pause()
    cancelAnimationFrame(gameLoop);
  } else {
    audio.play() 
    pauseButton.textContent = 'Pause';
    gameInterval = setInterval(createBullet, 300);
    createRockInterval = setInterval(createRock, 2000);
    createBullet2Interval = setInterval(createBullet2, 25000);
    gameLoop();
  }
}