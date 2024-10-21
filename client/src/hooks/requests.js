import { API_URL } from "../constants";
// import launch from "../pages/Launch";

async function httpGetPlanets() {
  try {
    const response = await fetch(`${API_URL}/planets`);

    return await response.json();
  } catch (e) {
    console.error("Error occurred while fetching planets: ", e);
  }
}

async function httpGetLaunches() {
  try {
    const response = await fetch(`${API_URL}/launches`);
    const fetchLaunches = await response.json();

    return fetchLaunches.sort((a, b) => a.flightNumber - b.flightNumber);
  } catch (e) {
    console.error("Error occurred while fetching launches: ", e);
  }
}

async function httpSubmitLaunch(launch) {
  try {
    return await fetch(`${API_URL}/launches`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(launch),
    });
  } catch (e) {
    console.error("Error occurred while submitting a launch: ", e);
    return {
      ok: false,
    };
  }
}

async function httpAbortLaunch(id) {
  try {
    return await fetch(`${API_URL}/launches/${id}`, {
      method: "DELETE",
    });
  } catch (e) {
    console.error("Error occurred while aborting a launch: ", e);
    return {
      ok: false,
    };
  }
}

export { httpGetPlanets, httpGetLaunches, httpSubmitLaunch, httpAbortLaunch };
