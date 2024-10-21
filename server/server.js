const http = require("http");
const app = require("./app");
const mongoose = require("mongoose");
const { loadPlanetsData } = require("./models/planets.model");
const dns = require("dns");

// Use Google DNS or Cloudflare DNS
dns.setServers(["8.8.8.8", "1.1.1.1"]);

const PORT = process.env.PORT || 8000;

const MONGODB_URI = "";

const server = http.createServer(app);

mongoose.connection.once("open", () => console.log("MongoDB connected! 🎉"));

mongoose.connection.on("error", (err) => {
  console.error("MongoDB connection error: ", err);
});

async function startServer() {
  await mongoose.connect(MONGODB_URI);
  await loadPlanetsData();

  server.listen(PORT, () => console.log(`Listening on ${PORT}...`));
}

startServer();
