// Tilemap and character state
let canvas, ctx;
let tileSize = 32;
let player = {
  x: 5, // Grid position (starting position in pixels will be calculated)
  y: 5,
  width: 32,
  height: 32,
  speed: 1,
};
let tileset = null;
let keys = {};

// Define the house layout as a 2D grid
// 0 = floor, 1 = wall, 2-15 = item locations
let houseMap = [
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 2, 0, 3, 0, 0, 0, 4, 0, 5, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 6, 0, 7, 0, 0, 0, 8, 0, 9, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 1, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 10, 0, 11, 0, 0, 0, 1],
  [1, 0, 12, 0, 13, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 14, 0, 0, 0, 0, 0, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
];

// Initialize tilemap system
function initTilemap() {
  // Reset the map to ensure all items are present
  resetHouseMap();

  canvas = document.getElementById("gameCanvas");
  ctx = canvas.getContext("2d");

  // Set canvas size based on map
  canvas.width = houseMap[0].length * tileSize;
  canvas.height = houseMap.length * tileSize;

  // Reset player position
  player.x = 5 * tileSize;
  player.y = 5 * tileSize;

  // Load tileset image (optional - currently using colored rectangles)
  tileset = new Image();
  tileset.src = "asset/tiles.png";
  tileset.onload = () => {
    console.log("Tileset loaded");
  };

  // Setup keyboard controls
  document.addEventListener("keydown", (e) => {
    keys[e.key] = true;
    e.preventDefault();
  });

  document.addEventListener("keyup", (e) => {
    keys[e.key] = false;
  });

  // Start game loop
  gameLoop();
}

// Game loop for tilemap rendering
function gameLoop() {
  updatePlayer();
  drawGame();
  requestAnimationFrame(gameLoop);
}

// Update player position based on keyboard input
function updatePlayer() {
  let newX = player.x;
  let newY = player.y;

  if (keys["ArrowUp"] || keys["w"] || keys["W"]) {
    newY -= player.speed;
  }
  if (keys["ArrowDown"] || keys["s"] || keys["S"]) {
    newY += player.speed;
  }
  if (keys["ArrowLeft"] || keys["a"] || keys["A"]) {
    newX -= player.speed;
  }
  if (keys["ArrowRight"] || keys["d"] || keys["D"]) {
    newX += player.speed;
  }

  // Collision detection with walls
  if (canMove(newX, newY)) {
    player.x = newX;
    player.y = newY;

    // Check if player is on an item
    checkItemCollection();
  }
}

// Check if player can move to a position (no walls)
function canMove(x, y) {
  // Calculate tile coordinates for all corners of the player
  const left = Math.floor(x / tileSize);
  const right = Math.floor((x + player.width - 1) / tileSize);
  const top = Math.floor(y / tileSize);
  const bottom = Math.floor((y + player.height - 1) / tileSize);

  // Check bounds
  if (
    left < 0 ||
    right >= houseMap[0].length ||
    top < 0 ||
    bottom >= houseMap.length
  ) {
    return false;
  }

  // Check all corners for walls
  if (
    houseMap[top][left] === 1 ||
    houseMap[top][right] === 1 ||
    houseMap[bottom][left] === 1 ||
    houseMap[bottom][right] === 1
  ) {
    return false;
  }

  return true;
}

// Check if player is touching an item
function checkItemCollection() {
  const tileX = Math.floor((player.x + player.width / 2) / tileSize);
  const tileY = Math.floor((player.y + player.height / 2) / tileSize);

  const tileValue = houseMap[tileY][tileX];
  if (tileValue >= 2 && tileValue <= 15) {
    const itemId = tileValue;
    collectItemById(itemId);
  }
}

// Collect item by ID (calls function from game.js)
function collectItemById(itemId) {
  const item = items.find((i) => i.id === itemId);
  if (!item) return;

  if (collectedItems.find((i) => i.id === item.id)) return;

  if (collectedItems.length >= 8) {
    // Flash message on canvas
    return;
  }

  collectedItems.push(item);

  // Remove item from map
  for (let y = 0; y < houseMap.length; y++) {
    for (let x = 0; x < houseMap[y].length; x++) {
      if (houseMap[y][x] === itemId) {
        houseMap[y][x] = 0;
      }
    }
  }

  document.getElementById("backpack-count").textContent = collectedItems.length;
  updateBackpackDisplay();

  if (collectedItems.length === 8) {
    setTimeout(() => {
      if (confirm("🎒 Backpack full! Ready to face the flood?")) {
        endPreparation();
      }
    }, 300);
  }
}

// Draw the game
function drawGame() {
  // Clear canvas
  ctx.fillStyle = "#2c2c2c";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Draw tiles
  for (let y = 0; y < houseMap.length; y++) {
    for (let x = 0; x < houseMap[y].length; x++) {
      const tile = houseMap[y][x];

      if (tile === 1) {
        // Wall
        ctx.fillStyle = "#8B4513";
        ctx.fillRect(x * tileSize, y * tileSize, tileSize, tileSize);
        ctx.strokeStyle = "#654321";
        ctx.strokeRect(x * tileSize, y * tileSize, tileSize, tileSize);
      } else if (tile === 0) {
        // Floor
        ctx.fillStyle = "#D2B48C";
        ctx.fillRect(x * tileSize, y * tileSize, tileSize, tileSize);
        ctx.strokeStyle = "#C19A6B";
        ctx.strokeRect(x * tileSize, y * tileSize, tileSize, tileSize);
      } else {
        // Item tile
        ctx.fillStyle = "#D2B48C";
        ctx.fillRect(x * tileSize, y * tileSize, tileSize, tileSize);

        // Draw item icon
        const item = items.find((i) => i.id === tile);
        if (item) {
          ctx.font = "24px Arial";
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText(
            item.icon,
            x * tileSize + tileSize / 2,
            y * tileSize + tileSize / 2
          );
        }
      }
    }
  }

  // Draw player
  ctx.fillStyle = "#FFD700";
  ctx.fillRect(player.x, player.y, player.width, player.height);
  ctx.strokeStyle = "#FFA500";
  ctx.lineWidth = 2;
  ctx.strokeRect(player.x, player.y, player.width, player.height);

  // Draw player face
  ctx.fillStyle = "#000";
  ctx.fillRect(player.x + 8, player.y + 10, 4, 4); // Left eye
  ctx.fillRect(player.x + 20, player.y + 10, 4, 4); // Right eye
  ctx.beginPath();
  ctx.arc(player.x + 16, player.y + 22, 6, 0, Math.PI); // Smile
  ctx.stroke();
}

// Reset the map when starting a new game
function resetHouseMap() {
  houseMap = [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 2, 0, 3, 0, 0, 0, 4, 0, 5, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 6, 0, 7, 0, 0, 0, 8, 0, 9, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 1, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 10, 0, 11, 0, 0, 0, 1],
    [1, 0, 12, 0, 13, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 14, 0, 0, 0, 0, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  ];
}
