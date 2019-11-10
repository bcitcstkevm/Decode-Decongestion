/* eslint-disable */

const API_KEY = '5b3b85e2e5ef912d9e1c24011e5796a0232d47671a1c7a90b14ebcae';
const API_PATH = `https://decode-congestion-vancouver.opendatasoft.com/api/records/1.0/search/`;
const axios = require('axios');
const testdata = require('./testdata');
const sphericalGeo = require('spherical-geometry-js');

class Safetify {
  constructor(arrOfSteps = null, arrOfWarnings = null) {
    this.arrOfSteps = arrOfSteps;
    this.arrOfWarnings = arrOfWarnings;
  }

  setCVars(arrOfSteps, arrOfWarnings) {
    this.arrOfSteps = arrOfSteps;
    this.arrOfWarnings = arrOfWarnings;
  }

  interpolatepoints(data, fraction = 0.2) {
    let newArray = [];
    let i = 0;
    for (i = 0; i < data.length; i++) {
      let newLines = [];
      newLines.push(data[i]);
      for (let j = 0; j < 5; j++) {
        let origin = new sphericalGeo.LatLng(data[i].start_location.lat, data[i].start_location.lng);
        let destination = new sphericalGeo.LatLng(data[i].end_location.lat, data[i].end_location.lng);
        let point = sphericalGeo.interpolate(origin, destination, fraction * (j + 1));
        let newLine = {};

        newLine['start_location'] = j === 0 ? newLines[j].start_location : newLines[j].end_location;
        newLine['end_location'] = { lat: point.latitude, lng: point.longitude };
        newLines.push(newLine);
      }
      newLines.shift();
      newArray.push(...newLines);
    }
    return newArray;
  }

  getPath(dataset) {
    const key = `&apikey=${API_KEY}`;
    const row = `&rows=1082`;
    const data = `?dataset=${dataset}`;
    return `${API_PATH}${data}${key}${row}`;
  }

  async getSafetifiedSteps() {
    this.arrOfSteps = this.interpolatepoints(this.arrOfSteps);
    await this.setBikeCollisionSteps();
    await this.setInjurySteps();
    this.aggregateDangers();
    this.normalize();
    return this.arrOfSteps;
  }

  async executeFetch(dataset) {
    const path = this.getPath(dataset);
    const options = {
      method: 'GET',
      url: path,
    };
    const res = await axios(options);
    if (res.status != 200 || res.statusText !== 'OK') {
      throw new Error('line 38 safetifyAPI');
    }
    return res.data;
  }

  async setInjurySteps() {
    const { records } = await this.executeFetch('vpd-fatalities-2006-aug-22-2019');
    this.arrOfSteps.forEach((step) => {
      const distanceFromOrigin = 0.3; // Distance from origin in km;
      const kmPerDegreeLatitude = 1 / 111;
      const distanceAwayFromCenter = distanceFromOrigin * kmPerDegreeLatitude; //radius

      const srtlch = step.start_location;

      step.fatalities = 0;

      records.forEach((record) => {
        try {
          if (pointWithinCircle([record.fields.long, record.fields.lat], srtlch, distanceAwayFromCenter)) {
            step.fatalities += 1;
          }
        } catch (err) {}
      });
    });
  }

  async setBikeCollisionSteps() {
    const { records } = await this.executeFetch('copy-of-city-of-vancouver');

    this.arrOfSteps.forEach((step) => {
      const distanceFromOrigin = 0.3; // Distance from origin in km;
      const kmPerDegreeLatitude = 1 / 111;
      const distanceAwayFromCenter = distanceFromOrigin * kmPerDegreeLatitude; //radius

      step.bikeCollisions = 0;
      const srtlch = step.start_location;

      records.forEach((record) => {
        if (pointWithinCircle(record.geometry.coordinates, srtlch, distanceAwayFromCenter)) {
          step.bikeCollisions += 1;
        }
      });
    });
  }

  aggregateDangers() {
    const collisionWeight = (1/7);
    const deathWeight = (6/7);

    this.arrOfSteps.forEach((step) => {
      try {
        if (!step.bikeCollisions) {
          step.bikeCollisions = 0;
        }
        if (!step.fatalities) {
          step.fatalities = 0;
        }
        step.danger = (step.bikeCollisions * collisionWeight) + (step.fatalities * deathWeight);
      } catch (err) {}
    });
  }

  normalize() {
    let max = 0;
    this.arrOfSteps.forEach((step) => {
      if (step.danger && step.danger > max) {
        max = step.danger;
      }
    });

    this.arrOfSteps.forEach((step) => {
      if (step.danger) {
        step.danger = step.danger / max;
      }
    });
  }
}

const pointWithinCircle = (point, center, radius) => {
  const dy = Math.pow(Math.abs(point[1] - center.lat), 2);
  const dx = Math.pow(Math.abs(point[0] - center.lng), 2);
  const r = Math.pow(radius, 2);
  return dx + dy < r;
};

module.exports = Safetify;

(async () => {
  const x = new Safetify(testdata);
  const res = await x.getSafetifiedSteps();
  console.log(res);
})();
