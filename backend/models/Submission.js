const mongoose = require("mongoose");
const { Schema } = mongoose;

const SubmissionSchema = new Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User"},
    assignmentId: { type: mongoose.Schema.Types.ObjectId, ref: "Assignment"},
    filename: { type: String, required: true },
    mimetype: { type: String, required: true },
    encoding: { type: String, required: true},
    path: { type: String, require: true }
    },
    { timestamps: true}
);

module.exports = mongoose.model("Submission", SubmissionSchema);