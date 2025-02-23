const mongoose = require("mongoose");
const { toJSON, paginate } = require("./plugins");

const settingSchema = new mongoose.Schema(
  {
    maxAmount: {
      type: String,
      required: true,
    },
    minAmount: {
      type: String,
      required: true,
    },
    processingChargePerc: {
      type: Number,
      required: true,
    },
    gst: {
      type: Number,
      required: true,
    },
    interest: {
      type: Number,
      required: true,
    },
    tenure: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Add plugins
settingSchema.plugin(toJSON);
settingSchema.plugin(paginate);

const Setting = mongoose.model("Settings", settingSchema);

module.exports = Setting;
