const StudyRoom = require("../../models/StudyRoom");
const { ApolloError } = require("apollo-server-core");

const getStudyRoomsQuery = async (parent, args, context) => {
  const { page = 0 } = args;

  const pageLimit = 10;

  try {
    const studyRooms = await StudyRoom.find()
      .limit(pageLimit)
      .skip(page * pageLimit)
      .exec();

    const count = await StudyRoom.countDocuments();

    return { totalPages: Math.ceil(count / pageLimit), studyRooms: studyRooms };
  } catch (err) {
    console.log(err);
    throw new ApolloError("Something went wrong");
  }
};

module.exports = getStudyRoomsQuery;
