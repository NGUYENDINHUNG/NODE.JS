const { fuzzySearch } = require("../../utitl");
const { Supplier } = require("../../models");

async function getAll(req, res, next) {
  try {
    const payload = await Supplier.find( {isDelete : false});
    res.status(200).json(
       {
      payload,
      message: "lấy danh sách thành công",
    });
  } catch (error) {
    res.status(400).json( {
      error,
      message: "lấy danh sách không thành công",
    });
  }
}
async function create(req, res, next) {
  try {
    const { name, email, phoneNumber, address } = req.body;

    const newSupplier = new Supplier({
      name,
      email,
      phoneNumber,
      address,
    });
    const payload = await newSupplier.save();

    res.status(200).json( {
      payload,
      message: "Tạo thành công",
    });
  } catch (error) {
    console.log("««««« error »»»»»", error);

    res.status(400).json( {
      error,
      message: "Tạo không  thành công",
    });
  }
}

async function search(req, res, next) {
  try {
    const { name, address, email } = req.query;
    const conditionFind = { isDeleted: false };

    if (name) conditionFind.name = fuzzySearch(name);
    if (address) conditionFind.address = fuzzySearch(address);
    if (email)conditionFind.email = fuzzySearch(email);

    const payload = await Supplier.find(conditionFind);

    res.status(200).json( {
      payload,
      message: "tìm kiếm thành công",
    });
  } catch (error) {
    res.status(400).json( {
      error,
      message: "tìm kiếm thất bại",
    });
  }
};

async function getDetail(req, res, next) {
  try {
    const { id } = req.params;
    const payload = await Supplier.findOne({
      _id: id,
      isDeleted: false,
    });
     if(!payload){
      return res.status(400).json({
        message:"Không tìm thấy"
      });
     }
    res.status(200).json( {
      payload,
      message: "xem chi tiết thành công",
    });
  } catch (error) {
    res.status(400).json( {
      error,
      message: "xem chi tiết không thành công",
    });
  }
};

async function update(req, res, next) {
  try {
    const { id } = req.params;

    const payload = await Supplier.findOneAndUpdate(
      {
        _id: id,
        isDeleted: false,
      },
      { ...req.body },
      { new: true }
    );
    if (payload) {
      return res.status(200).json( {
        payload,
        message: "cập nhật thành công",
      });
    }
    return res.status(404).json( { message: "Không tìm thấy" });
  } catch (error) {
    console.log("««««« error »»»»»", error);
    res.status(400).json( {
      error,
      message: "cập nhật không thành công",
    });
  }
};

async function deleteFunc(req, res, next) {
  try {
    const { id } = req.params;
    const payload = await Supplier.findOneAndUpdate(
      {
        _id: id,
        isDeleted: false,
      },
      { isDeleted: true },
      { new: true }
    );

    if (payload) {
      return res.status(200).json( {
        payload,
        message: "Xóa thành công",
      });
    }

    return res.status(200).json( {
      message: "không tìm thấy",
    });
  } catch (error) {
    res.status(400).json( {
      error,
      message: "Xóa không  thành công",
    });
  }
};

module.exports = {
  getAll,
  create,
  search,
  getDetail,
  update,
  deleteFunc,
};
