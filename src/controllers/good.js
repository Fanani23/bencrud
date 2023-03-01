const { response } = require("../helpers/common");
const {
  createGood,
  getGood,
  getGoodById,
  updateGood,
  deleteGood,
  countGoods,
  findGood,
} = require("../models/good");
const cloudinary = require("../configs/cloud");

const goodController = {
  create: async (req, res, next) => {
    let {
      rows: [goods],
    } = await findGood(req.body.name);
    if (goods) {
      return response(
        res,
        400,
        false,
        "Name product is already used. Try to add product with another unique name product"
      );
    }
    try {
      let digits = "0123456789";
      let id = "";
      for (let i = 0; i < 6; i++) {
        id += digits[Math.floor(Math.random() * 10)];
      }
      const name = req.body.name;
      const stock = parseInt(req.body.stock);
      const selling = parseInt(req.body.selling);
      const purchase = parseInt(req.body.purchase);
      const photo = await cloudinary.uploader.upload(req.file.path, {
        folder: "ncrud",
      });
      const data = {
        id: id,
        name,
        stock,
        selling,
        purchase,
        photo: photo.url,
      };
      await createGood(data);
      return response(res, 200, true, data, "Create good success");
    } catch (err) {
      return response(res, 400, false, err, "Create good failed");
    }
  },
  get: async (req, res, next) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 5;
      const sortby = req.query.sortby || "name";
      const sortorder = req.query.sortorder || "desc";
      const search = req.query.search || "";
      const offset = (page - 1) * limit;
      const result = await getGood({
        search,
        sortby,
        sortorder,
        limit,
        offset,
      });
      const {
        rows: [count],
      } = await countGoods();
      const totalData = parseInt(count.total);
      const totalPage = Math.ceil(totalData / limit);
      const pagination = {
        currentPage: page,
        limit,
        totalData,
        totalPage,
      };
      response(
        res,
        200,
        true,
        { result: result.rows, pagination: pagination },
        "Get good data success"
      );
    } catch (err) {
      console.log("Get good data error", err);
      response(res, 400, false, null, "Get good data failed");
    }
  },
  getById: async (req, res, next) => {
    try {
      const result = await getGoodById(req.params.id);
      response(res, 200, true, result.rows, "Get good data by ID success");
    } catch (err) {
      console.log("Get good data by ID error", err);
      response(res, 400, false, err, "Get good data by ID failed");
    }
  },
  update: async (req, res, next) => {
    try {
      const id = req.body.id;
      const name = req.body.name;
      const stock = parseInt(req.body.stock);
      const selling = parseInt(req.body.selling);
      const purchase = parseInt(req.body.purchase);
      const photo = await cloudinary.uploader.upload(req.file.path, {
        folder: "ncrud",
      });
      const data = {
        id,
        name,
        stock,
        selling,
        purchase,
        photo: photo.url,
      };
      await updateGood(data);
      response(res, 200, true, data, "Update good data success");
    } catch (err) {
      console.log("Update good data error", err);
      response(res, 400, false, "Update good data failed");
    }
  },
  delete: async (req, res, next) => {
    try {
      await deleteGood(req.params.id);
      response(res, 200, true, null, "Delete good success");
    } catch (err) {
      console.log("Delete good error", err);
      response(res, 400, false, err, "Delete good failed");
    }
  },
};

exports.goodController = goodController;
