const mongoose = require("mongoose");
require("dotenv").config();

const MONGODB_URL = process.env.MONGODB_URL;

mongoose.connection.once("open", () => console.log("MongoDB connected! 🎉"));

mongoose.connection.on("error", (err) => {
  console.error("MongoDB connection error: ", err);
});

const connectMongo = async () => await mongoose.connect(MONGODB_URL);
const disconnectMongo = async () => await mongoose.disconnect();

module.exports = {
  connectMongo,
  disconnectMongo,
};
