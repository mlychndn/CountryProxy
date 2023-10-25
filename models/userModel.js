const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    // minLength: [3, "A user name must have 3 chars"],
    // maxLength: [10, "User length should not be greater than 10 charcters"],
  },
  continent: {
    type: String,
    required: true,
    // enum: [
    //   "Oceania",
    //   "Europe",
    //   "Africa",
    //   "Asia",
    //   "Pakistan",
    //   "Antartica",
    //   "North America",
    //   "South America",
    // ],
  },
  flag: {
    type: String,
    // required: true,
  },
  rank: {
    type: Number,
    // required: true,
  },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
