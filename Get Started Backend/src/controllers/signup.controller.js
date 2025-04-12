const signup = (req, res, next) => {
  res.send("You are Signed Up");
  next();
};

module.exports = signup;
