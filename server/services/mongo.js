const mongoose = require("mongoose");

const MONGODB_URI = "";

mongoose.connection.once("open", () => console.log("MongoDB connected! 🎉"));

mongoose.connection.on("error", (err) => {
  console.error("MongoDB connection error: ", err);
});

const connectMongo = async () => await mongoose.connect(MONGODB_URI);
const disconnectMongo = async () => await mongoose.disconnect();

module.exports = {
  connectMongo,
  disconnectMongo,
};
