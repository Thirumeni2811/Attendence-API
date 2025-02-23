const mongoose = require("mongoose");
const { toJSON, paginate } = require("./plugins");

const notificationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    notificationContent: {
      type: String,
      required: true,
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    type: {
      type: String,
      required: false,
    },
  },
  { timestamps: true }
);

notificationSchema.plugin(toJSON);
notificationSchema.plugin(paginate);

const Notification = mongoose.model("Notification", notificationSchema);

module.exports = Notification;
