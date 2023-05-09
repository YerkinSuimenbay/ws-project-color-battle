import { guid } from "./helper.mjs";
import { METHOD } from "./constants.mjs";

const createNewClient = (connection) => {
  //generate a new clientId
  const id = guid();
  const newClient = {
    id,
    connection,
  };

  return newClient;
};

export function connect(clients, connection) {
  const newClient = createNewClient(connection, clients);
  clients[newClient.id] = newClient;

  //send back the client connect
  const payload = {
    method: METHOD.connect,
    clientId: newClient.id,
  };

  connection.send(JSON.stringify(payload));
}
