const { fuzzySearch } = require("../../utitl");
const { Customer } = require("../../models");

async function getAll(req, res, next) {
  try {
    const payload = await Customer.find({ isDelete: false });

    res.send(200, {
      payload,
      message: "lấy danh sách thành công",
    }); 
  } catch (error) {
    res.send(400, {
      error,
      message: "lấy danh sách không thành công",
    });
  }
}

async function create(req, res, next) {
  try {
    const {
      firstname,
      lastname,
      email,
      phonenumber,
      address,
      password,
      birthday,
    } = req.body;

    const newCustomer = new Customer({
      firstname,
      lastname,
      email,
      phonenumber,
      address,
      password,
      birthday,
    });
    const payload = await newCustomer.save();

    res.send(200, {
      payload,
      message: "Tạo thành công",
    });
  } catch (error) {
    console.log("««««« error »»»»»", error);

    res.send(400, {
      error,
      message: "Tạo không  thành công",
    });
  }
}

async function search(req, res, next) {
  try {
    const { lastName, address, email } = req.query;
    const conditionFind = { isDeleted: false };

    // if (name) conditionFind.name = fuzzySearch(firstName);
    if (address) conditionFind.address = fuzzySearch(lastName);
    if (email) conditionFind.email = fuzzySearch(address);
    if (email) conditionFind.email = fuzzySearch(email);

    const payload = await Supplier.find(conditionFind);

    res.send(200, {
      payload,
      message: "tìm kiếm thành công",
    });
  } catch (error) {
    res.send(400, {
      error,
      message: "tìm kiếm thất bại",
    });
  }
}

async function getDetail(req, res, next) {
  try {
    const { id } = req.params;
    const payload = await Customer.findOne({
      _id: id,
      isDeleted: false,
    });
    if (!payload) {
      return res.send(400, {
        message: "Không tìm thấy",
      });
    }
    res.send(200, {
      payload,
      message: "xem chi tiết thành công",
    });
  } catch (error) {
    res.send(400, {
      error,
      message: "xem chi tiết không thành công",
    });
  }
}

async function update(req, res, next) {
  try {
    const { id } = req.params;

    const payload = await Supplier.findOneAndUpdate(
      { _id: id, isDeleted: false },
      { ...req.body },
      { new: true }
    );
    if (payload) {
      return res.send(200, {
        payload,
        message: "cập nhật thành công",
      });
    }
    return res.send(404, { message: "Không tìm thấy" });
  } catch (error) {
    console.log("««««« error »»»»»", error);
    res.send(400, {
      error,
      message: "cập nhật không thành công",
    });
  }
}

async function deleteFunc(req, res, next) {
  try {
    const { id } = req.params;
    const payload = await Customer.findOneAndUpdate(
      { _id: id, isDeleted: false },
      { isDeleted: true },
      { new: true }
    );

    if (payload) {
      return res.send(200, {
        payload,
        message: "Xóa thành công",
      });
    }

    return res.send(200, {
      message: "không tìm thấy",
    });
  } catch (error) {
    res.send(400, {
      error,
      message: "Xóa không  thành công",
    });
  }
}

module.exports = {
  getAll,
  create,
  search,
  getDetail,
  update,
  deleteFunc,
};
