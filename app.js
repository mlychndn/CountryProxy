const express = require("express");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss");
const app = express();
const path = require("path");
const userRouter = require("./routes/userRoutes");
const countryRouter = require("./routes/countryRoutes");
const pdfRouter = require("./routes/pdfRoutes");
const {
  downloadPdf,
  tokenVerification,
} = require("./controllers/pdfController");

// global middleware for security and cors

/* setting HTTP response headers using helmet package*/
// app.use(helmet());

// cors middeleware
// app.use(cors());

/* implementing rate limiting */
// const limiter = rateLimit({
//   limit: 100,
//   windowMs: 15 * 60 * 100,
// });

// app.use(limiter);

/* Data Sanitization */

// app.use(mongoSanitize());
// app.use(xss());

// express middleware function
// app.use(express.json({ limit: "10kb" }));
app.use(express.static(path.join(__dirname, "public")));

// static file calling get request
app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.get("/pdf", function (req, res) {
  res.sendFile(path.join(__dirname, "public", "pdf.html"));
});

// jso rest api request
app.use("/api/v1/countries", countryRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/downloadPdf", pdfRouter);

module.exports = app;
