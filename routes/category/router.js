var express = require("express");
var router = express.Router();

const { validateSchema, checkIdSchema } = require("../../utitl");
const {
  getAll,
  create,
  search,
  getDetail,
  update,
  deleteFunc,
} = require("./controller");
const { productSchema, productPatchSchema } = require("./validation");

router.route("/").get(getAll).post(validateSchema(productSchema), create);

router.get("/search", search);

router
  .route("/:id")
  .get(validateSchema(checkIdSchema), getDetail)
  .put(validateSchema(checkIdSchema), validateSchema(productSchema), update)
  .patch(
    validateSchema(checkIdSchema),
    validateSchema(productPatchSchema),
    update
  )
  .delete(validateSchema(checkIdSchema), deleteFunc);

module.exports = router;
