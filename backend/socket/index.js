const StudyRoom = require("../models/StudyRoom");
const Participant = require("../models/Participant");

const connect = (io) => {
  return (socket) => {
    socket.emit("sendYourId", socket.id);

    socket.on("joinStudyRoom", async (id) => {
      // console.log("joining room " + id);

      //only join room if it exists and is not full
      try {
        //increment room count
        const res = await StudyRoom.findOneAndUpdate(
          { _id: id, participantCount: { $lt: 4 } },
          { $inc: { participantCount: 1 } },
          { runValidators: true, rawResult: true }
        ).exec();

        if (!res.lastErrorObject.updatedExisting) {
          socket.emit("roomFull");
          return;
        }

        //add participant to room
        let newParticipant = Participant({
          studyRoomId: id,
          socketId: socket.id,
          participantId: socket.handshake.session.user._id,
        });
        await newParticipant.save();

        //get all participants in room
        const roomPeers = await Participant.find({ studyRoomId: id })
          .populate("participantId")
          .exec();

        //join the room on the server
        socket.join(id);
        // console.log("joined room");

        // console.log(roomPeers);

        socket.emit(
          "roomPeers",
          roomPeers
            .map((peer) => {
              const {
                participantId: { firstName, lastName },
                socketId,
              } = peer;
              return { name: `${firstName} ${lastName}`, socketId: socketId };
            })
            .filter((p) => p.socketId !== socket.id)
        );
      } catch (err) {
        console.log(err);
        socket.emit("roomFull");
      }
    });

    socket.on("signalUserInRoom", ({ sendingToId, signal }) => {
      const { firstName, lastName } = socket.handshake.session.user;
      io.to(sendingToId).emit("someoneJoined", {
        joinSignal: signal,
        joinId: socket.id,
        name: `${firstName} ${lastName}`,
      });
    });

    socket.on("signalJoiningUser", ({ sendingToId, signal }) => {
      io.to(sendingToId).emit("userInRoomSignaledBack", {
        fromId: socket.id,
        signal,
      });
    });

    socket.on("strokePath", ({ roomId, path }) => {
      socket.to(roomId).emit("pathData", path);
    });

    socket.on("clearWhiteboard", (roomId) => {
      socket.to(roomId).emit("clearWhiteboard");
    });

    socket.on("sendWhiteboard", ({ to, paths }) => {
      io.to(to).emit("sentBackWhiteboard", paths);
    });

    socket.on("disconnect", async () => {
      try {
        const participant = await Participant.findOne({ socketId: socket.id });

        if (participant) {
          io.to(participant.studyRoomId.toString()).emit("userLeftRoom", socket.id);
          await Participant.deleteOne({ socketId: socket.id });
          await StudyRoom.findOneAndUpdate(
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
