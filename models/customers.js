const mongoose = require("mongoose");
const { Schema, model } = mongoose;
 const mongooseLeanVirtuals = require('mongoose-lean-virtuals');
const bcrypt = require('bcryptjs');
const customerSchema = new Schema(
  {
    firstname: {
      type: String,
      required:[true,'Tên không được bỏ trống'],
      maxLength: [50, "fistname không được vượt quá 50 kí tự"],
    },
    lastname: {
        type: String,
        required:[true,'Họ không được bỏ trống'],
        maxLength: [100, "lastname không được vượt quá 100 kí tự"],
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
      maxLength: [50,'Email không được vượt quá 50 kí tự'],
      unique: [50,'Email không được bỏ trùng'],
    },

    phonenumber: {
      type: String,
      validate: {
        validator: function (value) {
          const phoneRegex = /\(?([0-9]{3})\)?([ .-]?)([0-9]{3})\2([0-9]{4})/;
          return phoneRegex.test(value);
        },
        message: `{VALUE} không phải là số điện thoại hợp lệ`,
      },
    },

    address: {
      type: String,
      required: [true, 'Địa chỉ không được bỏ trống'],
      maxLength: [500, "Địa chỉ không được vượt quá 50 kí tự"],
      unique: [true, 'Địa chỉ không được trùng'],
    },
  
    password: {
      type: String,
      required: true,
      minLength: [3, 'Không được ít hơn 3 ký tự'],
      maxLength: [12, 'Không được vượt quá 12 ký tự'],
    },

    birthday : {type:Date},

    isDelete: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  },
);
 customerSchema.virtual('fullName').get(function () {
  return `${this.firstname} ${this.lastname}`;
 });



 customerSchema.pre('save', async function (next) {
  try {
    // generate salt key
    const salt = await bcrypt.genSalt(10); // 10 ký tự ABCDEFGHIK + 123456
    // generate password = salt key + hash key
    const hashPass = await bcrypt.hash(this.password, salt);
    // override password
    this.password = hashPass;

    next();
  } catch (err) {
    next(err);
  }
});

customerSchema.methods.isValidPass = async function(password) {
  try {
    return await bcrypt.compare(password, this.password);
  } catch (err) {
    throw new Error(err);
  }
};




 // Config
customerSchema.set('toJSON', { virtuals: true });
customerSchema.set('toObject', { virtuals: true });
//
customerSchema.plugin(mongooseLeanVirtuals);


const customers = model("customers", customerSchema);
module.exports = customers;
