/* eslint-disable */

const API_KEY = '5b3b85e2e5ef912d9e1c24011e5796a0232d47671a1c7a90b14ebcae';
const API_PATH = `https://decode-congestion-vancouver.opendatasoft.com/api/records/1.0/search/?dataset=copy-of-city-of-vancouver`;
const axios = require('axios');
const testdata = require('./testdata');

class Safetify {
  constructor(arrayOfSteps = null, arrOfWarnings = null) {
    this.arrayOfSteps = arrayOfSteps;
    this.arrOfWarnings = arrOfWarnings;
  }

  setCVars(arrOfSteps, arrOfWarnings) {
    this.arrOfSteps = arrOfSteps;
    this.arrOfWarnings = arrOfWarnings;
  }

  getPath() {
    const key = `&apikey=${API_KEY}`;
    const row = `&rows=1082`;
    return `${API_PATH}${key}${row}`;
  }

  async getSafetifiedSteps() {
    const path = this.getPath();
    const options = {
      method: 'GET',
      url: path,
    };
    const bikeApiResponse = await axios(options);
    if (bikeApiResponse.status != 200 || bikeApiResponse.statusText !== 'OK') {
      throw new Error('line 32 safetifyAPI');
    }
    const { data } = bikeApiResponse;

    const saftified = [];

    this.arrOfSteps.forEach((step) => {
      const { lat, lng } = step.start_location;
      
    });

    // this.arrOfSteps = this.arrayOfSteps.map((obj)=>{
    //   obj.
    // })

    console.log(this.getPath());
  }

  ping() {
    console.log('helloworld');
  }
  //   getWayPoints() {
  //     if (this.waypoints === null) return '';

  //     let wayPointsUrl = '&';
  //     this.waypoints.forEach((coor) => {
  //       wayPointsUrl = wayPointsUrl + coor.join(',') + '|';
  //     });

  //     wayPointsUrl = wayPointsUrl.substring(0, wayPointsUrl.length - 2);
  //     return wayPointsUrl;
  //   }

  //   parseCoordinate(obj) {
  //     return `${obj.lat},${obj.lng}`;
  //   }

  //   getPath() {
  //     const o = `origin=${this.parseCoordinate(this.origin)}`;
  //     const d = `&destination=${this.parseCoordinate(this.destination)}`;
  //     const key = `&key=${API_KEY1}`;
  //     const mode = `&mode=${this.mode}`;
  //     const waypoints = this.getWayPoints();
  //     return `${API_PATH}${o}${d}${key}${mode}${waypoints}`;
  //   }

  //   async getListOfDirectionsForEfficient() {
  //     const path = this.getPath();
  //     const options = {
  //       method: 'GET',
  //       url: path,
  //     };
  //     const res = await axios(options);

  //     if (res.status != 200 || res.statusText !== 'OK' || res.data.status != 'OK') {
  //       throw new Error('line 35 google directions API');
  //     }
  //     const result = this.parseResponseV1(res.data);
  //     return result;
  //   }
  //   parseResponseV1(data) {
  //     const { routes } = data;
  //     const firstRoute = routes[0];
  //     const { bounds, legs, warnings, waypoint_order } = firstRoute;
  //     const firstLeg = legs[0];
  //     const { steps } = firstLeg;
  //     return steps;
  //   }
}

module.exports = Safetify;

(async () => {
  const x = new Safetify(testdata);
  const res = await x.getSafetifiedSteps();
  // console.log(res);
})();
