const mongoose = require("mongoose");
const { toJSON, paginate } = require("./plugins");

const employeeSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
        organisation: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Organisation",
        },
        department: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Department",
        },
        designation: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Designation",
        },
        schedule: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Schedule",
        },
        attendance: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Attendence",
        }],
        leave: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Leave",
        }],
    },
    {
        timestamps: true
    }
)

employeeSchema.plugin(toJSON);
employeeSchema.plugin(paginate);

const Employee = mongoose.model("Employee", employeeSchema);

module.exports = Employee;