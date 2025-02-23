const roles = ["admin", "subAdmin", "user"];
const roleRights = new Map();

roleRights.set(roles[0], ["getUsers", "manageUsers"]); // admin
roleRights.set(roles[1], ["getUsers", "manageUsers"]); // subAdmin
roleRights.set(roles[2], []); // user (basic access)

module.exports = {
  roles,
  roleRights,
};
