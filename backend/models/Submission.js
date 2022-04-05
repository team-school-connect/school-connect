const mongoose = require("mongoose");
const { Schema } = mongoose;

const SubmissionSchema = new Schema({
    userId: { type: String, required: true },
    assignmentId: { type: mongoose.Schema.Types.ObjectId, ref: "Assignment"},
    classId: { type: mongoose.Schema.Types.ObjectId, ref: "Classroom"},
    filename: { type: String, required: true },
    mimetype: { type: String, required: true },
    encoding: { type: String, required: true},
    path: { type: String, require: true }
    },
    { timestamps: true}
);

module.exports = mongoose.model("Submission", SubmissionSchema);