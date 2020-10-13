const SocketIo = require("socket.io");
const socketHandlers = require("./socket-handlers");

module.exports = (server) => {
  const socket = SocketIo(server);

  socket.on("connection", (clientSocket) => {
    socketHandlers.forEach((Handler) => {
      clientSocket.on(Handler.name, (data) => {
        new Handler({ socket: clientSocket, data });
      });
    });
  });

  return socket;
};
