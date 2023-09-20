const yup = require("yup");

const productSchema = yup.object({
  body: yup.object({
    name: yup.string().max(500).required(),
    isDeleted: yup.bool(),
    description: yup.string().max(500),
  }),
});

const productPatchSchema = yup.object({
  body: yup.object({
    name: yup.string().max(500),
    isDeleted: yup.bool(),
    description: yup.string().max(500),
  }),
});

module.exports = {
  productSchema,
  productPatchSchema,
};
