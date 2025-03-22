const mongoose = require("mongoose");
const { toJSON, paginate } = require("./plugins");

const attendanceSchema = new mongoose.Schema(
    {
        employee: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
        organisation: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Organisation",
        },
        date: {
            type: Date,
        },
        action: {
            type: String,
            enum: ["check-in", "check-out"],
        },
        location: {
            latitude: { type: String },
            longitude: { type: String },
            address: { type: String },
        },
    },
    {
        timestamps: true
    }
)

attendanceSchema.plugin(toJSON);
attendanceSchema.plugin(paginate);

const Attendance = mongoose.model("Attendance", attendanceSchema);

module.exports = Attendance;