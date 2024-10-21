const express = require("express");
const cors = require("cors");
const planetsRouter = require("./routes/planets.router");
const launchesRouter = require("./routes/launches.router");
const path = require("path");
const morgan = require("morgan");
const { LAUNCHES_PATH, PLANETS_PATH } = require("./constants");

const app = express();

app.use(
  cors({
    origin: "http://localhost:3000",
  }),
);

app.use(morgan("combined"));

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.use(PLANETS_PATH, planetsRouter);
app.use(LAUNCHES_PATH, launchesRouter);

app.get("/*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

module.exports = app;
