require("dotenv").config();

const http = require("http");
const app = require("./app");
const { connectMongo } = require("./services/mongo");
const { loadPlanetsData } = require("./models/planets.model");
const dns = require("dns");
const { loadLaunchesData } = require("./models/launches.model");

// Use Google DNS or Cloudflare DNS
dns.setServers(["8.8.8.8", "1.1.1.1"]);

const PORT = process.env.PORT || 8080;

const server = http.createServer(app);

async function startServer() {
  await connectMongo();
  await loadPlanetsData();
  await loadLaunchesData();

  server.listen(PORT, () => console.log(`Listening on ${PORT}...`));
}

(async () => {
  try {
    await startServer();
  } catch (err) {
    console.error("Failed to start the server:", err);
  }
})();
