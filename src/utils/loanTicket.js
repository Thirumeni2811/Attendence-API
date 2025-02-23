const loanTicket = () => {
  const date = new Date();
  const randomDigits = Math.floor(100000 + Math.random() * 900000); // Generates a 6-digit random number
  return `${date.getDate()}/${
    date.getMonth() + 1
  }/${date.getFullYear()}-${randomDigits}`;
};

module.exports = { loanTicket };
