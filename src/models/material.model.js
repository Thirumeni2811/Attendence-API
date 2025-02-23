const mongoose = require("mongoose");
const { toJSON, paginate } = require("./plugins"); // Assuming toJSON and paginate plugins are used

const materialSchema = new mongoose.Schema(
  {
    materialName: {
      type: String,
      required: true,
      trim: true,
    },
    materialDescription: {
      type: String,
      trim: true,
    },
    status: {
      type: Boolean,
      default: true, // true = active, false = inactive
    },
  },
  {
    timestamps: true,
  }
);

// Add plugins
materialSchema.plugin(toJSON);
materialSchema.plugin(paginate);

const Material = mongoose.model("Material", materialSchema);

module.exports = Material;
