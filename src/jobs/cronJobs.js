// const cron = require("node-cron");
// const Attendance = require("../models/attendance.model");

// // Cron job to enable punch-out at the exact punch-out time
// cron.schedule("* * * * *", async () => {
//   const now = new Date();
//   await Attendance.updateMany(
//     { status: true, punchOutAvailableAt: { $lte: now } },
//     { status: false } // Mark status as false (ready for punch out)
//   );
// });
