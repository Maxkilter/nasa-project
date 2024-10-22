const launchesDatabase = require("./launches.mongo");
const planets = require("./planets.mongo");

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

const DEFAULT_LAUNCH_NUMBER = 100;

const getAllLaunches = async () =>
  await launchesDatabase.find({}, { _id: 0, __v: 0 });

const saveLaunch = async (launch) => {
  const planet = await planets.findOne({
    keplerName: launch.destination,
  });

  if (!planet) {
    throw new Error("No matching planet found");
  }

  return launchesDatabase.findOneAndUpdate(
    {
      flightNumber: launch.flightNumber,
    },
    launch,
    { upsert: true },
  );
};

(async () => {
  try {
    await saveLaunch(launch);
  } catch (error) {
    console.error("Error happened during a launch saving", error);
  }
})();

const getLatestFlightNumber = async () => {
  const { flightNumber } = await launchesDatabase
    .findOne()
    .sort("-flightNumber");

  if (!flightNumber) return DEFAULT_LAUNCH_NUMBER;

  return flightNumber;
};

const scheduleNewLaunch = async (launch) => {
  const latestFlightNumber = await getLatestFlightNumber();
  const newLaunch = Object.assign(launch, {
    success: true,
    upcoming: true,
    customers: ["BMN technology", "NASA"],
    flightNumber: latestFlightNumber + 1,
  });
  return await saveLaunch(newLaunch);
};

const existLaunchWithId = async (launchId) =>
  await launchesDatabase.findOne({
    flightNumber: launchId,
  });

const abortLaunchById = async (launchId) => {
  const aborted = await launchesDatabase.updateOne(
    { flightNumber: launchId },
    {
      success: false,
      upcoming: false,
    },
  );
  return aborted.modifiedCount === 1;
};

module.exports = {
  existLaunchWithId,
  abortLaunchById,
  scheduleNewLaunch,
  getAllLaunches,
};
