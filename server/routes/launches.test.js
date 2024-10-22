const request = require("supertest");
const app = require("../app");
const { LAUNCHES_PATH } = require("../constants");
const { connectMongo, disconnectMongo } = require("../services/mongo");

describe("Launches API", () => {
  beforeAll(async () => await connectMongo());
  afterAll(async () => await disconnectMongo());

  describe("GET /launches", () => {
    it("should respond with 200 success", async () => {
      return await request(app)
        .get(LAUNCHES_PATH)
        .expect("Content-Type", /json/)
        .expect(200);
    });
  });

  describe("POST /launches", () => {
    const completeLaunchData = {
      mission: "BMN ES11",
      rocket: "Exostellar KR12",
      launchDate: "January 4, 2028",
      destination: "Kepler-442 b",
    };
    const launchDataWithoutDate = {
      mission: "BMN ES11",
      rocket: "Exostellar KR12",
      destination: "Kepler-442 b",
    };

    it("should respond with 201 created", async () => {
      const response = await request(app)
        .post(LAUNCHES_PATH)
        .send(completeLaunchData)
        .expect("Content-Type", /json/)
        .expect(201);

      const requestDate = new Date(completeLaunchData.launchDate).valueOf();
      const responseDate = new Date(response.body.launchDate).valueOf();

      expect(responseDate).toBe(requestDate);
      expect(response.body).toMatchObject(launchDataWithoutDate);
    });

    it("should catch missing launch date property", async () => {
      const response = await request(app)
        .post(LAUNCHES_PATH)
        .send(launchDataWithoutDate)
        .expect("Content-Type", /json/)
        .expect(400);

      expect(response.body).toStrictEqual({
        error: "Launch date property is not provided",
      });
    });

    it("should catch invalid launch date property", async () => {
      const response = await request(app)
        .post(LAUNCHES_PATH)
        .send({ ...launchDataWithoutDate, launchDate: "tada-rada" })
        .expect("Content-Type", /json/)
        .expect(400);

      expect(response.body).toStrictEqual({
        error: "Launch date is not a valid date",
      });
    });
  });
});
