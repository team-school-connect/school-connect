const connect = (io) => {
  let rooms = {};

  let users = {};
  return (socket) => {
    socket.emit("sendYourId", socket.id);

    socket.on("joinStudyRoom", (id) => {
      console.log("joining room " + id);

      //only join room if its not full (max 4 people)

      //empty room, then create it
      if (!rooms[id]) {
        socket.emit("roomPeers", []);
        socket.join(id);
        users[socket.id] = id;
        rooms[id] = [socket.id];

        //if there is space in the room then join
      } else if (rooms[id].length < 4) {
        socket.emit("roomPeers", rooms[id]);
        socket.join(id);
        users[socket.id] = id;
        rooms[id] = [...rooms[id], socket.id];

        //send back that the room is full
      } else {
        socket.emit("roomFull");
      }

      console.log("joined room");
      console.log(rooms);
    });

    socket.on("signalUserInRoom", ({ sendingToId, signal }) => {
      io.to(sendingToId).emit("someoneJoined", { joinSignal: signal, joinId: socket.id });
    });

    socket.on("signalJoiningUser", ({ sendingToId, signal }) => {
      io.to(sendingToId).emit("userInRoomSignaledBack", { fromId: socket.id, signal });
    });

    socket.on("disconnect", () => {
      const id = users[socket.id];

      if (id) {
        console.log("id");
        console.log(id);

        console.log("user");
        console.log(socket.id);

        rooms[id] = rooms[id].filter((personId) => {
          return personId !== socket.id;
        });

        delete users[socket.id];

        console.log("user left room");
        console.log(rooms);
        console.log("users");

        socket.to(id).emit("userLeftRoom", socket.id);
      }
    });
  };
};

exports.connect = connect;
