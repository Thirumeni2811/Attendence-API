const mongoose = require("mongoose");
const { toJSON, paginate } = require("./plugins");

const scheduleSchema = new mongoose.Schema(
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
    workingHours: {
      startTime: { type: String },
      endTime: { type: String }, 
    },
    breaks: [
      {
          _id: { type: mongoose.Schema.Types.ObjectId, auto: true }, // Unique ID for each break
          breakType: {
              type: String,
              enum: ["Short Break", "Lunch", "Other"],
          },
          startTime: { type: String },
          endTime: { type: String },
          period: { type: Number },  
      },
  ],
  },
  {
    timestamps: true,
  }
);

scheduleSchema.plugin(toJSON);
scheduleSchema.plugin(paginate);

const Schedule = mongoose.model("Schedule", scheduleSchema);

module.exports = Schedule;
