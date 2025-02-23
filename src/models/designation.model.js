const mongoose = require("mongoose");
const { toJSON, paginate } = require("./plugins");

const designationSchema = new mongoose.Schema(
    {
        organisation: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Organisation",
        },
        name: {
            type: String,
        }, //role name (HR, manager, Employee)
        description: {
            type: String,
        },
        permissions: [{
            type: String,
        }],//["manage-users","set-attendance"]
    },
    {
        timestamps: true
    }
)

designationSchema.plugin(toJSON);
designationSchema.plugin(paginate);

const Designation = mongoose.model("Designation", designationSchema);

module.exports = Designation;