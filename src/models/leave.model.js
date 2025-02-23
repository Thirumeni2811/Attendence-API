const mongoose = require("mongoose");
const { toJSON, paginate } = require("./plugins");

const leaveSchema = new mongoose.Schema(
    {
        employee: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Employee",
        },
        organisation: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Organisation",
        },
        leaveType: {
            type: String,
            enum: ["sick", "casual", "vacation"],
        },
        startDate: {
            type: Date,
        },
        endDate: {
            type: Date,
        },
        status: {
            type: String,
            enum: ["pending", "approved", "rejected"],
            default: "pending",
        },
        reason: {
            type: String,
        },
        approvedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
        feedback : {
            type: String,
        },
    },
    {
        timestamps: true
    }
)

leaveSchema.plugin(toJSON);
leaveSchema.plugin(paginate);

const Leave = mongoose.model("Leave", leaveSchema);

module.exports = Leave;