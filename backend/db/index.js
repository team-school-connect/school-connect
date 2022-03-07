const mongoose = require("mongoose");

const connect = async () => {
  try {
    await mongoose.connect(process.env.DB_CONNECTION_STRING);
    console.log("Connected to MongoDB database");
  } catch (err) {
    console.log(err);
  }
};

exports.connect = connect;
