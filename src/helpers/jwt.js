const jwt = require("jsonwebtoken");

let key = process.env.KEY;

const generateToken = (payload) => {
  const verifyOpts = {
    expiresIn: "1d",
  };
  const token = jwt.sign(payload, key, verifyOpts);
  return token;
};

const generateRefreshToken = (payload) => {
  const verifyOpts = {
    expiresIn: "1d",
  };
  const token = jwt.sign(payload, key, verifyOpts);
  return token;
};

const decodeToken = (token) => {
  let decode = jwt.verify(token, key);
  return decode;
};

module.exports = {
  generateToken,
  generateRefreshToken,
  decodeToken,
};
