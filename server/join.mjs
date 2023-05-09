import { METHOD } from "./constants.mjs";

// const maxNumberOfPlayers = 3;
const maxNumberOfPlayers = 2;
const assignColor = (index) => {
  const colorMap = {
    0: "#ffbdbd", // red
    1: "#8fd98f", // green
    2: "#adade8", // blue
  };

  return colorMap[index];
};

export function join(result, games, clients) {
  const { clientId, gameId } = result;

  const game = games[gameId];
  // if game already has enough number of players
  const len = game.clients.length;
  if (len >= maxNumberOfPlayers) return;

  const gameClient = {
    clientId,
    color: assignColor(len),
  };
  game.clients.push(gameClient);
  if (game.clients.length === maxNumberOfPlayers) {
    // start the game and update every 500ms
    broadcastGameState(game, clients);
  }

  const payLoad = {
    method: METHOD.join,
    game,
  };

  //loop through all clients and tell them that people has joined
  broadcastToAllClients(game, clients, payLoad);
}

function broadcastGameState(game, clients) {
  const payLoad = {
    method: METHOD.update,
    game,
  };

  broadcastToAllClients(game, clients, payLoad);

  setTimeout(broadcastGameState.bind(null, game, clients), 500);
}

function broadcastToAllClients(game, clients, payLoad) {
  game.clients.forEach((gameClient) => {
    const client = clients[gameClient.clientId];
    client.connection.send(JSON.stringify(payLoad));
  });
}
