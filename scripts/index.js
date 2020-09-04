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

let goAgain = false;
let cellIndices = [0, 1, 2, 3, 4, 5, 6, 7, 8];
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

    //event listener on game start button

    gameStart.addEventListener("click", () => {
      p1Name = document.querySelector(".player1-name").value;
      p2Name = document.querySelector(".player2-name").value;

      if (p1Name === "" || p2Name === "") {
        document.querySelector(".input-error").innerText =
          "Please Enter your Name(s)";
      } else {
        //game started if both players entered name
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

      // console.log("user selected tic");
      userClass = "tic";
      computerClass = "x";
      cellElements.forEach((cell) => {
        cell.classList.add("game-started");
      });
    } else if (e.target.classList.contains("x-mark")) {
      markContainer.style.display = "none";

      // console.log("user selected x");
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
  console.log(e.target);
  currentClass = userTurn ? userClass : computerClass;

  // placeMark
  placeMark(cell, currentClass);

  //checkwin
  if (checkWin(currentClass)) {
    currentClass == userClass
      ? (winMessage.innerText = p1Name + " wins")
      : (winMessage.innerText = "Computer wins");

    // if (goAgain) {
    //   console.log("starteg again");
    // }

    cellElements.forEach((cell) => {
      cell.classList.add("game-finished");
      cell.removeEventListener("click", pvcClickHandler);
    });

    let winRow = winCells(currentClass);

    winRow.forEach((index) => {
      cellElements[index].style.backgroundColor = "rgba(20, 240, 20, 0.685)";
    });

    // storing array with eining combination cells' indices

    /*---------------------------------------------------------------------------
                                   REPLAY
    -------------------------------------------------------------------------- */

    setTimeout(playAgainPVC, 1000);
  }

  //-------------- Play Again

  function playAgainPVC() {
    document.querySelector(".wrapper").classList.add("wrapper-active");
    const restart = document.querySelector(".yes");
    const finish = document.querySelector(".no");

    restart.addEventListener("click", () => {
      document.querySelector(".wrapper").classList.remove("wrapper-active");
      goAgain = true;
      cellElements.forEach((cell) => {
        cell.style.backgroundColor = "transparent";
        cell.innerHTML = "";
        cell.classList.remove("game-finished", "tic", "x", "game-started");
      });
      startGamePvC();
      cellIndices = [0, 1, 2, 3, 4, 5, 6, 7, 8];
    });

    // remove all html from body on not restarting the game
    finish.addEventListener("click", () => {
      document.querySelector("body").innerHTML = "";
    });
  }

  //removeIndex

  removeIndex(cell);
}

function removeIndex(cell) {
  //remove clicked index from cellIndices
  cellIndices.forEach((index) => {
    if (cell.classList.contains(index)) {
      cellIndices.splice(cellIndices.indexOf(index), 1);
    }
  });
  computerTurn(cellIndices);
}

function computerTurn(cellIndices) {
  // function to add ccomputer mark at random cells

  //generating random number between current length of cellIndices
  let computerMark = Math.floor(Math.random() * cellIndices.length);

  let index = cellIndices[computerMark];

  //adding computer class to the randomly generated index
  cellElements[index].classList.add(computerClass);
  //removing element at randomly generated index
  cellIndices.splice(computerMark, 1);
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

  // added event handler to handle clicks on cells
  cellElements.forEach((cell) => {
    cell.classList.add("game-started");
    cell.addEventListener("click", pvpClickHandler, { once: true });
  });
}

function pvpClickHandler(e) {
  // function to handle click events on the board

  const cell = e.target;
  const currentClass = ticTurn ? ticClass : xClass;
  if (currentClass == "x") {
    console.log(p1Name);
    turnMessage.innerText = p1Name + `'s  turn`;
  } else {
    console.log(p2Name);
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
    winMessage.style.display = "block";
    turnMessage.style.display = "none";

    //play again?
    setTimeout(playAgainPVP, 1000);
  }

  //toggle turns
  toggleTurn();
}

function playAgainPVP() {
  document.querySelector(".wrapper").classList.add("wrapper-active");
  const restart = document.querySelector(".yes");
  const finish = document.querySelector(".no");

  restart.addEventListener("click", () => {
    p1Name = p1Name;
    p2Name = p2Name;
    winMessage.style.display = "none";
    turnMessage.style.display = "block";

    document.querySelector(".wrapper").classList.remove("wrapper-active");
    cellElements.forEach((cell) => {
      cell.style.backgroundColor = "transparent";
      cell.innerHTML = "";
      cell.classList.remove("game-finished", "tic", "x", "game-started");
    });

    startGamePvP();
  });

  // remove all html from body on not restarting the game
  finish.addEventListener("click", () => {
    document.querySelector("body").innerHTML = "";
  });
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
