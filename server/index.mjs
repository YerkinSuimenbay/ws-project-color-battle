import http from "node:http";
import { server as WebSocketServer } from "websocket";
import { handleWebSocketServer } from "./handleWebSocketServer.mjs";

const PORT = 5050;
const httpServer = http.createServer();

const wsServer = new WebSocketServer({
  httpServer,
});

handleWebSocketServer(wsServer);

httpServer.on("request", (req, res) => {
  res.end("OK");
});

httpServer.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}...`);
});
