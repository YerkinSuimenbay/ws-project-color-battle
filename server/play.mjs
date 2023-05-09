export function play(result, games) {
  const { gameId, cellId, color } = result;

  const game = games[gameId];
  game.state[cellId] = color;
}
