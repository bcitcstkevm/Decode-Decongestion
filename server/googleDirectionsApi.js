/* eslint-disable */

const API_KEY1 = 'AIzaSyAdgZKoxkdZjb92G7aMvEiJYiegd9n6rbA';
const API_KEY2 = 'AIzaSyBc2eqMjOT4ph-QZrxPTG3AqS-pWMUBzDc';
const API_PATH = `https://maps.googleapis.com/maps/api/directions/json?`;
const axios = require('axios');
const safe = require('./safetify');

class googleDirectionsApi {
  //waypoints is an array of numbers
  constructor(origin, destination, mode = 'bicycling', waypoints = null) {
    this.origin = origin;
    this.destination = destination;
    this.mode = mode;
    this.waypoints = waypoints;
    this.safetify = new safe();
  }

  setCVars(o, d, m = 'bicycling', waypoints = null) {
    this.origin = o;
    this.destination = d;
    this.mode = m;
    this.waypoints = waypoints;
  }

  getWayPoints() {
    if (this.waypoints === null) return '';

    let wayPointsUrl = '&';
    this.waypoints.forEach((coor) => {
      wayPointsUrl = wayPointsUrl + coor.join(',') + '|';
    });

    wayPointsUrl = wayPointsUrl.substring(0, wayPointsUrl.length - 2);
    return wayPointsUrl;
  }

  parseCoordinate(obj) {
    return `${obj.lat},${obj.lng}`;
  }

  getPath() {
    const o = `origin=${this.parseCoordinate(this.origin)}`;
    const d = `&destination=${this.parseCoordinate(this.destination)}`;
    const key = `&key=${API_KEY1}`;
    const mode = `&mode=${this.mode}`;
    const waypoints = this.getWayPoints();
    return `${API_PATH}${o}${d}${key}${mode}${waypoints}`;
  }

  async getListOfDirectionsForEfficient() {
    const path = this.getPath();
    const options = {
      method: 'GET',
      url: path,
    };
    const res = await axios(options);

    if (res.status != 200 || res.statusText !== 'OK' || res.data.status != 'OK') {
      throw new Error('line 35 google directions API');
    }
    const { steps, warnings } = this.parseResponseV1(res.data);
    console.log(steps.length)
    this.safetify.setCVars(steps, warnings);
    const result = await this.safetify.getSafetifiedSteps();
    return result;
  }
  parseResponseV1(data) {
    const { routes } = data;
    const firstRoute = routes[0];
    const { bounds, legs, warnings, waypoint_order } = firstRoute;
    const firstLeg = legs[0];
    const { steps } = firstLeg;
    return { steps, warnings };
  }
}

module.exports = googleDirectionsApi;

(async () => {
  const origin = {
    lat: 49.262466,
    lng: -123.219238,
  };

  const dest = {
    lat: 49.237982,
    lng: -123.06072,
  };

  const x = new googleDirectionsApi(origin, dest);
  const res = await x.getListOfDirectionsForEfficient();
  // console.log(JSON.stringify(res));
  console.log(res.length)
})();
