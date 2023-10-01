const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const { default: mongoose } = require("mongoose");
const passport = require('passport');
const cors = require('cors');
require('dotenv').config();


const authRouter = require('./routes/auth/router');

const categoriesRouter = require("./routes/category/router");
const supplierRouter = require("./routes/supplier/router");
const customerRouter = require("./routes/customer/router");
const employeeRouter = require("./routes/employee/router");
const productRouter = require("./routes/product/router");
const orderRouter = require("./routes/order/router");
const questionRouter = require("./routes/questions/router")

const { CONNECTION_STRING, DB_NAME } = require('./constants/db');

 const {
  passportVerifyToken,
  passportVerifyAccount,
  passportConfigBasic,
} = require('./middlewares/passport');

const app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

passport.use(passportVerifyToken);
passport.use(passportVerifyAccount);
passport.use(passportConfigBasic);

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));


// Add CORS here
app.use(
  cors({
    origin: '*',
  }),
);

// mongoose.connect("mongodb://127.0.0.1:27017/node-Test-database");
mongoose.connect("mongodb+srv://nguyenhung21001:hung1234@cluster0.jhoowlf.mongodb.net/node-32-database");
//mongoose.connect("mongodb+srv://strinhphuongdev:xjJx9zdpdfLS2JCI@cluster0.xrdmevl.mongodb.net/node-33-database");
app.use('/auth', authRouter);

app.use('/employees', employeeRouter);
app.use('/products', passport.authenticate('jwt', { session: false }), productRouter);
app.use('/categories', passport.authenticate('jwt', { session: false }), categoriesRouter);
app.use('/suppliers', passport.authenticate('jwt', { session: false }), supplierRouter);
app.use('/customers', passport.authenticate('jwt', { session: false }), customerRouter);
app.use('/orders', passport.authenticate('jwt', { session: false }), orderRouter);


// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
