const moment = require("moment");
const httpStatus = require("http-status");
const User = require("../models/user.model");
const Attendance = require("../models/attendance.model");
const Leave = require("../models/leave.model");
const Holiday = require("../models/holiday.model");
const Schedule = require("../models/schedule.model");
const ApiError = require("../utils/ApiError");

/**
 * Mark attendance
 */
const markAttendance = async (id, body) => {
    const user = await User.findById(id)
        .populate("leave")
        .populate("holiday")
        .populate("schedule");

    if (!user) {
        throw new ApiError(httpStatus.BAD_REQUEST, "User not found");
    }

    const currentDate = moment().format("YYYY-MM-DD");
    const currentTime = moment().format("hh:mm A");

    // 1. Check if the employee is on leave today
    const isOnLeave = user.leave.some(leave =>
        leave.status === "approved" &&
        moment(currentDate).isBetween(moment(leave.startDate), moment(leave.endDate), null, "[]")
    );

    if (isOnLeave) {
        throw new ApiError(httpStatus.BAD_REQUEST, "You are on approved leave today.");
    }

    // 2. Check if today is a holiday
    const isHoliday = user.holiday.some(holiday =>
        holiday.holidays.some(h => moment(h.date).format("YYYY-MM-DD") === currentDate)
    );

    if (isHoliday) {
        throw new ApiError(httpStatus.BAD_REQUEST, "Today is a holiday. Attendance not required.");
    }

    // 3. Check the schedule and validate check-in/out time
    if (!user.schedule) {
        throw new ApiError(httpStatus.BAD_REQUEST, "No schedule assigned. Contact your admin.");
    }

    const { workingHours, breaks } = user.schedule;
    const workStartTime = moment(workingHours.startTime, "hh:mm A");
    const workEndTime = moment(workingHours.endTime, "hh:mm A");
    const currentMoment = moment(currentTime, "hh:mm A");

    if (body.action === "check-in") {
        // if (currentMoment.isBefore(workStartTime)) {
        //     console.log("Check-in not allowed before work starts.");
        //     throw new ApiError(httpStatus.BAD_REQUEST, "Check-in not allowed before work starts.");
        // }
        console.log("Check-in allowed.");
        sendNotification(user.id, "You have successfully checked in.");
    }
    
    if (body.action === "check-out") {
        // if (currentMoment.isBefore(workEndTime)) {
        //     console.log("You cannot check out before work ends.");
        //     throw new ApiError(httpStatus.BAD_REQUEST, "You cannot check out before work ends.");
        // }
        console.log("Check-out allowed.");
        sendNotification(user.id, "You have successfully checked out.");
    }
    

    // 4. Check for break times
    breaks.forEach((b) => {
        const breakStart = moment(b.startTime, "hh:mm A").subtract(2, "minutes");
        const breakEnd = moment(b.endTime, "hh:mm A").subtract(2, "minutes");

        if (currentMoment.isSame(breakStart, "minute")) {
            sendNotification(user.id, `Your ${b.breakType} break starts in 2 minutes.`);
        }
        if (currentMoment.isSame(breakEnd, "minute")) {
            sendNotification(user.id, `Your ${b.breakType} break ends in 2 minutes.`);
        }
    });

    // 5. Send notification 2 minutes before work ends
    const endTimeAlert = moment(workEndTime).subtract(2, "minutes");
    if (currentMoment.isSame(endTimeAlert, "minute")) {
        sendNotification(user.id, "Your work is about to end in 2 minutes.");
    }

    // 6. Save attendance record
    body.employee = user.id;
    body.organisation = user.organisation;

    const attendance = await Attendance.create(body);
    user.attendance.push(attendance.id);
    await user.save();

    return attendance;
};

/**
 * notification
 */
const sendNotification = async (userId, message) => {
    console.log(`Notification for user ${userId}: ${message}`);
};

/**
 * get attendence by userId
 */
const getAttendenceById = async (id) => {
    return await Attendance.find({ employee: id })
}

/**
 * get attendence by organisation id
 */
const getAttendenceByOrganisationId = async (organisationId) => {
    return await Attendance.find({ organisation: organisationId })
}

// Get attendence management by user ID
const getAttendenceManagementById = async (id) => {
    const attendanceRecords = await Attendance.find({ employee: id });
    
    let totalDays = 0;
    let totalWorkingHours = 0;
  
    attendanceRecords.forEach((record) => {
      // Assuming record has 'check-in' and 'check-out' fields as timestamps
      if (record.checkIn && record.checkOut) {
        totalDays++;
  
        const checkInTime = moment(record.checkIn);
        const checkOutTime = moment(record.checkOut);
        const workingHours = checkOutTime.diff(checkInTime, 'hours', true); // Calculate working hours as decimal
  
        totalWorkingHours += workingHours;
      }
    });

    console.log(totalDays)
    console.log(totalWorkingHours)
  
    return {
      totalDays,
      totalWorkingHours: totalWorkingHours.toFixed(2), // Formatting to 2 decimal places
    };
  }; 

// Get attendence by management organisation ID
const getAttendenceManagementByOrganisationId = async (organisationId) => {
    return await Attendance.find({ organisation: organisationId })
}

module.exports = {
    markAttendance,
    getAttendenceById,
    getAttendenceByOrganisationId,
    getAttendenceManagementById,
    getAttendenceManagementByOrganisationId,
};
