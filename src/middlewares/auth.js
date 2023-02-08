const { response } = require("../helpers/common");
const jwt = require("jsonwebtoken");

let key = process.env.KEY;

const protect = (req, res, next) => {
  try {
    let token;
    if (req.headers.authorization) {
      let auth = req.headers.authorization;
      token = auth.split(" ")[1];
      let decode = jwt.verify(token, key);
      req.payload = decode;
      next();
    } else {
      return response(res, 400, false, null, "Server need token");
    }
  } catch (err) {
    console.log("error", err);
    if (err && err.name == "JsonWebTokenError") {
      return response(res, 400, false, null, "Invalid token");
    } else if (err && err.name == "TokenExpiredError") {
      return response(res, 400, false, null, "Expired token");
    } else {
      return response(res, 400, false, null, "Token deactivate");
    }
  }
};

module.exports = {
  protect,
};
