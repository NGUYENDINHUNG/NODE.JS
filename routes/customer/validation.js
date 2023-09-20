const yup = require("yup");

const customerSchema = yup.object({
  body: yup.object({
    firstname: yup
      .string()
      .required()
      .max(50, "Tên không được vợt quá 50 kí tự"),
    lastname: yup
      .string()
      .required()
      .max(50, "Họ không được vượt quá 50 kí tự"),
    email: yup
      .string()
      .test("email type", "${path}Khoong phaỉ email hợp lệ", (value) => {
        const emailRegex = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
        return emailRegex.test(value);
      }),

    phonenumber: yup
      .string()
      .required()
      .test(
        "phoneNumber type",
        "${path}Không phải số điện thoại hợp lệ",
        (value) => {
          const phoneRegex =
            /^(0?)(3[2-9]|5[6|8|9]|7[0|6-9]|8[0-6|8|9]|9[0-4|6-9])[0-9]{7}$/;
          return phoneRegex.test(value);
        }
      ),

    address: yup.string().max(300, "Địa chỉ quá dài").required(),
    birthday: yup.date(),

   
  
  password: yup.string()
  .required()
  .min(3, 'Không được ít hơn 3 ký tự')
  .max(12, 'Không được vượt quá 12 ký tự'),
  }),
});

const customerPatchSchema = yup.object({
  body: yup.object({
    firstname: yup
      .string()
      .required()
      .max(50, "Tên không được vợt quá 50 kí tự"),
    lastname: yup
      .string()
      .required()
      .max(50, "Họ không được vượt quá 50 kí tự"),
    email: yup
      .string()
      .test("email type", "${path}Khoong phaỉ email hợp lệ", (value) => {
        const emailRegex = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
        return emailRegex.test(value);
      }),

    phonenumber: yup
      .string()
      .required()
      .test(
        "phoneNumber type",
        "${path}Không phải số điện thoại hợp lệ",
        (value) => {
          const phoneRegex =
            /^(0?)(3[2-9]|5[6|8|9]|7[0|6-9]|8[0-6|8|9]|9[0-4|6-9])[0-9]{7}$/;
          return phoneRegex.test(value);
        }
      ),

    address: yup.string().max(300, "Địa chỉ quá dài").required(),
    birthday: yup.date(),

    password: yup.string()
      .min(3, 'Không được ít hơn 3 ký tự')
      .max(12, 'Không được vượt quá 12 ký tự')
  }),
});

module.exports = {
  customerSchema,
  customerPatchSchema,
};
