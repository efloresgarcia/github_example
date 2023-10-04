// Define the number of rows and columns
const numRows = 4;
const numCols = 3;

// This array holds all of the Square objects which make up the grid
let grid = [];

// This array keeps track of the Square objects you click on for the purpose of determining if you click two of the same color (i.e. they match)
let clickedSquares = [];

// This defines the Square class. It keeps track of the location, width, and size of each of the squares, as well as their color and if they are notMatched or not. By default, their visibility will be set to true because we want them all to display in the beginning
class Square {
  constructor(x, y, w, h, color) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.color = color;
    this.notMatched = true;
    this.revealed = false;
  }

  // The square class also contains a simple display function, where if the square hasn't been notMatched yet (i.e. notMatched == true), then it sets the square's fill color and draws it at its location
  display() {
    if (this.notMatched) {
      if (this.revealed) {
        fill(this.color);
      } else {
        fill(255);
      }

      rect(this.x, this.y, this.w, this.h);
    }
  }

  // Check if the given coordinates are inside the square
  contains(x, y) {
    return (
      x > this.x && x < this.x + this.w && y > this.y && y < this.y + this.h
    );
  }
}

let gameStartTime; // Variable to store the start time of the game
const gameTime = 2 * 60 * 1000; // Two minutes in milliseconds
let gameOver = false; // Game over flag
let allSquaresnotMatched = false; // Flag to check if all squares have been notMatched
let mouseInteracted = false; // Flag to track mouse interaction
let countdown = gameTime; // Initial countdown time in milliseconds

function setup() {
  createCanvas(600, 400);
  resetGame();

  // Create a reset button
  const resetButton = createButton("Reset");
  resetButton.position(20, 20);
  resetButton.mousePressed(resetButtonClicked);
}

function resetGame() {
  // Calculate the size of each square based on the canvas size and number of rows/columns
  const squareWidth = width / numCols;
  const squareHeight = height / numRows;

  // This array is used to give the squares their colors
  let colors = [];

  // Generate pairs of colors and add them to the colors array
  for (let i = 0; i < (numRows * numCols) / 2; i++) {
    const randomColor = color(random(255), random(255), random(255));
    colors.push(randomColor);
    colors.push(randomColor); // Add a pair of the same color
  }

  // This shuffles the colors array, thus randomizing the grid's initial appearance
  shuffle(colors, true);

  // This nested for loop creates a numRows x numCols grid of square objects to populate the grid
  grid = []; // Clear the grid
  for (let i = 0; i < numCols; i++) {
    for (let j = 0; j < numRows; j++) {
      // This takes the last value off the color array, (which we then use to set the color of the square)
      let col = colors.pop();

      // Adds a new square object to the grid array
      grid.push(
        new Square(
          i * squareWidth,
          j * squareHeight,
          squareWidth,
          squareHeight,
          col
        )
      );
    }
  }

  gameStartTime = millis(); // Record the start time of the game
  gameOver = false; // Reset the game over flag
  allSquaresnotMatched = false; // Reset the all squares notMatched flag
  mouseInteracted = false; // Reset the mouse interaction flag
  countdown = gameTime; // Reset the countdown time
}

function draw() {
  background(0);

  if (!gameOver) {
    // Use a for loop to display all the squares in the grid array
    for (let square of grid) {
      square.display();
    }

    // Check if all squares have disappeared
    allSquaresnotMatched = grid.every((square) => !square.notMatched);

    // Check if the game time has exceeded 2 minutes or all squares are notMatched
    if (millis() - gameStartTime > gameTime || allSquaresnotMatched) {
      if (allSquaresnotMatched) {
        // Display "Continue" screen (green)
        fill(0, 255, 0); // Green color
        rect(0, 0, width, height);
        fill(255); // White text color
        textSize(48);
        textAlign(CENTER, CENTER);
        text("Continue", width / 2, height / 2);
      } else {
        // Display "Game Over" screen (red)
        fill(255, 0, 0); // Red color
        rect(0, 0, width, height);
        fill(255); // White text color
        textSize(48);
        textAlign(CENTER, CENTER);
        text("Game Over", width / 2, height / 2);
      }
    } else {
      // Update and display the countdown timer
      countdown = gameTime - (millis() - gameStartTime);
      const seconds = Math.ceil(countdown / 1000);
      fill(0);
      textSize(24);
      textAlign(CENTER);
      text(`Time Remaining: ${seconds} seconds`, width / 2, 20);
    }
  } else {
    // Check if the mouse is clicked within any square
    for (let square of grid) {
      if (square.contains(mouseX, mouseY)) {
        square.notMatched = true; // Show the square again
        gameOver = false; // Reset the game over flag
        break; // Break the loop, no need to check other squares
      }
    }
  }
}

// Reset the game when the reset button is clicked
function resetButtonClicked() {
  resetGame();
}

// Resize canvas when the window is resized
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

// Handle mouse click
function mouseClicked() {
  if (!gameOver) {
    for (let square of grid) {
      if (square.contains(mouseX, mouseY) && square.notMatched) {
        clickedSquares.push(square);
        square.revealed = true;

        if (clickedSquares.length === 3) {
          if (
            clickedSquares[0].color.toString() ===
            clickedSquares[1].color.toString()
          ) {
            // Trigger the flip animation for notMatched squares
            clickedSquares[0].notMatched = false;
            clickedSquares[1].notMatched = false;
          } else {
            clickedSquares[0].revealed = false;
            clickedSquares[1].revealed = false;
            clickedSquares[2].revealed = false;
          }

          clickedSquares = [];
        }
      }
    }
  }
}
