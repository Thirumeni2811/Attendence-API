const mongoose = require("mongoose")
const { toJSON, paginate } = require("./plugins")

const locationSchema = new mongoose.Schema(
    {
        name: {
            type: String,
        },
        latitude: {
            type: String,
        },
        longitude: {
            type: String,
        },
        address: {
            type: String,
        },
        organisation: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Organisation",
        },
    },
    {
        timestamps: true
    }
)

locationSchema.plugin(toJSON);
locationSchema.plugin(paginate);

const Location = mongoose.model("Location", locationSchema);

module.exports = Location;