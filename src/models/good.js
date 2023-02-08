const { resolveObjectURL } = require("buffer");
const pool = require("../configs/db");

const createGood = (data) => {
  const { id, name, stock, selling, purchase, photo } = data;
  return new Promise((resolve, reject) => {
    pool.query(
      `INSERT INTO goods
            (id, name, stock, selling, purchase, photo)
            VALUES ('${id}', '${name}', '${stock}', '${selling}', '${purchase}', '${photo}')`,
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

const getGood = ({ search, sortby, sortorder, limit, offset }) => {
  return new Promise((resolve, reject) => {
    pool.query(
      `SELECT * FROM goods
            WHERE goods.name ILIKE ('%${search}%')
            ORDER BY goods.${sortby} ${sortorder}
            LIMIT ${limit}
            OFFSET ${offset}`,
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

const getGoodById = (id) => {
  return new Promise((resolve, reject) => {
    pool.query(
      `SELECT * FROM goods
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

const updateGood = (data) => {
  const { id, name, stock, selling, purchase, photo } = data;
  return new Promise((resolve, reject) => {
    pool.query(
      `UPDATE goods
            SET name = '${name}', stock = '${stock}', selling = '${selling}', purchase = '${purchase}', photo = '${photo}'
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

const deleteGood = (id) => {
  return new Promise((resolve, reject) => {
    pool.query(
      `DELETE FROM goods
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

const countGoods = () => {
  return pool.query(`SELECT COUNT(*) AS total FROM goods`);
};

module.exports = {
  createGood,
  getGood,
  getGoodById,
  updateGood,
  deleteGood,
  countGoods,
};
