/* ---------------------------------------Assignments and declarations-------------------------- */

const mode = document.getElementById("mode-select");
const board = document.getElementById("board");
const cellElements = document.querySelectorAll(".cell");
const winMessage = document.querySelector(".winning-message");
const playerInfo = document.querySelector(".input-container");
const gameStart = document.getElementById("start-game");
const p1Label = document.querySelector(".p1-name");
const p2Label = document.querySelector(".p2-name");
const turnMessage = document.querySelector(".turn-message");
const markContainer = document.querySelector(".mark-container");

const xClass = "x";
const ticClass = "tic";
const winCombinations = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];
const cellIndices = [0, 1, 2, 3, 4, 5, 6, 7, 8];

let p1Name = null;
let p2Name = null;
let userClass = null;
let computerClass = null;
let ticTurn = true;
let userTurn = true;

/*--------------------------------EVENT HANDLERS------------------------------------- */

mode.addEventListener("change", modeSelect);

/* ---------------------------------FUNCTIONS-------------------------------------*/

function modeSelect() {
  //function to start game according to mode selected
  mode.style.display = "none";
  if (mode.value == "pvp") {
    p1Label.style.display = "block";
    p2Label.style.display = "block";
    gameStart.style.display = "block";

    gameStart.addEventListener("click", () => {
      p1Name = document.querySelector(".player1-name").value;
      p2Name = document.querySelector(".player2-name").value;

      if (p1Name === "" || p2Name === "") {
        document.querySelector(".input-error").innerText =
          "Please Enter your Name(s)";
      } else {
        turnMessage.innerText = p1Name + `'s turn`;
        cellElements.forEach((cell) => {
          cell.classList.add("game-started");
        });

        startGamePvP();
      }
    });
  } else if (mode.value == "pvc") {
    p1Label.style.display = "block";
    gameStart.style.display = "block";
    gameStart.addEventListener("click", () => {
      p1Name = document.querySelector(".player1-name").value;

      if (p1Name === "") {
        document.querySelector(".input-error").innerText =
          "Please Enter your Name";
      } else {
        startGamePvC();
      }
    });
  }
}

/*-------------------------------------------------------------------------------------------------------------------------
                                                      PVC Code
---------------------------------------------------------------------------------------------------------------------------*/

function startGamePvC() {
  //function to start PVC game
  document.querySelector(".input-error").style.display = "none";
  document.querySelector(".mark-select-heading").style.display = "block";
  p1Label.style.display = "none";
  gameStart.style.display = "none";
  markContainer.style.display = "block";

  //listening to clicks on mark container
  markContainer.addEventListener("click", (e) => {
    document.querySelector(".mark-select-heading").style.display = "none";
    if (e.target.classList.contains("tic-mark")) {
      markContainer.style.display = "none";
      userClass = "tic";
      computerClass = "x";
      cellElements.forEach((cell) => {
        cell.classList.add("game-started");
      });
    } else if (e.target.classList.contains("x-mark")) {
      markContainer.style.display = "none";
      userClass = "x";
      computerClass = "tic";
      cellElements.forEach((cell) => {
        cell.classList.add("game-started");
      });
    }
  });

  cellElements.forEach((cell) => {
    cell.addEventListener("click", pvcClickHandler, { once: true });
  });
}

function pvcClickHandler(e) {
  const cell = e.target;
  currentClass = userTurn ? userClass : computerClass;

  // placeMark
  placeMark(cell, currentClass);

  //checkwin
  if (checkWin(currentClass)) {
    currentClass == userClass
      ? (winMessage.innerText = p1Name + " wins")
      : (winMessage.innerText = "Computer wins");

    cellElements.forEach((cell) => {
      cell.classList.add("game-finished");
      cell.removeEventListener("click", pvcClickHandler);
    });

    let winRow = winCells(currentClass);

    winRow.forEach((index) => {
      cellElements[index].style.backgroundColor = "rgba(20, 240, 20, 0.685)";
    });
  }

  //removeIndex

  removeIndex(cell);

  //toggle turn

  toggleTurn();

  //remove clicked index from cellIndices
  //
}

function removeIndex(cell) {
  cellIndices.forEach((index) => {
    if (cell.classList.contains(index)) {
      cellIndices.splice(cellIndices.indexOf(index), 1);
    }
  });
  console.log(cellIndices);
}

/*----------------------------------------------------------------------------------------------------
                                              PVP CODE
----------------------------------------------------------------------------------------------------*/

function startGamePvP() {
  //function to start pvp starting game

  document.querySelector(".input-error").style.display = "none";
  p1Label.style.display = "none";
  p2Label.style.display = "none";
  gameStart.style.display = "none";

  cellElements.forEach((cell) => {
    cell.addEventListener("click", pvpClickHandler, { once: true });
  });
}

function pvpClickHandler(e) {
  // function to handle click events on the board

  const cell = e.target;
  const currentClass = ticTurn ? ticClass : xClass;
  if (currentClass == "x") {
    turnMessage.innerText = p1Name + `'s  turn`;
  } else {
    turnMessage.innerText = p2Name + `'s  turn`;
  }

  //place mark on the board
  placeMark(cell, currentClass);

  //check for win
  if (checkWin(currentClass)) {
    currentClass == xClass
      ? (winMessage.innerText = p2Name + " wins")
      : (winMessage.innerText = p1Name + " wins");

    cellElements.forEach((cell) => {
      cell.classList.add("game-finished");
      cell.removeEventListener("click", pvpClickHandler);
    });

    let winRow = winCells(currentClass);

    winRow.forEach((index) => {
      cellElements[index].style.backgroundColor = "rgba(20, 240, 20, 0.685)";
    });

    turnMessage.style.display = "none";
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
  //toggle turn inn pvp
  ticTurn = !ticTurn;

  //toggle turn in pvc
  userTurn = !userTurn;
}

function winCells(currentClass) {
  // function to get cells of winning side
  return winCombinations.find((combination) => {
    return combination.every((index) => {
      return cellElements[index].classList.contains(currentClass);
    });
  });
}
