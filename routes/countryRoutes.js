const express = require('express');
const {
  getCountry,
  createCountryRecord,
  upload,
  getCountryById,
  deleteCountry,
} = require('../controllers/countryController');

const { protection, restrictTo } = require('../controllers/authController');
const router = express.Router();

router
  .route('/')
  .get(protection, getCountry)
  .post(upload.single('photo'), createCountryRecord);

router
  .route('/:id')
  .get(protection, getCountryById)
  .delete(protection, restrictTo('admin', 'maintainer'), deleteCountry);

module.exports = router;
