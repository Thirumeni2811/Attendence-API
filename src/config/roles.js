const roles = ["creator", "admin", "subAdmin", "user"];
const roleRights = new Map();

roleRights.set(roles[0], ["getAll", "getUsers", "manageUsers"]); // admin
roleRights.set(roles[1], ["getUsers", "manageUsers"]); // admin
roleRights.set(roles[2], ["getUsers", "manageUsers"]); // subAdmin
roleRights.set(roles[3], []); // user (basic access)

module.exports = {
  roles,
  roleRights,
};
