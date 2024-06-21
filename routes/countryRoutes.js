const express = require("express");
const {
  getCountry,
  createCountryRecord,
  upload,
  getCountryById,
  deleteCountry,
} = require("../controllers/countryController");

const { protection, restrictTo } = require("../controllers/authController");
const router = express.Router();

router
  .route("/")
  .get(getCountry)
  .post(upload.single("photo"), createCountryRecord);

router
  .route("/:id")
  .get(getCountryById)
  .delete(protection, restrictTo("admin", "maintainer"), deleteCountry);

module.exports = router;
