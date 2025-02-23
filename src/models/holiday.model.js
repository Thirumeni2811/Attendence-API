const mongoose = require("mongoose");
const { toJSON, paginate } = require("./plugins");

const holidaySchema = new mongoose.Schema(
  {
    organisation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organisation",
    },
    date: { type: Date },
    reason: { type: String },
    active: { type: Boolean, default: true }
  },
  {
    timestamps: true,
  }
);

holidaySchema.plugin(toJSON);
holidaySchema.plugin(paginate);

const Holiday = mongoose.model("Holiday", holidaySchema);

module.exports = Holiday;
