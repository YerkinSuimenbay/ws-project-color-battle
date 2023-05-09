import { guid } from "./helper.mjs";
import { METHOD } from "./constants.mjs";

const createNewGame = (cells = 20, clients = [], state = {}) => {
  const id = guid();
  return {
    id,
    cells,
    clients,
    state,
  };
};

export function create(result, games, clients) {
  const { clientId } = result;
  const newGame = createNewGame();
  games[newGame.id] = newGame;

  const payLoad = {
    method: METHOD.create,
    game: newGame,
  };

  clients[clientId].connection.send(JSON.stringify(payLoad));
}
