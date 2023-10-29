const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const authSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A user must have name'],
    minLength: [4, 'user name length should be greater than 4'],
  },
  email: {
    type: String,
    required: [true, 'Please provide your email address'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please type valid email'],
  },
  photo: String,
  role: {
    type: String,
    enum: ['user', 'admin', 'maintainer'],
    default: 'user',
  },
  password: {
    type: String,
    required: [true, 'Please provide your password'],
    minLength: 8,
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Please confirm your password'],
    validate: {
      // this only work with save
      validator: function (e) {
        if (e === this.password) {
          return true;
        }
        return false;
      },
      message: 'Password and password confirm does not match',
    },
  },
  passwordModifiedAt: {
    type: Date,
  },
  passwordResetToken: String,
  passwordResetExpires: Date,
  active: {
    type: Boolean,
    default: true,
  },
});

// document middleware
authSchema.pre('save', function (next) {
  try {
    if (!this.isModified('password') || this.$isNew) return next();

    this.passwordModifiedAt = Date.now() - 1000;

    next();
  } catch (error) {
    console.log(error.message);
  }
});

authSchema.pre('save', async function (next) {
  try {
    if (!this.isModified('password')) return next();

    this.password = await bcrypt.hash(this.password, 12);
    this.passwordConfirm = undefined;

    next();
  } catch (error) {
    console.log(error.message);
  }
});

// query middleware
authSchema.pre(/^find/, function (next) {
  this.find({ active: { $ne: false } });

  next();
});
authSchema.methods.correctPassword = async function (
  inputPassword,
  originalPassword
) {
  try {
    return await bcrypt.compare(inputPassword, originalPassword);
  } catch (error) {
    return error;
  }
};

authSchema.methods.createResetToken = function () {
  //1. create simple reset token which will be provided to users as a temporary password
  const resetToken = crypto.randomBytes(32).toString('hex');

  //2. save this temporary token in database with encryption.
  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

const Auth = mongoose.model('Auth', authSchema);

module.exports = Auth;
