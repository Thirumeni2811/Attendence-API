const passport = require("passport");
const httpStatus = require("http-status");
const ApiError = require("../utils/ApiError");
const { roleRights } = require("../config/roles");

const verifyCallback =
  (req, resolve, reject, requiredRights) => async (err, user, info) => {
    // console.log("------------------>",user)
    if (err || info || !user) {
      return reject(
        new ApiError(httpStatus.UNAUTHORIZED, "Please authenticate")
      );
    }

    req.user = user;
    // console.log("auth from user===>", user.role);

    if (requiredRights.length) {
      const userRole = user.role || "user"; // Default to "user" if no role is provided
      // console.log(userRole);

      const userRights = roleRights.get(userRole) || [];
      // console.log(userRights);

      const hasRequiredRights = requiredRights.every((requiredRight) =>
        userRights.includes(requiredRight)
      );
      // if (!hasRequiredRights && req.params.userId !== user.id) {
      //   return reject(new ApiError(httpStatus.FORBIDDEN, "Forbidden"));
      // }
      // Allow if user is admin, subAdmin, or editing their own profile
      if (!hasRequiredRights && req.params.userId !== user.id) {
        // Check if the user is not trying to modify their own data
        if (!(user.role === "admin" || user.role === "subAdmin")) {
          return reject(new ApiError(httpStatus.FORBIDDEN, "Forbidden"));
        }
      }
    }

    resolve();
  };

const auth =
  (...requiredRights) =>
  async (req, res, next) => {
    return new Promise((resolve, reject) => {
      passport.authenticate(
        "jwt",
        { session: false },
        verifyCallback(req, resolve, reject, requiredRights)
      )(req, res, next);
    })
      .then(() => next())
      .catch((err) => next(err));
  };

module.exports = auth;
