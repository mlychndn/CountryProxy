const dotenv = require("dotenv");
dotenv.config();
const app = require("./app");
const mongoose = require("mongoose");

const connectionStr = process.env.MONGODB_URL.replace(
  "<password>",
  process.env.PASSWORD
);

(async () => {
  await mongoose.connect(connectionStr);
  console.log("connection successful");
})().catch((err) => {
  console.log(err.message);
});

app.listen(8080, () => {
  console.log("app is listening on port 8080");
});
