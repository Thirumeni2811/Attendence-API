const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const organisationSchema = new mongoose.Schema(
    {
        name: {
            type: String,
        },
        companyAddress: {
            type: String,
        },
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
        businessType: {
            type: String,
        },
        logo: {
            type: String,
        },
        isOrganisationCreated: {
            type: Boolean,
            default: false,
        },
        employees: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        }],
        location: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Location", 
        }],
        department: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Department",
        }],
        designation: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Designation",
        }],
        schedule: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Schedule",
        }],
        holiday: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Holiday",
        }],
        batch: [Object],
    },
    {
        timestamps: true
    }
)

organisationSchema.plugin(toJSON);
organisationSchema.plugin(paginate);

const Organisation = mongoose.model("Organisation", organisationSchema);

module.exports = Organisation;