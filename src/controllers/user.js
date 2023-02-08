const { response } = require("../helpers/common");
const {
  registerUser,
  findEmail,
  verification,
  updateUser,
} = require("../models/user");
const bcrypt = require("bcryptjs");
const { v4: uuidv4 } = require("uuid");
const {
  generateToken,
  generateRefreshToken,
  decodeToken,
} = require("../helpers/jwt");
const mail = require("../middlewares/emailer");
const cloudinary = require("../configs/cloud");

const userController = {
  register: async (req, res, next) => {
    let {
      rows: [users],
    } = await findEmail(req.body.email);
    if (users) {
      return response(
        res,
        400,
        false,
        "Email is already used. Try to register with another email"
      );
    }
    let digits = "0123456789";
    let otp = "";
    for (let i = 0; i < 6; i++) {
      otp += digits[Math.floor(Math.random() * 10)];
    }
    let password = bcrypt.hashSync(req.body.password);
    let data = {
      id: uuidv4(),
      name: req.body.name,
      username: req.body.username,
      email: req.body.email,
      password,
      phone: req.body.phone,
      otp,
    };
    console.log(data);
    try {
      const result = await registerUser(data);
      if (result) {
        let text = `Hello ${req.body.name} \n Thank you for join us. Please confirm your account by this OTP code ${otp}`;
        let subject = `${otp} is your OTP`;
        let sendEmail = mail(req.body.email, subject, text);
        if (sendEmail == "Email not send") {
          return response(res, 400, false, null, "Register failed");
        } else {
          response(res, 200, true, {}, "Register success");
        }
      }
    } catch (err) {
      console.log("Register error", err);
      response(res, 400, false, err, "Register failed");
    }
  },
  verificationOtp: async (req, res) => {
    const { email, otp } = req.body;
    const {
      rows: [users],
    } = await findEmail(email);
    if (!users) {
      return response(res, 400, false, null, "Email not found");
    }
    if (users.otp == otp) {
      const result = await verification(req.body.email);
      return response(res, 200, true, {}, "Verification account success");
    }
    return response(res, 400, false, null, "Invalid otp");
  },
  login: async (req, res, next) => {
    let {
      rows: [users],
    } = await findEmail(req.body.email);
    if (!users) {
      return response(res, 400, false, null, "Email not found");
    }
    const password = req.body.password;
    const validation = bcrypt.compareSync(password, users.password);
    if (!validation) {
      return response(res, 400, false, null, "Invalid password");
    }
    if (users.access == 0) {
      return response(res, 400, false, null, "Account not verified");
    }
    delete users.password;
    delete users.otp;
    let payload = {
      id: users.id,
      name: users.name,
      username: users.username,
      email: users.email,
    };
    let accessToken = generateToken(payload);
    let refreshToken = generateRefreshToken(payload);
    users.token = accessToken;
    users.refreshToken = refreshToken;
    response(res, 200, true, users, "Login success");
  },
  profile: async (req, res, next) => {
    const { email } = req.payload;
    try {
      const {
        rows: [users],
      } = await findEmail(email);
      if (users === undefined) {
        res.json({
          message: "Invalid token",
        });
        return;
      }
      delete users.password;
      delete users.otp;
      response(res, 200, true, users, "Get profile user success");
    } catch (err) {
      console.log("Error get profile", err);
      response(res, 400, false, "Get profile user failed");
    }
  },
  update: async (req, res, next) => {
    try {
      const { name, username, phone } = req.body;
      const { id } = req.payload;
      const photo = await cloudinary.uploader.upload(req.file.path, {
        folder: "ncrud",
      });
      const dataProfile = {
        id,
        name,
        username,
        phone,
        photo: photo.url,
      };
      await updateUser(dataProfile);
      response(res, 200, true, dataProfile, "Update profile user success");
    } catch (err) {
      console.log("Error update profile", err);
      response(res, 400, false, "Update profile user failed");
    }
  },
};

exports.userController = userController;
