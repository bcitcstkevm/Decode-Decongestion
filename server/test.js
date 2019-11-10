const googleDirectionsApi = require('./googleDirectionsApi');
const Safetify = require('./safetify');

(async () => {
  
    const origin = {
      name: undefined,
      lat: 49.275802,
      lng: -122.94506,
    };
  
    const dest = {
      name: 'UBC',
      lat: 49.260026,
      lng: -123.245942,
    };
  
    const x = new googleDirectionsApi(origin, dest, 'bicycling');
    const result = await x.getListOfDirectionsForEfficient();
    console.log(result.length);
  })();