const StudyRoom = require("../models/StudyRoom");
const Participant = require("../models/Participant");

const connect = (io) => {
  let rooms = {};

  let users = {};
  return (socket) => {
    socket.emit("sendYourId", socket.id);

    socket.on("joinStudyRoom", async (id) => {
      console.log("joining room " + id);

      //only join room if it exists and is not full

      try {
        const room = await StudyRoom.findOne({ _id: id, participantCount: { $lt: 4 } });

        if (!room) {
          socket.emit("roomFull");
          return;
        }

        //increment room count
        const count = await StudyRoom.updateOne(
          { _id: id, participantCount: { $lt: 4 } },
          { $inc: { participantCount: 1 } },
          { runValidators: true }
        ).exec();

        if (!room) {
          socket.emit("roomFull");
          return;
        }

        console.log("Worked");

        //add participant to room
        let newParticipant = Participant({ studyRoomId: id, socketId: socket.id });
        await newParticipant.save();

        //get all participants in room
        const roomPeers = await Participant.find({ studyRoomId: id });

        //join the room on the server
        socket.join(id);
        console.log("joined room");

        socket.emit(
          "roomPeers",
          roomPeers.map((peer) => peer.socketId).filter((socketId) => socketId !== socket.id)
        );
      } catch (err) {
        console.log(err);
        socket.emit("roomFull");
      }
    });

    socket.on("signalUserInRoom", ({ sendingToId, signal }) => {
      io.to(sendingToId).emit("someoneJoined", { joinSignal: signal, joinId: socket.id });
    });

    socket.on("signalJoiningUser", ({ sendingToId, signal }) => {
      io.to(sendingToId).emit("userInRoomSignaledBack", { fromId: socket.id, signal });
    });

    socket.on("strokePath", ({ roomId, path }) => {
      io.to(roomId).emit("pathData", path);
    });

    socket.on("disconnect", async () => {
      try {
        const participant = await Participant.findOne({ socketId: socket.id });

        if (participant) {
          console.log(participant);
          console.log("STUDY ROOM ID");
          console.log(participant.studyRoomId.toString());
          io.to(participant.studyRoomId.toString()).emit("userLeftRoom", socket.id);
          await Participant.deleteOne({ socketId: socket.id });
          await StudyRoom.updateOne(
            { _id: participant.studyRoomId, participantCount: { $gt: 0 } },
            { $inc: { participantCount: -1 } },
            { runValidators: true }
          ).exec();
        }
      } catch (err) {
        console.log(err);
      }
    });
  };
};

exports.connect = connect;
