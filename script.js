const mongoose = require("mongoose");
const User = require("./userModel");
const fs = require("fs");

const loadAllData = async () => {
  const promises = [];
  let promise;
  fs.readFile("./data.json", "utf-8", (err, data) => {
    if (!err) {
      let countriesRecord = JSON.parse(data);

      for (let i = 0; i < countriesRecord.countries.length - 1; i++) {
        let obj = countriesRecord.countries[i];
        const user = new User(obj);
        promise = user.save().then((data) => {
          // console.log(data);
        });
      }
      promises.push(promise);
    }
  });
};

module.exports = loadAllData;
