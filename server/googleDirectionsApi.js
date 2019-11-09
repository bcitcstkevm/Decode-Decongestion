"use strict";

// feed in two points and see what we get back

const API_KEY1 = "AIzaSyAdgZKoxkdZjb92G7aMvEiJYiegd9n6rbA";
const API_KEY2 = "AIzaSyBc2eqMjOT4ph-QZrxPTG3AqS-pWMUBzDc";
const API_PATH = `https://maps.googleapis.com/maps/api/directions/json?`;
const axios = require("axios");

class googleDirectionsApi {
  //waypoints is an array of numbers
  constructor(origin, destination, mode = "biking", waypoints = [0, 0]) {
    this.origin = origin;
    this.destination = destination;
    this.mode = mode;
    this.waypoints = waypoints;
  }
  setCVars(o, d) {
    this.origin = o;
    this.destination = d;
    this.mode = m;
  }
  getWayPoints() {
    return;
  }
  getPath() {
    const o = `origin=${this.origin}`;
    const d = `&destination=${this.destination}`;
    const key = `&key=${API_KEY1}`;
    const mode = `&mode=${this.mode}`;
    const waypoints = getWayPoints();
    return `${API_PATH}${o}${d}${key}${mode}${waypoints}`;
  }
  async getListOfDirectionsForEfficient() {
    const path = this.getPath();
    const options = {
      method: "GET",
      url: path
    };
    const res = await axios(options);

    if (res.status != 200 || statusText !== "OK") {
      throw new Error("line 35 google directions API");
    }

    return res.data;
  }
}

(async () => {
  const x = new googleDirectionsApi("a", "b");
  const res = await x.getListOfDirections();
  console.log(res);
})();
