const express = require('express');
const {
  tokenVerification,
  downloadPdf,
} = require('../controllers/pdfController');

const router = express.Router();

router.route('/').get(downloadPdf);

module.exports = router;
