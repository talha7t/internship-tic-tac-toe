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

let ticTurn = true;

/*--------------------------------EVENT HANDLERS------------------------------------- */

// gameStart.addEventListener("click", (e) => {
//   e.preventDefault;
// });
mode.addEventListener("change", modeSelect);
/* ---------------------------------FUNCTIONS-------------------------------------*/

function modeSelect() {
  if (mode.value == "pvp") {
    // console.log("pvp");
    p1Label.style.display = "block";
    p2Label.style.display = "block";
    gameStart.style.display = "block";
    startGamePvP();
  }
}

function startGamePvP() {
  //starting game

  cellElements.forEach((cell) => {
    cell.addEventListener("click", clickHandler, { once: true });
  });
}

function clickHandler(e) {
  const cell = e.target;
  const currentClass = ticTurn ? ticClass : xClass;
  //place mark
  placeMark(cell, currentClass);

  //check for win
  if (checkWin(currentClass)) {
    winMessage.innerText = `${currentClass} wins`;
    console.log(winBack(currentClass));
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
let ins = [];
let winBack = (currentClass) => {
  ins.push(
    winCombinations.some((combination) => {
      combination.every((index) => {
        cellElements[index].classList.contains(currentClass);
      });
    })
  );

  return ins;
};
