const express = require('express');
const {
  getAllUsers,
  signUp,
  logIn,
  protection,
  deleteManyUesrs,
  forgotPassword,
  resetPassword,
  updatePassword,
  updateMe,
  deleteMe,
} = require('../controllers/authController');

const router = express.Router();

router
  .route('/')
  .get(protection, getAllUsers)
  .delete(protection, deleteManyUesrs);
router.route('/signUP').post(signUp);
router.route('/logIn').post(logIn);
router.route('/forgotPassword').post(forgotPassword);
router.route('/:token').patch(resetPassword);
router.route('/updatePassword').post(protection, updatePassword);
router.route('/updateMe').patch(protection, updateMe);
router.route('/deleteMe').delete(protection, deleteMe);

module.exports = router;
