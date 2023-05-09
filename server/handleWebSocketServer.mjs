import { create } from "./create.mjs";
import { join } from "./join.mjs";
import { play } from "./play.mjs";
import { connect } from "./connect.mjs";

export function handleWebSocketServer(wsServer) {
  const clients = {}; // { [clientId]: { connection } }
  const games = {};

  wsServer.on("request", (request) => {
    console.log({ request });
    const connection = request.accept(null, request.origin);
    connection.on("close", (code, desc) =>
      console.log(`WS connection closed. Code: ${code}. Desc: ${desc}`)
    );

    // WE CAN CLOSE THE CONNECTION FROM SERVER AS WELL
    // connection.close(1000, "CLOSED BY SERVER");

    connection.on("message", (data) => {
      const result = JSON.parse(data.utf8Data);
      console.log(result);

      if (result.method === "create") {
        return create(result, games, clients);
      }

      if (result.method === "join") {
        return join(result, games, clients);
      }

      if (result.method === "play") {
        return play(result, games);
      }
    });

    connect(clients, connection);
  });
}
