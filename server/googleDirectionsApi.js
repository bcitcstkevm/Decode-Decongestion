/* eslint-disable */

const API_KEY = process.env.GOOGLE_API_BACKEND;
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
    const key = `&key=${API_KEY}`;
    const mode = `&mode=${this.mode}`;
    const waypoints = this.getWayPoints();
    const alternatives = `&alternatives=true`;
    return `${API_PATH}${o}${d}${key}${mode}${waypoints}${alternatives}`;
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

    const steps = this.parseResponseV1(res.data);
    this.safetify.setCVars(steps[0]);
    const result = await this.safetify.getSafetifiedSteps();
    return { length: steps.length, result: result };
  }

  async getListOfDirectionsForSafest() {
    const path = this.getPath();
    const options = {
      method: 'GET',
      url: path,
    };

    const res = await axios(options);

    if (res.status != 200 || res.statusText !== 'OK' || res.data.status != 'OK') {
      throw new Error('line 35 google directions API');
    }

    const arrayOfSteps = this.parseResponseV1(res.data);
    const mappedArrayOfSteps = [];
    for (let i = 0; i < arrayOfSteps.length; i++) {
      this.safetify.setCVars(arrayOfSteps[i]);
      const result = await this.safetify.getSafetifiedSteps();
      mappedArrayOfSteps.push(result);
    }

    const dangerArray = mappedArrayOfSteps.map((steps) => {
      let danger = 0;

      steps.forEach((step) => {
        danger += step.danger;
      });
      return danger;
    });

    const indexOfSafestRoute = dangerArray.indexOf(Math.max(...dangerArray));
    return mappedArrayOfSteps[indexOfSafestRoute];
  }

  parseResponseV1(data) {
    const { routes } = data;
    return routes.map((obj) => obj.legs[0].steps);
    // const firstRoute = routes[0];
    // const { bounds, legs, warnings, waypoint_order } = firstRoute;
    // const firstLeg = legs[0];
    // const { steps } = firstLeg;
    // return { steps, warnings };
  }
}

module.exports = googleDirectionsApi;

// (async () => {
//   const origin = {
//     lat: 49.257762,
//     lng: -123.168477,
//   };

//   const dest = {
//     lat: 49.237756,
//     lng: -123.139673
//   };

//   const x = new googleDirectionsApi(origin, dest);
//   const res = await x.getListOfDirectionsForEfficient();
// })();
