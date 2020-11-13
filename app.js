console.log('game set, and match');

const gameboard = document.getElementById('game-board');

let lastRenderTime = 0;
const SNAKE_SPEED = 5;
let snakeBody = [{x:10, y:11}];
let inputDirection = {x:0, y:0};
let lastInputDir = {x:0, y:0};
let food = getRandomFoodPos();
const EXPANSION_RATE = 1;
let newSegments = 0;
gameOver = false;
const GRID_SIZE = 21;

function InputDir() {

   window.addEventListener('keydown', e => {
   switch(e.key) {
      case 'ArrowUp':
         if (lastInputDir.y !== 0) break;
         inputDirection = {x: 0, y: -1};
         console.log('i was pressed');
         break;
      case 'ArrowDown':
         if (lastInputDir.y !== 0) break;
         inputDirection = {x: 0, y: 1};
         break;
      case 'ArrowLeft':
         if (lastInputDir.x !== 0) break;
         inputDirection = {x: -1, y: 0};
         break;
      case 'ArrowRight':
         if (lastInputDir.x !== 0) break;
         inputDirection = {x: 1, y: 0};
         break;
   }
})

   lastInputDir = inputDirection;
   return inputDirection;
}

function randomGridPos() {
   let gridSize = 21;
   return {
      x: Math.floor(Math.random() * gridSize) + 1,
      y: Math.floor(Math.random() * gridSize) + 1
   }
}

function main(currentTime) {

   if(gameOver) {
      if(confirm('you lost. press okay to restart')) {
         window.location = 'file:///home/wanker/projects/snake%20game/index.html'
      }
      return;
   }

   window.requestAnimationFrame(main);
   const sceondsSinceLastRender = (currentTime - lastRenderTime) / 1000;
   if(sceondsSinceLastRender < 1 / SNAKE_SPEED) return;
   console.log("render");
   lastRenderTime = currentTime;
   update();
   draw(gameboard);
};

window.requestAnimationFrame(main);

function expandSnake(amount) {
   newSegments += amount;

}

function onSnake(pos, {ingnoreHead = false} = {}) {
   return snakeBody.some((segment, index) => {
      if(ingnoreHead && index === 0) {
         return false;
      }
      return equalPos(segment,pos);
   });
};

function equalPos(pos1, pos2) {
   return pos1.y === pos2.y && pos1.x === pos2.x;
}

function addSegments() {
   for(let i = 0; i < newSegments; i++) {
      snakeBody.push({...snakeBody[snakeBody.length - 1]});
   }

   newSegments = 0;
}

function getRandomFoodPos() {
   let newFoodPos;
   while(newFoodPos == null || onSnake(newFoodPos)) {
      newFoodPos = randomGridPos();
   }
   return newFoodPos;
}

function checkDeath() {
    gameOver = outsideGrid(getSnakeHead()) || selfIntersect()
}

function outsideGrid(pos) {
   return (
      pos.x < 1 || pos.x > GRID_SIZE || pos.y < 1 || pos.y > GRID_SIZE
   )
}

function getSnakeHead() {
   return snakeBody[0];
}

function selfIntersect() {
   return onSnake(snakeBody[0], {ingnoreHead: true}); 
}

function update() {
   addSegments();
   const input = InputDir();
   for(let i = snakeBody.length - 2; i >= 0; i--) {
      snakeBody[i + 1] = {...snakeBody[i]};
   }   
    
   snakeBody[0].x += input.x;
   snakeBody[0].y += input.y;

   if(onSnake(food)) {
      expandSnake(EXPANSION_RATE);
      food = getRandomFoodPos();
   }

   checkDeath();
};


function draw() {
   gameboard.innerHTML = '';
   drawSnake(gameboard);
   drawFood(gameboard);
   function drawSnake(gameboard) {
      snakeBody.forEach(segment => {
         const SNAKE_ELEMENT = document.createElement('div');
         SNAKE_ELEMENT.style.gridRowStart = segment.y;
         SNAKE_ELEMENT.style.gridColumnStart = segment.x;
         SNAKE_ELEMENT.classList.add('snake');
         gameboard.appendChild(SNAKE_ELEMENT);
      })
   }
   function drawFood(gameboard) {
      snakeBody.forEach(segment => {
         const FOOD_ELEMENT = document.createElement('div');
         FOOD_ELEMENT.style.gridRowStart = food.y;
         FOOD_ELEMENT.style.gridColumnStart = food.x;
         FOOD_ELEMENT.classList.add('food');
         gameboard.appendChild(FOOD_ELEMENT);
      });
   }
}
