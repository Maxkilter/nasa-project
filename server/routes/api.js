const { PLANETS_PATH, LAUNCHES_PATH } = require("../constants");
const planetsRouter = require("./planets.router");
const launchesRouter = require("./launches.router");
const express = require("express");

const api = express.Router();

api.use(PLANETS_PATH, planetsRouter);
api.use(LAUNCHES_PATH, launchesRouter);

module.exports = api;
