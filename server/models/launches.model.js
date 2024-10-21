// const launchesDatabase = require("./launches.model");

// const launches = new Map();

const launch = {
  rocket: "Explorer IS1",
  destination: "Kepler-442 b",
  mission: "Kepler Exploration X",
  customers: ["ZTM", "NASA"],
  launchDate: new Date("December 27, 2030"),
  flightNumber: 100,
  upcoming: true,
  success: true,
};

// launches.set(launch.flightNumber, launch);

const getAllLaunches = () => Array.from(launches.values());

let latestFlightNumber = launch.flightNumber;

const addNewLaunch = (newLaunch) => {
  latestFlightNumber++;

  return launches.set(
    latestFlightNumber,
    Object.assign(newLaunch, {
      success: true,
      upcoming: true,
      customers: ["BMN technology", "NASA"],
      flightNumber: latestFlightNumber,
    }),
  );
};

const existLaunchWithId = (launchId) => {
  return launches.has(launchId);
};

const abortLaunchById = (launchId) => {
  const launch = launches.get(launchId);
  launch.success = false;
  launch.upcoming = false;
  return launch;
};

module.exports = {
  existLaunchWithId,
  abortLaunchById,
  getAllLaunches,
  addNewLaunch,
};
