const { fuzzySearch } = require("../../utitl");
const { Category } = require("../../models/");

async function getAll(req, res, next) {
  try {
    const payload = await Category.find({
      isDeleted: false,
    });
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
    const { name, isDeleted, description } = req.body;

    const newCategory = new Category({
      name,
      isDeleted,
      description,
    });

    const payload = await newCategory.save();

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
    const { name } = req.query;
    const conditionFind = { isDeleted: false };

    if (name) {
      conditionFind.name = fuzzySearch(name);
    }
    const payload = await Category.find(conditionFind);

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
  const { name } = req.query;
}

async function getDetail(req, res, next) {
  try {
    const { id } = req.params;
    //  const payload = await Category.findById(id );
    const payload = await Category.findOne({
      _id: id,
      isDeleted: false,
    });
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

    const patchData = req.body;

    const payload = await Category.findOneAndUpdate(
      {
        _id: id,
        isDeleted: false,
      },
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
    const payload = await Category.findOneAndUpdate(
      {
        _id: id,
        isDeleted: false,
      },
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
      payload,
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
