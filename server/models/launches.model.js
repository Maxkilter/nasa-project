const launchesDatabase = require("./launches.mongo");
const planets = require("./planets.mongo");
const { SPACEX_API_URL } = require("../constants");

const DEFAULT_LAUNCH_NUMBER = 100;

const getAllLaunches = async (skip, limit) =>
  await launchesDatabase
    .find({}, { _id: 0, __v: 0 })
    .sort({
      flightNumber: 1,
    })
    .skip(skip)
    .limit(limit);

const populateLaunches = async () => {
  const response = await fetch(SPACEX_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: {},
      options: {
        pagination: false,
        populate: [
          {
            path: "rocket",
            select: {
              name: 1,
            },
          },
          {
            path: "payloads",
            select: {
              customers: 1,
            },
          },
        ],
      },
    }),
  });

  if (response.status !== 200) {
    console.log("Problem downloading launch data");
    throw new Error("Launch data download failed");
  }

  const { docs } = await response.json();

  for (const doc of docs) {
    const customers = doc.payloads.flatMap((payload) => payload.customers);

    const launch = {
      flightNumber: doc["flight_number"],
      mission: doc["name"],
      rocket: doc["rocket"]["name"],
      launchDate: doc["date_local"],
      upcoming: doc["upcoming"],
      success: doc["success"],
      customers,
    };

    await saveLaunch(launch);
  }
};

const saveLaunch = async (launch) =>
  launchesDatabase.findOneAndUpdate(
    {
      flightNumber: launch.flightNumber,
    },
    launch,
    { upsert: true },
  );

async function loadLaunchesData() {
  const firstLaunch = await findLaunch({
    flightNumber: 1,
    rocket: "Falcon 1",
    mission: "FalconSat",
  });
  if (firstLaunch) {
    console.log("Launch data already loaded!");
  } else {
    await populateLaunches();
  }
}

const findLaunch = async (filter) => await launchesDatabase.findOne(filter);

const existLaunchWithId = async (launchId) =>
  await findLaunch({
    flightNumber: launchId,
  });

const getLatestFlightNumber = async () => {
  const { flightNumber } = await launchesDatabase
    .findOne()
    .sort("-flightNumber");

  if (!flightNumber) return DEFAULT_LAUNCH_NUMBER;

  return flightNumber;
};

const scheduleNewLaunch = async (launch) => {
  const planet = await planets.findOne({
    keplerName: launch.destination,
  });

  if (!planet) {
    throw new Error("No matching planet found");
  }

  const latestFlightNumber = await getLatestFlightNumber();
  const newLaunch = Object.assign(launch, {
    success: true,
    upcoming: true,
    customers: ["BMN technology", "NASA"],
    flightNumber: latestFlightNumber + 1,
  });
  return await saveLaunch(newLaunch);
};

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
  loadLaunchesData,
  existLaunchWithId,
  abortLaunchById,
  scheduleNewLaunch,
  getAllLaunches,
};
