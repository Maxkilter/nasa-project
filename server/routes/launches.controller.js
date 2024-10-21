const {
  getAllLaunches,
  addNewLaunch,
  existLaunchWithId,
  abortLaunchById,
} = require("../models/launches.model");

const httpGetAllLaunches = (req, res) => {
  return res.status(200).json(getAllLaunches());
};

const httpAddNewLaunch = (req, res) => {
  const launch = req.body;
  const { launchDate, rocket, mission, destination } = launch;

  if (!destination) {
    return res
      .status(400)
      .json({ error: "Destination property is not provided" });
  }
  if (!mission) {
    res.status(400).json({ error: "Mission property is not provided" });
  }
  if (!rocket) {
    res.status(400).json({ error: "Rocket property is not provided" });
  }
  if (!launchDate) {
    return res
      .status(400)
      .json({ error: "Launch date property is not provided" });
  }

  launch.launchDate = new Date(launchDate);
  if (isNaN(launch.launchDate)) {
    return res.status(400).json({ error: "Launch date is not a valid date" });
  }

  addNewLaunch(launch);

  return res.status(201).json(launch);
};

const httpAbortLaunch = (req, res) => {
  const launchID = Number(req.params.id);
  if (!existLaunchWithId(launchID)) {
    return res.status(404).json({ error: "Launch is not found" });
  }
  return res.status(200).json(abortLaunchById(launchID));
};

module.exports = {
  httpGetAllLaunches,
  httpAddNewLaunch,
  httpAbortLaunch,
};
