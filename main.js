//Game board
const GameBoard = (() => {
  const boardList = [
    ["", "", ""],
    ["", "", ""],
    ["", "", ""],
  ];

  const setField = (field) => {
    for (let row = 0; row < boardList.length; row++) {
      if (row === field.row) {
        for (let col = 0; col < boardList[row].length; col++) {
          if (col === field.col) {
            if (boardList[row][col] === "") {
              boardList[row][col] = field.sign;
            }
          }
        }
      }
    }
  };

  const resetBoard = () => {
    clearBoard();
    for (let row = 0; row < boardList.length; row++) {
      for (let col = 0; col < boardList[row].length; col++) {
        boardList[row][col] = "";
      }
    }
    loadBoard();
  };

  const clearBoard = () => {
    document.getElementById("GameBoard").innerHTML = "";
  };

  const loadBoard = () => {
    clearBoard();
    for (let row = 0; row < boardList.length; row++) {
      for (let col = 0; col < boardList[row].length; col++) {
        let x = document.createElement("button");
        x.textContent = boardList[row][col];
        document.getElementById("GameBoard").append(x);
      }
    }
  };

  const checkRow = () => {
    for (let row = 0; row < boardList.length; row++) {
      const currentRow = boardList[row];
      if (currentRow.every((el) => checkEqual(el, currentRow[0]))) {
        return true;
      }
    }
    return false;
  };

  const checkCol = () => {
    const col1 = boardList.map((row) => row[0]);
    const col2 = boardList.map((row) => row[1]);
    const col3 = boardList.map((row) => row[2]);
    const columns = [col1, col2, col3];

    for (let i = 0; i < columns.length; i++) {
      const col = columns[i];
      if (col.every((el) => checkEqual(el, col[0]))) {
        return true;
      }
    }
    return false;
  };

  const checkDiagonal = () => {
    const topLeft = boardList[0][0];
    const topRight = boardList[0][2];
    const middle = boardList[1][1];
    const bottomLeft = boardList[2][0];
    const bottomRight = boardList[2][2];

    const firstLine = [topLeft, middle, bottomRight];
    const secondLine = [topRight, middle, bottomLeft];

    if (firstLine.every((el) => checkEqual(el, firstLine[0]))) {
      return true;
    }
    if (secondLine.every((el) => checkEqual(el, secondLine[0]))) {
      return true;
    }
    return false;
  };

  const checkEqual = (el, sign) => {
    if (el === "") {
      return false;
    } else if (el === sign) {
      return true;
    }
  };

  const checkDraw = () => {
    for (let i = 0; i < boardList.length; i++) {
      for (let j = 0; j < boardList[i].length; j++) {
        const elem = boardList[i][j];
        if (elem === "") {
          return false;
        }
      }
    }
    return true;
  };

  const checkBoardForWin = () => {
    if (checkCol() || checkRow() || checkDiagonal()) {
      return "won";
    } else if (checkDraw()) {
      return "draw";
    }
  };

  return { setField, loadBoard, resetBoard, checkBoardForWin };
})();

//Helper functions factory methods
const player = (name, sign) => {
  return { name, sign };
};

const fieldFact = (row, col, sign) => {
  return { row, col, sign };
};

// Main Game
const Game = (() => {
  const player1 = player("player 1", "O");
  const player2 = player("player 2", "X");
  let currentPlayer;

  const gameContainer = document.getElementById("game");
  const resetButton = document.getElementById("restart-btn");
  const menuButton = document.getElementById("menu-btn");

  // Event listeners
  resetButton.addEventListener("click", () => {
    start(player1.name, player2.name);
  });

  menuButton.addEventListener("click", () => {
    changeDisplay(document.getElementById("startmenu"), "show");
    changeDisplay(gameContainer, "hide");
  });

  const setPlayersNames = (player1Name, player2Name) => {
    if (player1Name === "") {
      player1.name = "Player 1";
    } else {
      player1.name = player1Name;
    }

    if (player2Name === "") {
      player2.name = "Player 2";
    } else {
      player2.name = player2Name;
    }
  };

  const displayPlayersNames = () => {
    document.getElementById("player1").textContent = player1.name;
    document.getElementById("player2").textContent = player2.name;
  };

  const start = (player1Name, player2Name) => {
    document.getElementById("winContainer").innerHTML = "";
    changeDisplay(document.getElementById("overlay"), "hide");
    setPlayersNames(player1Name, player2Name);
    displayPlayersNames();
    currentPlayer = player1;
    GameBoard.resetBoard();
    GameBoard.loadBoard();
    setUpFieldEvent();
    changeDisplay(gameContainer, "show");
  };

  const setUpFieldEvent = () => {
    const fields = document
      .getElementById("GameBoard")
      .querySelectorAll("button");

    fields.forEach((field) => {
      if (field.textContent === "") {
        field.addEventListener("click", () => {
          const indexOfField = Array.from(fields).indexOf(field);
          const row = Math.floor(indexOfField / 3);
          const col = indexOfField % 3;
          GameBoard.setField(fieldFact(row, col, currentPlayer.sign));
          GameBoard.loadBoard();
          setWin(currentPlayer);
          setUpFieldEvent();
          changePlayer();
        });
      }
    });
  };

  const setWin = (currentPlayer) => {
    if (GameBoard.checkBoardForWin() === "won") {
      const winningPlayer = `${currentPlayer.name} has won!`;
      createWinBox(winningPlayer);
    } else if (GameBoard.checkBoardForWin() === "draw") {
      createWinBox("Draw");
    }
  };

  const createWinBox = (thing) => {
    const winContainer = document.getElementById("winContainer");
    const h1 = document.createElement("h1");
    h1.textContent = thing;
    const resetBtn = document.createElement("button");
    resetBtn.textContent = "Reset";
    resetBtn.addEventListener("click", () => {
      start(player1.name, player2.name);
    });

    winContainer.append(h1, resetBtn);
    changeDisplay(document.getElementById("overlay"), "show");
  };

  const changePlayer = () => {
    if (currentPlayer === player1) {
      currentPlayer = player2;
    } else if (currentPlayer === player2) {
      currentPlayer = player1;
    }
  };

  return { start };
})();

const form = document.getElementById("startmenu");
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const player1Name = form.elements["player1Name"].value;
  const player2Name = form.elements["player2Name"].value;
  changeDisplay(form, "hide");
  Game.start(player1Name, player2Name);
  form.reset();
});

function changeDisplay(elem, atrib) {
  if (atrib === "show") {
    if (elem.classList.contains("hide")) {
      elem.classList.remove("hide");
      elem.classList.add("show");
    } else {
      elem.classList.add("show");
    }
  }

  if (atrib === "hide") {
    if (elem.classList.contains("show")) {
      elem.classList.remove("show");
      elem.classList.add("hide");
    } else {
      elem.classList.add("hide");
    }
  }
}
