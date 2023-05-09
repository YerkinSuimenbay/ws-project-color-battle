const createBtn = document.querySelector("button#create-btn");
const shareGameContainer = document.querySelector(".share-game-container");
const aLink = shareGameContainer.querySelector("#share-link");
const joinBtn = document.querySelector("button#join-btn");
const gameIdInput = document.querySelector("input#gameIdInput");
const $players = document.querySelector("div.players");
const $board = document.querySelector("div.board");
const $boardCells = document.querySelector("div.board__cells");
const $copyBtn = document.querySelector("button#copy-btn");

let clientId = null;
let playerColor = null;

const wsUrl = "ws://localhost:5050";
const ws = new WebSocket(wsUrl);

ws.onmessage = (event) => {
  const response = JSON.parse(event.data);

  if (response.method === "connect") {
    console.log(`Client created: \n${response.clientId}`);
    clientId = response.clientId;
    return;
  }

  if (response.method === "create") {
    console.log(`Game created: \n${response.game.id}`);

    aLink.textContent = response.game.id;
    aLink.addEventListener("click", () => {
      navigator.clipboard.writeText(aLink.textContent);
    });

    shareGameContainer.style.display = "block";
    return;
  }

  if (response.method === "join") {
    console.log(`Joined a game: \n${response.game.id}`);
    startTheGame(response.game);
    return;
  }

  if (response.method === "update") {
    console.log(`Update game: \n${response.game.id}`);

    const { game } = response;
    Object.entries(game.state).forEach((entry) => {
      const [cellId, cellColor] = entry;
      const $cell = document.querySelector(`.board__cell#${cellId}`);
      $cell.style.backgroundColor = cellColor;
    });

    return;
  }
};

ws.onclose = (event) => {
  console.log("WS CLOSED", event);
};

createBtn.addEventListener("click", () => {
  console.log("CREATING NEW GAME...");

  if (!clientId)
    return console.log("Error while creating new game: clientId not found");

  const payLoad = {
    method: "create",
    clientId,
  };

  ws.send(JSON.stringify(payLoad));
});

joinBtn.addEventListener("click", () => {
  console.log("JOINING A GAME...");

  if (!clientId)
    return console.log("Error while joining a game: clientId not found");

  if (!gameIdInput.value)
    return console.log("Error while joining a game: gameId not found");

  const payLoad = {
    method: "join",
    clientId,
    gameId: gameIdInput.value,
  };

  ws.send(JSON.stringify(payLoad));
});

function showPlayers(game) {
  // EMPTY THE DIV
  $players.innerHTML = ""; // BETTER WAY I GUESS
  // while ($players.firstChild) {
  //   $players.removeChild($players.firstChild);
  // }

  game.clients.forEach((gameClient) => {
    const $gameClientDiv = document.createElement("div");
    $gameClientDiv.innerText = gameClient.clientId;
    $gameClientDiv.style.backgroundColor = gameClient.color;
    $gameClientDiv.style.borderRadius = "5px";
    $gameClientDiv.style.padding = "10px";

    $players.appendChild($gameClientDiv);

    if (gameClient.clientId === clientId) {
      playerColor = gameClient.color;
    }
  });
}

function drawTheBoard(game) {
  // EMPTY THE DIV
  //   $players.innerHTML = ""; // BETTER WAY I GUESS
  while ($boardCells.firstChild) {
    $boardCells.removeChild($boardCells.firstChild);
  }

  for (let i = 1; i <= game.cells; i++) {
    const $cell = document.createElement("button");
    $cell.id = "cell-" + i;
    $cell.textContent = i;
    $cell.className = "board__cell";
    $cell.addEventListener("click", function (e) {
      $cell.style.backgroundColor = playerColor;

      const payLoad = {
        method: "play",
        // clientId,
        gameId: game.id,
        cellId: $cell.id,
        color: playerColor,
      };
      ws.send(JSON.stringify(payLoad));
    });

    $boardCells.appendChild($cell);

    $board.style.display = "block";
  }
}
function startTheGame(game) {
  showPlayers(game);
  drawTheBoard(game);
}
