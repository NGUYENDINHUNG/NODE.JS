const { getQueryDateTime, fuzzySearch } = require("../../utitl");
const {
  Category,
  Supplier,
  Customer,
  Employee,
  Product,
  Order,
} = require("../../models");
const customers = require("../../models/customers");

module.exports = {
  question1: async (req, res, next) => {
    try {
      const conditionFind = {
        discount: { $lte: 10 },
      };

      console.log("««««« conditionFind »»»»»", conditionFind);

      let results = await Product.find(conditionFind);
      let total = await Product.countDocuments();

      return res.sendStatus(200).json({
        code: 200,
        total,
        totalResult: results.length,
        payload: results,
      });
    } catch (err) {
      return res.status(500).json({ code: 500, error: err });
    }
  },

  question1a: async (req, res, next) => {
    try {
      const { discount } = req.query;
      const conditionFind = {};

      if (discount) conditionFind.discount = { $gte: discount };

      let results = await Product.find(conditionFind)
        .populate("category")
        .populate("supplier");
      let total = await Product.countDocuments();

      return res.sendStatus(200).json({
        code: 200,
        total,
        totalResult: results.length,
        payload: results,
      });
    } catch (err) {
      return res.status(500).json({ code: 500, error: err });
    }
  },

  question2a: async (req, res, next) => {
    try {
      const conditionFind = {
        discount: { $lt: 10 },
      };

      console.log("««««« conditionFind »»»»»", conditionFind);

      let results = await Product.find(conditionFind);
      let total = await Product.countDocuments();

      return res.sendStatus(200).json({
        code: 200,
        total,
        totalResult: results.length,
        payload: results,
      });
    } catch (err) {
      return res.status(500).json({ code: 500, error: err });
    }
  },

  question2b: async (req, res, next) => {
    try {
      const { discount } = req.query;
      const conditionFind = {};

      if (discount) conditionFind.discount = { $lt: stock };

      let results = await Product.find(conditionFind)
        .populate("category")
        .populate("supplier");
      let total = await Product.countDocuments();

      return res.sendStatus(200).json({
        code: 200,
        total,
        totalResult: results.length,
        payload: results,
      });
    } catch (err) {
      return res.status(500).json({ code: 500, error: err });
    }
  },

  question3: async (req, res, next) => {
    try {
      // let discountedPrice = price * (100 - discount) / 100;
      const s = { $subtract: [100, "$discount"] }; // (100 - 10) s => 90

      const m = { $multiply: ["$price", s] }; // price * 90

      const d = { $divide: [m, 100] }; // price * 90 / 100

      const conditionFind = { $expr: { $lte: [d, 6000] } };
      // const conditionFind = { $expr: { $lte: [{ $divide: [{ $multiply: ['$price', { $subtract: [100, '$discount'] }] }, 100] }, 1000] } };
      // const conditionFind = { discount : { $lte: 1000 }}; SAI

      let results = await Product.find(conditionFind)
        .populate("category")
        .populate("supplier")
        // .select('-categoryId -supplierId -description')
        .lean(); // convert data to object

      // const newResults = results.map((item) => {
      //   const dis = item.price * (100 - item.discount) / 100;
      //   return {
      //     ...item,
      //     dis,
      //   }
      // }).filter((item) => item.dis <= 1000);

      // console.log('««««« newResults »»»»»', newResults);

      let total = await Product.countDocuments();

      return res.sendStatus(200).json({
        code: 200,
        total,
        totalResult: results.length,
        payload: results,
      });
    } catch (err) {
      return res.status(500).json({ code: 500, error: err });
    }
  },

  question3a: async (req, res, next) => {
    try {
      const s = { $subtract: [100, "$discount"] }; // (100 - 10) s => 90

      const m = { $multiply: ["$price", s] }; // price * 90

      const d = { $divide: [m, 100] }; // price * 90 / 100

      const { price } = req.query;

      const conditionFind = { $expr: { $lte: [d, parseFloat(price)] } };

      console.log("««««« conditionFind »»»»»", conditionFind);

      let results = await Product.find(conditionFind).lean(); // convert data to object

      let total = await Product.countDocuments();

      return res.sendStatus(200).json({
        code: 200,
        total,
        totalResult: results.length,
        payload: results,
      });
    } catch (err) {
      return res.status(500).json({ code: 500, error: err });
    }
  },

  question3c: async (req, res, next) => {
    try {
      const s = { $subtract: [100, "$discount"] }; // (100 - 10) s => 90
      const m = { $multiply: ["$price", s] }; // price * 90
      const d = { $divide: [m, 100] }; // price * 90 / 100

      // let results = await Product.aggregate([
      //   {
      //     $match: { $expr: { $lte: [d, 20000] } },
      //   },
      // ]);

      let results = await Product.aggregate().match({
        $expr: { $lte: [d, 20000] },
      });

      let total = await Product.countDocuments();

      return res.sendStatus(200).json({
        code: 200,
        total,
        totalResult: results.length,
        payload: results,
      });
    } catch (err) {
      return res.status(500).json({ code: 500, error: err });
    }
  },

  question3d: async (req, res, next) => {
    try {
      const s = { $subtract: [100, "$discount"] }; // (100 - 10) s => 90
      const m = { $multiply: ["$price", s] }; // price * 90
      const d = { $divide: [m, 100] }; // price * 90 / 100

      // let results = await Product.aggregate([
      //   { $addFields: { disPrice: d } },
      //   {
      //     $match: { $expr: { $lte: ['$disPrice', 1000] } },
      //   },
      //   {
      //     $project: {
      //       categoryId: 0,
      //       supplierId: 0,
      //       description: 0,
      //     },
      //   },
      // ]);

      let results = await Product.aggregate()
        .addFields({ disPrice: d })
        .match({ $expr: { $lte: ["$disPrice", 10000] } })
        .project({
          categoryId: 0,
          supplierId: 0,
          description: 0,
          isDeleted: 0,
          price: 0,
          discount: 0,
        });

      let total = await Product.countDocuments();

      return res.sendStatus(200).json({
        code: 200,
        total,
        totalResult: results.length,
        payload: results,
      });
    } catch (err) {
      console.log("««««« err »»»»»", err);
      return res.status(500).json({ code: 500, error: err });
    }
  },

  question4: async (req, res, next) => {
    try {
      const { address } = req.query;

      const conditionFind = {
        address: fuzzySearch(address),
      };
      // const conditionFind = { address: new RegExp(`${address}`) };
      // const conditionFind = { address: {$eq: address } };

      console.log("««««« conditionFind »»»»»", conditionFind);

      let results = await Customer.find(conditionFind);

      let total = await Customer.countDocuments();

      return res.sendStatus(200).json({
        code: 200,
        total,
        totalResult: results.length,
        payload: results,
      });
    } catch (err) {
      console.log("««««« err »»»»»", err);
      return res.status(500).json({ code: 500, error: err });
    }
  },

  question4a: async (req, res, next) => {
    try {
      const { address } = req.query;

      // const conditionFind = { address: { $regex: new RegExp(`${address}`), $options: 'i' } };
      // const conditionFind = { address: new RegExp(`${address}`) };
      // const conditionFind = { address: {$eq: address } };

      let results = await Customer.aggregate().match({
        address: { $regex: new RegExp(`${address}`), $options: "i" },
      });

      let total = await Customer.countDocuments();

      return res.sendStatus(200).json({
        code: 200,
        total,
        totalResult: results.length,
        payload: results,
      });
    } catch (err) {
      console.log("««««« err »»»»»", err);
      return res.status(500).json({ code: 500, error: err });
    }
  },

  question5: async (req, res, next) => {
    try {
      const { year } = req.query;

      const conditionFind = {
        $expr: {
          $eq: [{ $year: "$birthday" }, year],
        },
      };

      let results = await Customer.find(conditionFind);

      let total = await Customer.countDocuments();

      return res.sendStatus(200).json({
        code: 200,
        total,
        totalResult: results.length,
        payload: results,
      });
    } catch (err) {
      console.log("««««« err »»»»»", err);
      return res.status(500).json({ code: 500, error: err });
    }
  },

  question5a: async (req, res, next) => {
    try {
      const year = Number(req.query.year);

      const conditionFind = {
        $expr: {
          $eq: [{ $year: "$birthday" }, year],
        },
      };

      let results = await Customer.aggregate()
        .match(conditionFind)
        .addFields({
          birthYear: { $year: "$birthday" },
        });

      let total = await Customer.countDocuments();

      return res.sendStatus(200).json({
        code: 200,
        total,
        totalResult: results.length,
        payload: results,
      });
    } catch (err) {
      console.log("««««« err »»»»»", err);
      return res.status(500).json({ code: 500, error: err });
    }
  },

  question6: async (req, res, next) => {
    try {
      const { date } = req.query;
      let today; //today = null( today không có giá trị)

      if (!date) {
        today = new Date(); // không truyền lên thì lấy today là ngày hôm nay
      } else {
        today = new Date(date); // nếu truyền lên là lấy today nhập lên
      }

      const conditionFind = {
        $expr: {
          $and: [
            {
              $eq: [{ $dayOfMonth: "$birthday" }, { $dayOfMonth: today }],
            },
            { $eq: [{ $month: "$birthday" }, { $month: today }] },
          ],
        },
      };

      console.log("««««« conditionFind »»»»»", conditionFind);

      let results = await Customer.find(conditionFind);

      let total = await Customer.countDocuments();

      return res.sendStatus(200).json({
        code: 200,
        total,
        totalResult: results.length,
        payload: results,
      });
    } catch (err) {
      console.log("««««« err »»»»»", err);
      return res.status(500).json({ code: 500, error: err });
    }
  },

  question7: async (req, res, next) => {
    try {
      const { status } = req.query;

      let results = await Order.find({ status }) // ~ match
        .populate({ path: "customer", select: "firstName lastName" }) // select để chọn lọc dữ liệu trả về
        // .populate('customer')
        .populate("employee")
        .populate({
          path: "productList.product",
          select: { name: 1, stock: 1 },
        })
        .lean();

      let total = await Order.countDocuments();

      return res.sendStatus(200).json({
        code: 200,
        total,
        totalResult: results.length,
        payload: results,
      });
    } catch (err) {
      console.log("««««« err »»»»»", err);
      return res.status(500).json({ code: 500, error: err });
    }
  },

  question8a: async (req, res, next) => {
    try {
      let { status, date } = req.query;
      const findDate = date ? new Date(date) : new Date();

      const conditionFind = {
        $expr: {
          $and: [
            // { $eq: ['$status', status] },
            { status },
            {
              $eq: [{ $dayOfMonth: "$shippedDate" }, { $dayOfMonth: findDate }],
            },
            { $eq: [{ $month: "$shippedDate" }, { $month: findDate }] },
            { $eq: [{ $year: "$shippedDate" }, { $year: findDate }] },
          ],
        },
      };

      let results = await Order.find(conditionFind).lean();

      let total = await Order.countDocuments();

      return res.sendStatus(200).json({
        code: 200,
        total,
        totalResult: results.length,
        payload: results,
      });
    } catch (err) {
      console.log("««««« err »»»»»", err);
      return res.status(500).json({ code: 500, error: err });
    }
  },

  question8b: async (req, res, next) => {
    try {
      let { status, fromDate, toDate } = req.query;

      fromDate = new Date(fromDate);
      fromDate.setHours(0, 0, 0, 0);

      const tmpToDate = new Date(toDate);
      tmpToDate.setHours(0, 0, 0, 0);
      toDate = new Date(tmpToDate.setDate(tmpToDate.getDate() + 1));

      const compareStatus = { $eq: ["$status", status] };
      const compareFromDate = { $gte: ["$shippedDate", fromDate] };
      const compareToDate = { $lt: ["$shippedDate", toDate] };

      const conditionFind = {
        $expr: { $and: [compareStatus, compareFromDate, compareToDate] },
      };

      let results = await Order.find(conditionFind)
        .populate("productList.product")
        .populate("customer")
        .populate("employee")
        .lean();

      let total = await Order.countDocuments();

      return res.sendStatus(200).json({
        code: 200,
        total,
        totalResult: results.length,
        payload: results,
      });
    } catch (err) {
      console.log("««««« err »»»»»", err);
      return res.status(500).json({ code: 500, error: err });
    }
  },

  question8c: async (req, res, next) => {
    try {
      let { status, fromDate, toDate } = req.query;

      fromDate = new Date(fromDate);
      fromDate.setHours(0, 0, 0, 0);

      const tmpToDate = new Date(toDate);
      tmpToDate.setHours(0, 0, 0, 0);
      toDate = new Date(tmpToDate.setDate(tmpToDate.getDate() + 1));

      const compareStatus = { $eq: ["$status", status] };
      const compareFromDate = { $lt: ["$shippedDate", fromDate] };
      const compareToDate = { $gt: ["$shippedDate", toDate] };

      const conditionFind = {
        $expr: {
          $or: [
            {
              $and: [compareStatus, compareFromDate],
            },
            {
              $and: [compareStatus, compareToDate],
            },
          ],
        },
      };

      let results = await Order.find(conditionFind)
        .populate("productList.product")
        .populate("customer")
        .populate("employee")
        .lean();

      let total = await Order.countDocuments();

      return res.sendStatus(200).json({
        code: 200,
        total,
        totalResult: results.length,
        payload: results,
      });
    } catch (err) {
      console.log("««««« err »»»»»", err);
      return res.status(500).json({ code: 500, error: err });
    }
  },

  question11: async (req, res, next) => {
    try {
      const { paymentType } = req.query;

      let results = await Order.find({ paymentType }) // ~ match
        .populate({ path: "customer", select: "firstName lastName" }) // select để chọn lọc dữ liệu trả về
        // .populate('customer')
        .populate("employee")
        .populate({
          path: "productList.product",
          select: { name: 1, stock: 1 },
        })
        .lean();

      let total = await Order.countDocuments();

      return res.sendStatus(200).json({
        code: 200,
        total,
        totalResult: results.length,
        payload: results,
      });
    } catch (err) {
      console.log("««««« err »»»»»", err);
      return res.status(500).json({ code: 500, error: err });
    }
  },

  question14: async (req, res, next) => {
    try {
      const { date } = req.query;
      let today; //today = null( today không có giá trị)

      if (!date) {
        today = new Date(); // không truyền lên thì lấy today là ngày hôm nay
      } else {
        today = new Date(date); // nếu truyền lên là lấy today nhập lên
      }

      const conditionFind = {
        $expr: {
          $and: [
            {
              $eq: [{ $dayOfMonth: "$birthday" }, { $dayOfMonth: today }],
            },
            { $eq: [{ $month: "$birthday" }, { $month: today }] },
          ],
        },
      };

      console.log("««««« conditionFind »»»»»", conditionFind);

      let results = await Employee.find(conditionFind);

      let total = await Employee.countDocuments();

      return res.sendStatus(200).json({
        code: 200,
        total,
        totalResult: results.length,
        payload: results,
      });
    } catch (err) {
      console.log("««««« err »»»»»", err);
      return res.status(500).json({ code: 500, error: err });
    }
  },

  question13: async (req, res, next) => {
    try {
      let { address } = req.query;

      let results = await Order.aggregate()
        .lookup({
          from: "customers",
          localField: "customerId",
          foreignField: "_id",
          as: "customer",
        })
        .unwind("customer")
        .match({
          "customer.address": {
            $regex: new RegExp(`${address}`),
            $options: "i",
          },
        })
        .project({
          customerId: 0,
          employeeId: 0,
        });

      let total = await Order.countDocuments();

      return res.sendStatus(200).json({
        code: 200,
        total,
        totalResult: results.length,
        payload: results,
      });
    } catch (err) {
      console.log("««««« err »»»»»", err);
      return res.status(500).json({ code: 500, error: err });
    }
  },

  question15: async (req, res, next) => {
    try {
      let { supplierNames } = req.query;

      let conditionFind = {
        name: { $in: supplierNames },
      };

      let results = await Supplier.find(conditionFind);

      let total = await Supplier.countDocuments();

      return res.sendStatus(200).json({
        code: 200,
        total,
        totalResult: results.length,
        payload: results,
      });
    } catch (err) {
      console.log("««««« err »»»»»", err);
      return res.status(500).json({ code: 500, error: err });
    }
  },

  question16: async (req, res, next) => {
    try {
      let results = await Order.find().populate("customer");
      let total = await Order.countDocuments();

      return res.sendStatus(200).json({
        code: 200,
        total,
        totalResult: results.length,
        payload: results,
      });
    } catch (err) {
      return res.status(500).json({ code: 500, error: err });
    }
  },

  question18: async (req, res, next) => {
    try {
      let results = await Category.aggregate()
        .lookup({
          from: "products",
          localField: "_id", // TRUY VẤN NGƯỢC!!!
          foreignField: "categoryId",
          as: "products",
        })
        // .unwind('products') //   sẽ dẫn dến thiếu dự liệu
        .unwind({
          path: "$products",
          preserveNullAndEmptyArrays: true,
        })
        .group({
          _id: "$_id",
          name: { $first: "$name" },
          description: { $first: "$description" },
          totalStock: {
            $sum: "$products.stock",
          },
          totalProduct: {
            $sum: {
              $cond: {
                if: {
                  $and: [{ $gt: ["$products.stock", 0] }],
                },
                then: 1,
                else: 0,
              },
            },
          },
        })
        .sort({
          totalProduct: -1,
          name: -1,
        });

      let total = await Category.countDocuments();

      return res.sendStatus(200).json({
        code: 200,
        total,
        totalResult: results.length,
        payload: results,
      });
    } catch (err) {
      console.log("««««« err »»»»»", err);
      return res.status(500).json({ code: 500, error: err });
    }
  },

  question19: async (req, res, next) => {
    try {
      let results = await Supplier.aggregate()
        .lookup({
          from: "products",
          localField: "_id", // TRUY VẤN NGƯỢC!!!
          foreignField: "supplierId",
          as: "products",
        })
        // .unwind('products') //   sẽ dẫn dến thiếu dự liệu
        .unwind({
          path: "$products",
          preserveNullAndEmptyArrays: true,
        })
        .group({
          _id: "$_id",
          name: { $first: "$name" },
          description: { $first: "$description" },
          totalStock: {
            $sum: "$products.stock",
          },
          totalProduct: {
            $sum: {
              $cond: {
                if: {
                  $and: [{ $gt: ["$products.stock", 0] }],
                },
                then: 1,
                else: 0,
              },
            },
          },
        })
        .sort({
          totalProduct: -1,
          name: -1,
        });

      let total = await Supplier.countDocuments();

      return res.sendStatus(200).json({
        code: 200,
        total,
        totalResult: results.length,
        payload: results,
      });
    } catch (err) {
      console.log("««««« err »»»»»", err);
      return res.status(500).json({ code: 500, error: err });
    }
  },

  question20: async (req, res, next) => {
    try {
      let { fromDate, toDate } = req.query;
      const conditionFind = getQueryDateTime(fromDate, toDate);

      let results = await Order.aggregate()
        .match({
          ...conditionFind,
          status: { $in: ["WAITING"] },
        })
        .unwind("productList")
        .lookup({
          from: "products",
          localField: "productList.productId",
          foreignField: "_id",
          as: "productList.product",
        })
        .unwind("productList.product")
        .group({
          _id: "$productList.productId",
          name: { $first: "$productList.product.name" },
          price: { $first: "$productList.product.price" },
          discount: { $first: "$productList.product.discount" },
          stock: { $first: "$productList.product.stock" },
          countSale: { $sum: "$productList.quantity" },
          count: { $sum: 1 },
        });

      let total = await Order.countDocuments();

      return res.sendStatus(200).json({
        code: 200,
        total,
        totalResult: results.length,
        payload: results,
      });
    } catch (err) {
      console.log("««««« err »»»»»", err);
      return res.status(500).json({ code: 500, error: err });
    }
  },

  question21: async (req, res, next) => {
    try {
      let { fromDate, toDate } = req.query;
      const conditionFind = getQueryDateTime(fromDate, toDate);

      let results = await Order.aggregate()
        .match(conditionFind)
        .lookup({
          from: "customers",
          localField: "customerId",
          foreignField: "_id",
          as: "customer",
        })
        .unwind("customer")
        .group({
          _id: "$customer._id",
          firstName: { $first: "$customer.firstName" },
          lastName: { $first: "$customer.lastName" },
          email: { $first: "$customer.email" },
          phoneNumber: { $first: "$customer.phoneNumber" },
          address: { $first: "$customer.address" },
          birthday: { $first: "$customer.birthday" },
        });

      let total = await Order.countDocuments();

      return res.sendStatus(200).json({
        code: 200,
        total,
        totalResult: results.length,
        payload: results,
      });
    } catch (err) {
      console.log("««««« err »»»»»", err);
      return res.status(500).json({ code: 500, error: err });
    }
  },

  question22: async (req, res, next) => {
    try {
      let { fromDate, toDate } = req.query;
      const conditionFind = getQueryDateTime(fromDate, toDate);

      let results = await Order.aggregate()
        .match(conditionFind)
      
        .unwind("productList")
        .addFields({
          total: {
            $divide: [
              {
                $multiply: [
                  "$productList.price",
                  { $subtract: [100, "$productList.discount"] },
                  "$productList.quantity",
                ],
              },
              100,
            ],
          },
        })
        .group({
          _id: "$customerId",
          totalMoney: { $sum: "$total" },
        });

      let total = await Order.countDocuments();

      return res.sendStatus(200).json({
        code: 200,
        total,
        totalResult: results.length,
        payload: results,
      });
    } catch (err) {
      console.log("««««« err »»»»»", err);
      return res.status(500).json({ code: 500, error: err });
    }
  },

  question23: async (req, res, next) => {
    try {

      let results = await Order.aggregate()
  
        .unwind({
          path: "$productList",
          preserveNullAndEmptyArrays: true,
        })
        .addFields({
          total: {
            $divide: [
              {
                $multiply: [
                  "$productList.price",
                  { $subtract: [100, "$productList.discount"] },
                  "$productList.quantity",
                ],
              },
              100,
            ],
          },
        })
        .group({
          _id: "$_id",
          total: { $sum: "$total" },
        });

      let total = await Order.countDocuments();

      return res.sendStatus(200).json({
        code: 200,
        total,
        totalResult: results.length,
        payload: results,
      });
    } catch (err) {
      console.log("««««« err »»»»»", err);
      return res.status(500).json({ code: 500, error: err });
    }
  },

  question24: async (req, res, next) => {
    try {
   
      let results = await Order.aggregate()
        .unwind({
          path: '$productList',
          preserveNullAndEmptyArrays: true,
        })

        .addFields({
          total: {
            $sum: {
              $divide: [
                {
                  $multiply: [
                    '$productList.price',
                    { $subtract: [100, '$productList.discount'] },
                    '$productList.quantity',
                  ],
                },
                100,
              ],
            },
          },
        })
        .group({
          _id: '$employeeId',
          total: { $sum: '$total' },
        })
        .lookup({
          from: 'employees',
          localField: '_id',
          foreignField: '_id',
          as: 'employee',
        })
        .unwind('employee')
        .project({
          totalPrice: '$total',
          firstName: '$employee.firstName',
          lastName: '$employee.lastName',
          phoneNumber: '$employee.phoneNumber',
          address: '$employee.address',
          email: '$employee.email ',
        })

      let total = await Order.countDocuments();

      return res.sendStatus(200).json({
        code: 200,
        total,
        totalResult: results.length,
        payload: results,
      });
    } catch (err) {
      console.log('««««« err »»»»»', err);
      return res.status(500).json({ code: 500, error: err });
    }
  },

  question25: async (req, res, next) => {
    try {
      let results = await Product.aggregate()
        .lookup({
          from: 'orders',
          localField: '_id',
          foreignField: 'productList.productId',
          as: 'orders',
        })
        .match({
          orders: { $size: 0 },
        })
        .project({
          name: 1,
          price: 1,
          stock: 1,
        })

      let total = await Product.countDocuments();

      return res.sendStatus(200).json({
        code: 200,
        total,
        totalResult: results.length,
        payload: results,
      });
    } catch (err) {
      console.log('««««« err »»»»»', err);
      return res.status(500).json({ code: 500, error: err });
    }
  },


  question26: async (req, res, next) => {
    try {
      let { fromDate, toDate } = req.query;
      fromDate = new Date(fromDate);

      const tmpToDate = new Date(toDate);
      toDate = new Date(tmpToDate.setDate(tmpToDate.getDate() + 1));

      let results = await Supplier.aggregate()
        .lookup({
          from: 'products',
          localField: '_id',
          foreignField: 'supplierId',
          as: 'products',
        })
        .unwind({
          path: '$products',
          preserveNullAndEmptyArrays: true,
        })
        .lookup({
          from: 'orders',
          localField: 'products._id',
          foreignField: 'productList.productId',
          as: 'orders',
        })
        .unwind({
          path: '$orders',
          preserveNullAndEmptyArrays: true,
        })
        .project({
          name: 1,
          orders: 1,
          
        })
      .match({
        $or: [
          { orders: null },
          {
            $and: [
              { orders: { $ne: null } },
              {
                $or: [
                  { 'orders.createdDate': { $lte: fromDate } },
                  { 'orders.createdDate': { $gte: toDate } },
                ],
              },
            ],
          }
        ],
      })
      .group({
        _id: '$_id',
        name: { $first: '$name' },
      })

      let total = await Supplier.countDocuments();

      return res.sendStatus(200).json({
        code: 200,
        total,
        totalResult: results.length,
        payload: results,
      });
    } catch (err) {
      console.log('««««« err »»»»»', err);
      return res.status(500).json({ code: 500, error: err });
    }
  },

  questionTest: async (req, res, next) => {
    try {
     
      let results = await Employee.aggregate()
  
        .lookup({
          from: 'orders',//muốn loopkup đến bảng nào
          localField: '_id',//là id trong bảng employee
          foreignField: 'employeeId',//là id của employee trong bảng order
          as: 'orders',
        })
  
        .unwind({
          path: '$orders',
          preserveNullAndEmptyArrays: true,
        })
     
        .unwind({
          path: '$orders.productList',
          preserveNullAndEmptyArrays: true,
        })
        .addFields({
          "total": {
            $divide: [
              {
                $multiply: [
                  '$orders.productList.price',
                  { $subtract: [100, '$orders.productList.discount'] },
                  '$orders.productList.quantity',
                ],
              },
              100,
            ],
          },
        })
        .group({
          _id: '$_id',
          firstName: { $first: '$firstName'},
          lastName: { $first: '$lastName'},
          phoneNumber: { $first: '$phoneNumber'},
          email: { $first: '$email'},
          total: { $sum: '$total' },
        })

      let total = await Order.countDocuments();

      return res.sendStatus(200).json({
        code: 200,
        total,
        totalResult: results.length,
        payload: results,
      });
    } catch (err) {
      console.log('««««« err »»»»»', err);
      return res.status(500).json({ code: 500, error: err });
    }
  },
   
  question27: async (req, res, next) => {
    try {
      let { fromDate, toDate } = req.query;
      const conditionFind = getQueryDateTime(fromDate, toDate);

      let results = await Order.aggregate()
        .match(conditionFind)

        .unwind('productList')

        .addFields({
          'productList.originalPrice': {                                                       
            $divide: [//chia
              {
                $multiply: [//nhân
                  '$productList.price',
                  { $subtract: [100, '$productList.discount'] },//trừ
             
                ],
              },
              100,
            ],
          },
        })
        .group({
          _id: '$employeeId',
        
          totalSales: { 
          
            $sum: { $multiply: ['$productList.originalPrice', '$productList.quantity'] },
          },
        })
        .lookup({
          from: 'employees',
          localField: '_id',//id của employee do group employeeId
          foreignField: '_id',
          as: 'employees',
        }) 
        .unwind('employees')
        .project({
          employeeId: '$_id',
          firstName: '$employees.firstName',
          lastName: '$employees.lastName',
          phoneNumber: '$employees.phoneNumber',
          address: '$employees.address',
          email: '$employees.email',
          totalSales: 1,
        })
        .sort({ totalSales: -1 })
        .limit(3)
        .skip(0);



      let total = await Order.countDocuments();

      return res.sendStatus(200).json({
        code: 200,
        total,
        totalResult: results.length,
        payload: results,
      });
    } catch (err) {
      console.log('««««« err »»»»»', err);
      return res.status(500).json({ code: 500, error: err });
    }
  },

  question28: async (req, res, next) => {
    try {
      let { fromDate, toDate } = req.query;
      const conditionFind = getQueryDateTime(fromDate, toDate);

      let results = await Order.aggregate()
        .match(conditionFind)

        .unwind('productList')

        .addFields({
          'productList.originalPrice': {
            $divide: [
              {
                $multiply: [
                  '$productList.price',
                  { $subtract: [100, '$productList.discount'] },
             
                ],
              },
              100,
            ],
          },
        })
        .group({
          _id: '$customerId',
        
          totalSales: { 
          
            $sum: { $multiply: ['$productList.originalPrice', '$productList.quantity'] },
          },
        })
        .lookup({
          from: 'customers',
          localField: '_id',
          foreignField: '_id',
          as: 'customers',
        }) 
        .unwind('customers')
        .project({
          employeeId: '$_id',
          firstName: '$customers.firstName',
          lastName: '$customers.lastName',
          phoneNumber: '$customers.phoneNumber',
          address: '$customers.address',
          email: '$customers.email',
          totalSales: 1,
        })
        .sort({ totalSales: -1 })
        .limit(5)
        .skip(0);



      let total = await Order.countDocuments();

      return res.sendStatus(200).json({
        code: 200,
        total,
        totalResult: results.length,
        payload: results,
      });
    } catch (err) {
      console.log('««««« err »»»»»', err);
      return res.status(500).json({ code: 500, error: err });
    }
  },

  question29: async (req, res, next) => {
    try {

      let results = await Product.distinct('discount')

      let total = await Product.countDocuments();

      return res.sendStatus(200).json({
        code: 200,
        total,
        totalResult: results.length,
        payload: results,
      });
    } catch (err) {
      console.log('««««« err »»»»»', err);
      return res.status(500).json({ code: 500, error: err });
    }
  },

  question30: async (req, res, next) => {
    try {
      let results = await Category.aggregate()
        .lookup({
          from: 'products',
          localField: '_id',
          foreignField: 'categoryId',
          as: 'products'
        })
        .unwind({
          path: '$products',
          preserveNullAndEmptyArrays: true,
        })
        .lookup({
          from: 'orders',
          localField: 'products._id',
          foreignField: 'productList.productId',
          as: 'orders'
        })
        .unwind({
          path: '$orders',
          preserveNullAndEmptyArrays: true,
        })
        .unwind({
          path: '$orders.productList',
          preserveNullAndEmptyArrays: true,
        })
        .addFields({
          originalPrice: {
            $divide: [
              {
                $multiply: [
                  '$orders.productList.price',
                  { $subtract: [100, '$orders.productList.discount'] },
                ],
              },
              100,
            ],
          },
          amount: '$orders.productList.quantity',
        })
        .group({
          _id: {
            "order":"$orders._id",
            "product":""
          },
          name: { $first: '$name' },
          description: { $first: '$description' },
          total: {
            $sum: { $multiply: ['$originalPrice', '$amount'] },
          },
        })

      let total = await Order.countDocuments();

      return res.sendStatus(200).json({
        code: 200,
        total,
        totalResult: results.length,
        payload: results,
      });
    } catch (err) {
      console.log('««««« err »»»»»', err);
      return res.status(500).json({ code: 500, error: err });
    }
  },

  question31: async (req, res, next) => {
    try {
      let { fromDate, toDate } = req.query;
      const conditionFind = getQueryDateTime(fromDate, toDate);

      let results = await Order.aggregate()
        .match({
          ...conditionFind,
          status: { $in: ["WAITING"] },
        })
    
        .unwind({
          path: "$productList",
          preserveNullAndEmptyArrays: true,
        })
        .addFields({
          total: {
            $divide: [
              {
                $multiply: [
                  "$productList.price",
                  { $subtract: [100, "$productList.discount"] },
                  "$productList.quantity",
                ],
              },
              100,
            ],
          },
        })
        .group({
          _id: "$_id",
          total: { $sum: "$total" },
        });


      let total = await Order.countDocuments();

      return res.sendStatus(200).json({
        code: 200,
        total,
        totalResult: results.length,
        payload: results,
      });
    } catch (err) {
      console.log("««««« err »»»»»", err);
      return res.status(500).json({ code: 500, error: err });
    }
  },

  question32: async (req, res, next) => {
    try {
      let { fromDate, toDate } = req.query;
      const conditionFind = getQueryDateTime(fromDate, toDate);

      let results = await Order.aggregate()
        .match(conditionFind)
    
        .unwind({
          path: "$productList",
          preserveNullAndEmptyArrays: true,
        })
        .addFields({
          total: {
            $divide: [
              {
                $multiply: [
                  "$productList.price",
                  { $subtract: [100, "$productList.discount"] },
                  "$productList.quantity",
                ],
              },
              100,
            ],
          },
        })
        .group({
          _id: "$_id",
          total: { $sum: "$total" },
        })
        .sort({ total: -1 })
        .limit(7)
        .skip(0);

      let total = await Order.countDocuments();

      return res.sendStatus(200).json({
        code: 200,
        total,
        totalResult: results.length,
        payload: results,
      });
    } catch (err) {
      console.log("««««« err »»»»»", err);
      return res.status(500).json({ code: 500, error: err });
    }
  },

  question33: async (req, res, next) => {
    try {
      let { fromDate, toDate } = req.query;
      const conditionFind = getQueryDateTime(fromDate, toDate);

      let results = await Order.aggregate()
        .match(conditionFind)
    
        .unwind({
          path: "$productList",
          preserveNullAndEmptyArrays: true,
        })
        .addFields({
          total: {
            $divide: [
              {
                $multiply: [
                  "$productList.price",
                  { $subtract: [100, "$productList.discount"] },
                  "$productList.quantity",
                ],
              },
              100,
            ],
          },
        })
        .group({
          _id: "$_id",
          total: { $sum: "$total" },
        })
        .sort({ total: +1 })
        .limit(7)
        .skip(0);

      let total = await Order.countDocuments();

      return res.sendStatus(200).json({
        code: 200,
        total,
        totalResult: results.length,
        payload: results,
      });
    } catch (err) {
      console.log("««««« err »»»»»", err);
      return res.status(500).json({ code: 500, error: err });
    }
  },

  question34: async (req, res, next) => {
    try {
      let { fromDate, toDate } = req.query;
      const conditionFind = getQueryDateTime(fromDate, toDate);

      let results = await Order.aggregate()
        .match(conditionFind)
    
        .unwind({
          path: "$productList",
          preserveNullAndEmptyArrays: true,
        })
        .addFields({
          total: {
            $divide: [
              {
                $multiply: [
                  "$productList.price",
                  { $subtract: [100, "$productList.discount"] },
                  "$productList.quantity",
                ],
              },
              100,
            ],
          },
        })
        .group({
          _id: "$_id",
          totalAvg: { $avg: "$total" },
        })
        .sort({ total: -1 })
        .limit(7)
        .skip(0);

      let total = await Order.countDocuments();

      return res.sendStatus(200).json({
        code: 200,
        total,
        totalResult: results.length,
        payload: results,
      });
    } catch (err) {
      console.log("««««« err »»»»»", err);
      return res.status(500).json({ code: 500, error: err });
    }
  },

};
