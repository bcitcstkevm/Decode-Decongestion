/* eslint-disable */
// feed in two points and see what we get back

const API_KEY1 = 'AIzaSyAdgZKoxkdZjb92G7aMvEiJYiegd9n6rbA';
const API_KEY2 = 'AIzaSyBc2eqMjOT4ph-QZrxPTG3AqS-pWMUBzDc';
const API_PATH = `https://maps.googleapis.com/maps/api/directions/json?`;
const axios = require('axios');

class googleDirectionsApi {
  //waypoints is an array of numbers
  constructor(origin, destination, mode = 'bicycling', waypoints = null) {
    this.origin = origin;
    this.destination = destination;
    this.mode = mode;
    this.waypoints = waypoints;
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
    const lat = obj.lat;
    const lng = obj.lng;
    return `${obj.lat},${obj.lng}`
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
    const result = this.parseResponseV1(res.data);
    return result;
  }
  parseResponseV1(data) {
    const { routes } = data;
    const firstRoute = routes[0];
    const { bounds, legs, warnings, waypoint_order } = firstRoute;
    const firstLeg = legs[0];
    const { steps } = firstLeg;
    return steps;
  }
}

(async () => {
  const origin = {
    name: undefined,
    lat: 49.275802,
    lng: -122.945060
  }

  const dest = {
    name: 'UBC',
    lat: 49.260026,
    lng: -123.245942
  }

  const x = new googleDirectionsApi(origin, dest, "bicycling", [['49.259564', '-123.070240'], ['49.259564', '-123.070240'], ['49.259564', '-123.070240'], ['49.259564', '-123.070240']]);
  const res = await x.getListOfDirectionsForEfficient();
  console.log(res);
})();
