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
const {customerSchema,customerPatchSchema } = require("./validation");

router.route("/")
.get(getAll)
.post(validateSchema(customerSchema), create);//ADMIN TẠO TÀI KHOẢN CHO NGƯỜI DÙNG


router.route("/register")
.post(validateSchema(customerSchema), create);//ADMIN TẠO TÀI KHOẢN CHO NGƯỜI DÙNG

router.get("/search", search);

router
  .route("/:id")
  .get(validateSchema(checkIdSchema), getDetail)
  .put(validateSchema(checkIdSchema), validateSchema(customerSchema), update)
  .patch( validateSchema(checkIdSchema),validateSchema(customerPatchSchema),update)
  .delete(validateSchema(checkIdSchema), deleteFunc);

module.exports = router;
