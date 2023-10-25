const User = require('../models/userModel');
const multer = require('multer');
const fs = require('fs');

const countryData = JSON.parse(fs.readFileSync('./country.json', 'utf8'));

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './public/images');
  },

  filename: (req, file, cb) => {
    const extension = file.mimetype.split('/')[1];
    const name = file.originalname.split('.')[0];
    cb(null, `${name}.${extension}`);
  },
});

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb('file type is not image', false);
  }
};

exports.upload = multer({
  storage,
  fileFilter: multerFilter,
});

exports.getCountry = async (req, res, next) => {
  try {
    const data = await User.find();
    // console.log(data);
    res.status(200).json({
      status: 'success',
      count: data.length,
      result: {
        data,
      },
    });
  } catch (error) {
    res.status(401).json({
      result: 'error',
    });
  }
};

exports.createCountryRecord = async (req, res) => {
  try {
    const { name, rank, continent } = req.body;

    let obj = {
      name,
      continent,
      flag: `images/${name.toLowerCase()}.png`,
      rank,
    };

    const user = new User(obj);

    await user.save();

    countryData.push(obj);
    const date1 = req.date; //
    const date2 = Date.now(); //
    const timetaken = date2 - date1;
    const Insec = timetaken / 1000;

    fs.writeFile(
      './country.json',
      JSON.stringify(countryData),
      'utf8',
      (err) => {
        if (!err) {
          res.status(201).json({
            status: 'success',
            data: countryData,
            date: new Date(req.date),
          });
        }
      }
    );
  } catch (error) {
    console.log(error.message);
  }
};

exports.getCountryById = async (req, res, next) => {
  try {
    const { id: _id } = req.params;
    const country = await User.findById(_id);

    res.status(200).json({
      status: 'success',
      country,
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error.message,
    });
  }
};

exports.deleteCountry = async (req, res) => {
  try {
    const { id: _id } = req.params;
    const deleted = await User.deleteOne({ _id });
    res.status(202).json({
      status: 'accepted',
      deleted,
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error.message,
    });
  }
};
