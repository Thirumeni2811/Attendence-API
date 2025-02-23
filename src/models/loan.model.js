const mongoose = require("mongoose");
const { toJSON, paginate } = require("./plugins");

const tenureSchema = new mongoose.Schema({
  month: {
    type: Number,
  },
  amount: {
    type: Number,
  },
  date: {
    type: Date,
  },
  loanTicket: {
    type: String,
  },
  status: {
    type: String,
    default: "due",
  },
  dueDate: {
    type: Date,
  },
});

tenureSchema.methods.updateStatus = function () {
  const currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0);

  // Only mark as overdue if the status is not already "paid"
  if (this.date && currentDate > this.date && this.status !== "paid") {
    this.status = "overdue";
  }
};

const paymentSchema = new mongoose.Schema({
  amount: {
    type: Number,
  },
  date: {
    type: Date,
  },
  tenureId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Loan",
  },
  month: {
    type: Number,
  },
  paidAmount: {
    type: Number,
  },
  dueDate: {
    type: Date,
  },
});

const loanSchema = new mongoose.Schema(
  {
    loanAmount: {
      type: Number,
    },
    processingCharge: {
      type: Number,
    },
    amountToBeDisburse: {
      type: Number,
    },
    gst: {
      type: Number,
    },
    interestBeforeDueData: {
      type: Number,
    },
    status: {
      type: String,
      default: "requested",
    },
    tenure: [tenureSchema],
    totalAmountPayable: {
      type: Number,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    loanTicket: {
      type: String,
    },
    payments: [paymentSchema],
    date: { type: Date },
    time: { type: String },
  },
  { timestamps: true }
);

// Pre-save hook to update tenure status
loanSchema.pre("save", function (next) {
  this.tenure.forEach((tenure) => {
    tenure.updateStatus();
  });
  next();
});

loanSchema.plugin(toJSON);
loanSchema.plugin(paginate);

const Loan = mongoose.model("Loan", loanSchema);

module.exports = Loan;
