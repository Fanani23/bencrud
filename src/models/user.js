const pool = require("../configs/db");

const registerUser = (data) => {
  const { id, name, username, email, password, phone, otp } = data;
  return new Promise((resolve, reject) => {
    pool.query(
      `INSERT INTO users
            (id, name, username, email, password, phone, otp)
            VALUES ('${id}', '${name}', '${username}', '${email}', '${password}', '${phone}', '${otp}')`,
      (err, res) => {
        if (!err) {
          resolve(res);
        } else {
          reject(err);
        }
      }
    );
  });
};

const findEmail = (email) => {
  return new Promise((resolve, reject) => {
    pool.query(
      `SELECT * FROM users
              WHERE email = '${email}'`,
      (err, res) => {
        if (!err) {
          resolve(res);
        } else {
          reject(err);
        }
      }
    );
  });
};

const verification = (email) => {
  return new Promise((resolve, reject) => {
    pool.query(
      `UPDATE users
              SET access = 1
              WHERE email = '${email}'`,
      (err, res) => {
        if (!err) {
          resolve(res);
        } else {
          reject(err);
        }
      }
    );
  });
};

const updateUser = (data) => {
  const { id, name, username, phone, photo } = data;
  return new Promise((resolve, reject) => {
    pool.query(
      `UPDATE users
            SET name = '${name}', username = '${username}', phone = '${phone}', photo = '${photo}'
            WHERE id = '${id}'`,
      (err, res) => {
        if (!err) {
          resolve(res);
        } else {
          reject(err);
        }
      }
    );
  });
};

module.exports = {
  registerUser,
  findEmail,
  verification,
  updateUser,
};
