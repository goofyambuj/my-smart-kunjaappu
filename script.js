
const welcome = document.getElementById("welcome");
const puzzlePage = document.getElementById("puzzlePage");
const congratsPage = document.getElementById("congratsPage");

const board = document.getElementById("puzzleBoard");
const moveCounter = document.getElementById("moveCounter");
const puzzleMessage = document.getElementById("puzzleMessage");

const ROWS = 8;
const COLS = 4;
const TOTAL = ROWS * COLS;
const IMAGE = "assets/photo8.jpeg";

let tiles = [];
let moves = 0;

function showPage(page) {
  [welcome, puzzlePage, congratsPage].forEach(section => {
    section.hidden = section !== page;
    section.classList.toggle("active", section === page);
  });

  window.scrollTo({ top: 0, behavior: "smooth" });
}

function isSolved() {
  return tiles.every((tile, index) => tile === index);
}

function canMove(index) {
  const empty = tiles.indexOf(TOTAL - 1);

  const row = Math.floor(index / COLS);
  const col = index % COLS;

  const emptyRow = Math.floor(empty / COLS);
  const emptyCol = empty % COLS;

  return (
    Math.abs(row - emptyRow) +
    Math.abs(col - emptyCol)
  ) === 1;
}

function updateCounter() {
  moveCounter.textContent =
    `Moves: ${moves}`;

  const correct = tiles.filter(
    (tile, index) => tile === index
  ).length;

  puzzleMessage.textContent =
    `${correct} of ${TOTAL} pieces in the correct position.`;
}

function renderBoard() {
  board.replaceChildren();

  tiles.forEach((value, index) => {
    const tile = document.createElement("button");

    tile.type = "button";
    tile.className = "puzzle-tile";

    if (value === TOTAL - 1) {
      tile.classList.add("empty");
      tile.disabled = true;
      tile.setAttribute("aria-label", "Empty space");
    } else {
      const row = Math.floor(value / COLS);
      const col = value % COLS;

      tile.style.backgroundImage =
        `url("${IMAGE}")`;

      tile.style.backgroundSize =
        `${COLS * 100}% ${ROWS * 100}%`;

      tile.style.backgroundPosition =
        `${col / (COLS - 1) * 100}% ` +
        `${row / (ROWS - 1) * 100}%`;

      tile.setAttribute(
        "aria-label",
        `Tile ${value + 1}`
      );

      if (canMove(index)) {
        tile.style.cursor = "pointer";
      }

      tile.addEventListener("click", () => {
        moveTile(index);
      });
    }

    board.appendChild(tile);
  });

  updateCounter();
}

function moveTile(index) {
  if (!canMove(index)) {
    puzzleMessage.textContent =
      "Choose a tile beside the empty space ♡";
    return;
  }

  const empty = tiles.indexOf(TOTAL - 1);

  [tiles[index], tiles[empty]] =
    [tiles[empty], tiles[index]];

  moves++;

  renderBoard();

  if (isSolved()) {
    puzzleMessage.textContent =
      "You did it! Opening your surprise…";

    setTimeout(() => {
      showPage(congratsPage);
    }, 700);
  }
}

function shufflePuzzle() {
  // Start solved, then perform legal moves.
  // This guarantees the puzzle is solvable.
  tiles = Array.from(
    { length: TOTAL },
    (_, index) => index
  );

  let previousEmpty = -1;

  for (let step = 0; step < 260; step++) {
    const empty = tiles.indexOf(TOTAL - 1);

    const row = Math.floor(empty / COLS);
    const col = empty % COLS;

    const possible = [];

    if (row > 0) possible.push(empty - COLS);
    if (row < ROWS - 1) possible.push(empty + COLS);
    if (col > 0) possible.push(empty - 1);
    if (col < COLS - 1) possible.push(empty + 1);

    const choices = possible.filter(
      index => index !== previousEmpty
    );

    const options = choices.length
      ? choices
      : possible;

    const next =
      options[Math.floor(Math.random() * options.length)];

    [tiles[empty], tiles[next]] =
      [tiles[next], tiles[empty]];

    previousEmpty = empty;
  }

  if (isSolved()) {
    [tiles[0], tiles[1]] = [tiles[1], tiles[0]];
  }

  moves = 0;
  renderBoard();

  puzzleMessage.textContent =
    "Fresh shuffle! Find where every piece belongs.";
}

document.getElementById("startButton")
  .addEventListener("click", () => {
    showPage(puzzlePage);

    if (tiles.length === 0) {
      shufflePuzzle();
    }
  });

document.getElementById("shuffleButton")
  .addEventListener("click", shufflePuzzle);

document.getElementById("backButton")
  .addEventListener("click", () => {
    showPage(welcome);
  });

document.getElementById("replayButton")
  .addEventListener("click", () => {
    showPage(puzzlePage);
    shufflePuzzle();
  });
