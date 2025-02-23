const express = require("express");
const authRoute = require("./auth.route");
const docsRoute = require("./docs.route");
const fileRoute = require("./file.route");
const config = require("../../config/config");
const subscription = require("./payment.route");
const organisation = require("./organisation.route");
const department = require("./department.route");
const designation = require("./designation.route");
const employee = require("./employee.route"); 
const location = require("./location.route"); 
const schedule = require("./schedule.route"); 
const holiday = require("./holiday.route"); 
const leave = require("./leave.route"); 
const attendence = require("./attendence.route"); 

const router = express.Router();

const defaultRoutes = [
  {
    path: "/auth",
    route: authRoute,
  },
  {
    path: "/media",
    route: fileRoute,
  },
  {
    path: "/subscription",
    route: subscription,
  },
  {
    path: "/organisation",
    route: organisation,
  },
  {
    path: "/department",
    route: department,
  },
  {
    path: "/designation",
    route: designation,
  },
  {
    path: "/employee",
    route: employee,
  },
  {
    path: "/location",
    route: location,
  },
  {
    path: "/schedule",
    route: schedule,
  },
  {
    path: "/schedule",
    route: schedule,
  },
  {
    path: "/holiday",
    route: holiday,
  },
  {
    path: "/leave",
    route: leave,
  },
  {
    path: "/attendence",
    route: attendence,
  },
];

const devRoutes = [
  // routes available only in development mode
  {
    path: "/docs",
    route: docsRoute,
  },
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

/* istanbul ignore next */
if (config.env === "development") {
  devRoutes.forEach((route) => {
    router.use(route.path, route.route);
  });
}

module.exports = router;
