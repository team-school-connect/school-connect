const mongoose = require("mongoose");
const { Schema } = mongoose;

const AssignmentSchema = new Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    classId: { type: mongoose.Schema.Types.ObjectId, ref: "Classroom"},
    dueDate: { type: Date, required: true }
    },
    { timestamps: true }
);

module.exports = mongoose.model("Assignment", AssignmentSchema);