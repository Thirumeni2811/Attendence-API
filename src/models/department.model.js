const mongoose = require("mongoose");
const { toJSON, paginate } = require("./plugins");

const departmentSchema = new mongoose.Schema(
    {
        organisation: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Organisation",
        },
        name: {
            type: String,
        }, 
        description: {
            type: String,
        },
    },
    {
        timestamps: true,
    }
);

departmentSchema.plugin(toJSON);
departmentSchema.plugin(paginate);

const Department = mongoose.model("Department", departmentSchema);

module.exports = Department;
