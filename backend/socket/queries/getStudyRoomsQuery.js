const StudyRoom = require("../../models/StudyRoom");
const { ApolloError } = require("apollo-server-core");

const getStudyRoomsQuery = async (parent, args, context) => {
  const { page = 0 } = args;

  const pageLimit = 10;

  try {
    const studyRooms = await StudyRoom.find()
      .sort({ createdOn: -1 })
      .limit(pageLimit)
      .skip(page * pageLimit)
      .exec();

    const count = await StudyRoom.countDocuments();

    return { totalRows: count, studyRooms: studyRooms };
  } catch (err) {
    console.log(err);
    throw new ApolloError("Something went wrong");
  }
};

module.exports = getStudyRoomsQuery;
