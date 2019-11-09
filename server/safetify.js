/* eslint-disable */

const API_KEY = '5b3b85e2e5ef912d9e1c24011e5796a0232d47671a1c7a90b14ebcae';
const API_PATH = `https://decode-congestion-vancouver.opendatasoft.com/api/records/1.0/search/`;
const axios = require('axios');
const testdata = require('./testdata');

class Safetify {
  constructor(arrOfSteps = null, arrOfWarnings = null) {
    this.arrOfSteps = arrOfSteps;
    this.arrOfWarnings = arrOfWarnings;
  }

  setCVars(arrOfSteps, arrOfWarnings) {
    this.arrOfSteps = arrOfSteps;
    this.arrOfWarnings = arrOfWarnings;
  }

  getPath(dataset) {
    const key = `&apikey=${API_KEY}`;
    const row = `&rows=1082`;
    const data = `?dataset=${dataset}`;
    return `${API_PATH}${data}${key}${row}`;
  }

  async getSafetifiedSteps() {
    await this.setBikeCollisionSteps();
    await this.setInjurySteps();
    this.aggregateDangers();
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

    // console.log(JSON.stringify(records));

    this.arrOfSteps.forEach((step) => {
      const distanceFromOrigin = 1; // Distance from origin in km;
      const kmPerDegreeLatitude = 1 / 111;
      const distanceAwayFromCenter = distanceFromOrigin * kmPerDegreeLatitude; //radius

      const srtlch = step.start_location;

      step.fatalities = 0;

      records.forEach((record) => {
        try {
          if (pointWithinCircle([record.fields.long, record.fields.lat], srtlch, distanceAwayFromCenter)) {
            step.fatalities += 1;
          }
        } catch {}
      });
    });
  }

  async setBikeCollisionSteps() {
    const { records } = await this.executeFetch('copy-of-city-of-vancouver');

    this.arrOfSteps.forEach((step) => {
      const distanceFromOrigin = 1; // Distance from origin in km;
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
    this.arrOfSteps.forEach((step) => {
      try {
        if (!step.bikeCollisions) {
          step.bikeCollisions = 0;
        }
        if (!step.fatalities) {
          step.fatalities = 0;
        }
        step.danger = step.bikeCollisions + step.fatalities;
      } catch {}
      console.log(step.danger);
    });
  }

  ping() {
    console.log('helloworld');
  }
}
const pointWithinCircle = (point, center, radius) => {
  // console.log(`${point[1]}, ${center.lat}`)
  const dy = Math.pow(Math.abs(point[1] - center.lat), 2);
  const dx = Math.pow(Math.abs(point[0] - center.lng), 2);
  const r = Math.pow(radius, 2);

  // console.log(`${dy} + ${dx} < ${r}`)

  return dx + dy < r;
};

module.exports = Safetify;

// (async () => {
//   // console.log(testdata);
//   const x = new Safetify(testdata);
//   const res = await x.getSafetifiedSteps();
//   // console.log(res);
// })();
