const jwt = require('jsonwebtoken');
const Auth = require('../models/authModel');

exports.downloadPdf = (req, res, next) => {
  res.download('./public/images/resume.pdf');
};

exports.tokenVerification = async (req, res, next) => {
  try {
    console.log('req', req);
    const token = req.headers.authorization.split(' ')[1];
    if (!req.headers.authorization || !token) {
      throw new Error('JWT not found!');
    }

    const verify = jwt.verify(token, process.env.SECRET);
    console.log(verify);
    const { id } = verify;
    const user = await Auth.findById({ _id: id });
    if (!user) {
      throw new Error('user not found!');
    }

    console.log('user', user);
    let currenTime = Date.now();

    if (new Date(currenTime) < new Date(user.passwordModifiedAt)) {
      throw new Error('Password Modified, Please login again');
    }

    next();
  } catch (error) {
    res.status(401).json({
      status: 'error',
      message: error.message,
    });
  }
};
