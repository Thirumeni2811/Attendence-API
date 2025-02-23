const checkRole = (requiredRole) => {
  return (req, res, next) => {
    // console.log("Required Role =>", requiredRole);
    // console.log("User Role =>", req.user.role);

    const userRole = req.user.role;

    if (!userRole) {
      return res
        .status(401)
        .send({ message: "Unauthorized: No role assigned!" });
    }

    if (userRole !== requiredRole) {
      return res.status(403).send({
        message: `Access Denied: Only ${requiredRole} can perform this action!`,
      });
    }

    next();
  };
};

module.exports = checkRole;