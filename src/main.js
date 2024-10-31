import { initDevtools } from "@pixi/devtools";
import { Application, Graphics } from "pixi.js";

const MODES = {
  // The game ends if the snake hits the edge of the game field or its own body
  CLASSIC: "CLASSIC",
  // The snake can't die. It passes through its own body and goes through the wall
  GOD: "GOD",
  // When the snake eats food, new food spawns, and one wall cell also spawns in a random place on the field
  WALLS: "WALLS",
  // At the same time on field have two cell of food. When snake eat one of them,
  // she spawn in second food cell and save direction. The body movement is gradual, not all at once, one step, one cell of the body
  PORTAL: "PORTAL",
  // When the snake eats food, it speeds up by 10%
  SPEED: "SPEED",
};

(async () => {
  const gameContainer = document.getElementById("game-container");
  if (!gameContainer) return;

  const app = new Application();
  await app.init({
    backgroundColor: 0x000000,
  });
  initDevtools({ app });

  gameContainer.appendChild(app.canvas);

  const snakeSize = 20;
  let snake = [{ x: 2, y: 2 }];
  let direction = { x: 1, y: 0 };
  let food = { x: 5, y: 5 };
  let score = 0;

  // Set the speed of the game (in milliseconds)
  const speed = 5000; // Adjust this value to increase or decrease speed
  let lastUpdateTime = 0;

  const drawSnake = () => {
    app.stage.removeChildren();

    snake.forEach((segment, index) => {
      const snakePart = new Graphics()
        .rect(
          segment.x * snakeSize,
          segment.y * snakeSize,
          snakeSize,
          snakeSize
        )
        .fill(index === 0 ? 0x00ff00 : 0xffffff);

      app.stage.addChild(snakePart);
    });
  };

  const drawFood = () => {
    const foodGraphics = new Graphics()
      .rect(food.x * snakeSize, food.y * snakeSize, snakeSize, snakeSize)
      .fill(0xff0000);

    app.stage.addChild(foodGraphics);
  };

  const moveSnake = () => {
    const head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };
    snake.unshift(head);

    // Check if snake eats food
    if (head.x === food.x && head.y === food.y) {
      score++;
      spawnFood();
    } else {
      snake.pop();
    }

    // Check for collisions with walls or itself
    if (
      head.x < 0 ||
      head.x >= app.screen.width / snakeSize ||
      head.y < 0 ||
      head.y >= app.screen.height / snakeSize ||
      snake
        .slice(1)
        .some((segment) => segment.x === head.x && segment.y === head.y)
    ) {
      resetGame();
    }
  };

  const spawnFood = () => {
    food.x = Math.floor(Math.random() * (app.screen.width / snakeSize));
    food.y = Math.floor(Math.random() * (app.screen.height / snakeSize));
  };

  const resetGame = () => {
    snake = [{ x: 2, y: 2 }];
    direction = { x: 1, y: 0 };
    score = 0;
    spawnFood();
  };

  const update = (time) => {
    // Update snake position based on the speed
    lastUpdateTime += time.deltaTime;
    if (lastUpdateTime >= speed / 1000) {
      // Convert speed to seconds
      moveSnake();
      drawSnake();
      drawFood();
      lastUpdateTime = 0;
    }
  };

  const keyDownHandler = (event) => {
    switch (event.key) {
      case "ArrowUp":
        if (direction.y === 0) direction = { x: 0, y: -1 };
        break;
      case "ArrowDown":
        if (direction.y === 0) direction = { x: 0, y: 1 };
        break;
      case "ArrowLeft":
        if (direction.x === 0) direction = { x: -1, y: 0 };
        break;
      case "ArrowRight":
        if (direction.x === 0) direction = { x: 1, y: 0 };
        break;
    }
  };

  window.addEventListener("keydown", keyDownHandler);
  spawnFood();
  app.ticker.add(update);
})();
