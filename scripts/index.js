/* ---------------------------------------Assignments and declarations-------------------------- */

const mode = document.getElementById("mode-select");
const board = document.getElementById("board");
const cellElements = document.querySelectorAll(".cell");
const winMessage = document.querySelector(".winning-message");
const playerInfo = document.querySelector(".input-container");
const gameStart = document.getElementById("start-game");
const p1Label = document.querySelector(".p1-name");
const p2Label = document.querySelector(".p2-name");

const xClass = "x";
const ticClass = "tic";
const winCombinations = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [3, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

let p1Name = null;
let p2Name = null;
let ticTurn = true;

/*--------------------------------EVENT HANDLERS------------------------------------- */

mode.addEventListener("change", modeSelect);

/* ---------------------------------FUNCTIONS-------------------------------------*/

function modeSelect() {
  //function to start game according to mode selected
  if (mode.value == "pvp") {
    p1Label.style.display = "block";
    p2Label.style.display = "block";
    gameStart.style.display = "block";

    gameStart.addEventListener("click", (e) => {
      e.preventDefault();

      p1Name = document.querySelector(".player1-name").value;
      p2Name = document.querySelector(".player2-name").value;

      cellElements.forEach((cell) => {
        cell.classList.add("game-started");
      });

      startGamePvP();
    });
  }
}

function startGamePvP() {
  //function to start pvp starting game

  p1Label.style.display = "none";
  p2Label.style.display = "none";
  gameStart.style.display = "none";

  cellElements.forEach((cell) => {
    // cell.classList.add("game-started");
    cell.addEventListener("click", clickHandler, { once: true });
  });
}

function clickHandler(e) {
  // function to handle click events on the board

  const cell = e.target;
  const currentClass = ticTurn ? ticClass : xClass;

  //place mark on the board
  placeMark(cell, currentClass);

  //check for win
  if (checkWin(currentClass)) {
    winMessage.innerText = `${currentClass} wins`;

    cellElements.forEach((cell) => {
      cell.removeEventListener("click", clickHandler);
    });
    let winRow = winCells(currentClass);

    winRow.forEach((index) => {
      cellElements[index].style.backgroundColor = "rgba(20, 240, 20, 0.685)";
    });
  }

  //toggle turns
  toggleTurn();
}

function placeMark(cell, currentClass) {
  cell.classList.add(currentClass);
}

function checkWin(currentClass) {
  // function to check if any of the combination matches the marks
  return winCombinations.some((combination) => {
    return combination.every((index) => {
      return cellElements[index].classList.contains(currentClass);
    });
  });
}

function toggleTurn() {
  ticTurn = !ticTurn;
}

function winCells(currentClass) {
  // function to get cells of winning side
  return winCombinations.find((combination) => {
    return combination.every((index) => {
      return cellElements[index].classList.contains(currentClass);
    });
  });
}
