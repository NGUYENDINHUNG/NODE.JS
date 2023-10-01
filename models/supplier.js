const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const SupplierSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      maxLength: [100, "Tên nhà cung cấp không được vượt quá 100 kí tự"],
    },
    email: {
      type: String,
      valdate: {
        validator: function (value) {
          const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
          return emailRegex.test(value);
        },
        message: `{VALUE} không phải email hợp lệ`,
      },
      require: [true, "Email không được bỏ trống "],
      unique: true,
    },
    phoneNumber: {
      type: String,
      validate: {
        validator: function (value) {
          const phoneRegex = /\(?([0-9]{3})\)?([ .-]?)([0-9]{3})\2([0-9]{4})/;
          return phoneRegex.test(value);
        },
        message: `{VALUE} không phải là số điện thoại hợp lệ`,
      },
      unique: true,
    },

    address: {
      type: String,
      maxLength: [500, "Địa chỉ không được vượt quá 50 kí tự"],
    },
    isDeleted: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

const Supplier = model("suppliers", SupplierSchema);
module.exports = Supplier;
