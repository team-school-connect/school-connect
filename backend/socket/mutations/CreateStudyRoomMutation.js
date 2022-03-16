const StudyRoom = require("../../models/StudyRoom");
const { UserInputError, ApolloError } = require("apollo-server-core");

const createStudyRoomMutation = async (parent, args, context) => {
  const { roomName, subject } = args;

  if (!roomName || !subject) {
    throw new UserInputError("Input is invalid");
  }

  try {
    let room = new StudyRoom({
      roomName,
      participantCount: 0,
      subject,
      createdOn: new Date(),
    });

    let response = await room.save();

    return { code: 200, success: true, message: "Study Room created", response };
  } catch (err) {
    throw new ApolloError("Something went wrong");
  }
};

module.exports = createStudyRoomMutation;
