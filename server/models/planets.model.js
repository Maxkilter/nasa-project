const { parse } = require("csv-parse");
const fs = require("fs");
const path = require("path");
const planets = require("./planets.mongo.js");
const { pipeline } = require("stream/promises");

// let habitablePlanets = [];

const isHabitablePlanet = (planet) =>
  planet["koi_disposition"] === "CONFIRMED" &&
  planet["koi_insol"] > 0.36 &&
  planet["koi_insol"] < 1.11 &&
  planet["koi_prad"] < 1.6;

// const loadPlanetsData = () => {
//   return new Promise((resolve, reject) => {
//     fs.createReadStream(path.join(__dirname, "..", "data", "kepler_data.csv");)
//       .pipe(
//         parse({
//           comment: "#",
//           columns: true,
//         }),
//       )
//       .on("data", (data) => {
//         if (isHabitablePlanet(data)) {
//           habitablePlanets.push(data);
//         }
//       })
//       .on("error", (err) => {
//         console.log(err);
//         reject(err);
//       })
//       .on("end", () => {
//         console.log(
//           habitablePlanets.map((planet) => {
//             return planet["kepler_name"];
//           }),
//         );
//         console.log(`${habitablePlanets.length} habitable planets found!`);
//         resolve();
//       });
//   });
// };

const savePlanet = async (planet) => {
  // insert + update = upsert;
  try {
    await planets.updateOne(
      {
        keplerName: planet.kepler_name,
      },
      {
        keplerName: planet.kepler_name,
      },
      {
        upsert: true,
      },
    );
  } catch (e) {
    console.error(`Error upserting planet: ${e}`);
  }
};

const getAllPlanets = async () =>
  await planets.find(
    {},
    {
      _id: 0,
      __v: 0,
    },
  );

const loadPlanetsData = async () => {
  try {
    await pipeline(
      fs.createReadStream(
        path.join(__dirname, "..", "data", "kepler_data.csv"),
      ),
      parse({
        comment: "#",
        columns: true,
      }),
      async function* (source) {
        for await (const chunk of source) {
          if (isHabitablePlanet(chunk)) {
            await savePlanet(chunk);
          }
        }
      },
    );

    // console.log(habitablePlanets.map((planet) => planet["kepler_name"]));
    console.log(`${(await getAllPlanets()).length} habitable planets found!`);
  } catch (error) {
    console.error("Error loading planets data:", error);
    throw error;
  }
};

module.exports = {
  loadPlanetsData,
  getAllPlanets,
};
