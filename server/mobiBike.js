const axios = require('axios');

const url = 'https://decode-congestion-vancouver.opendatasoft.com/api/records/1.0/search/?dataset=mobi-by-shaw-go-station-information'
const apiKey = `c680927187f8fc8f11b96b36d7b0d49675a7dee21c2ff0f7a527b806`;

const getMobiBikeStation = async () => {
    const stationData = [];

    const path = `${url}&apikey=${apiKey}`;
    const result = await axios.get(path);
    const records = result.data.records;
    records.forEach(dataObject => {
        stationData.push(dataObject.fields);
    })

    return stationData;
}

const pointWithinCircle = (point, center, radius) => {
    const dy = Math.pow(Math.abs(point[0] - center.lat), 2);
    const dx = Math.pow(Math.abs(point[1] - center.lng), 2);
    const r = Math.pow(radius, 2);
    
    return (dx + dy) < r
}

const getNearestBikeStation = async (origin, distance = 5) => {
    const stationData = await getMobiBikeStation();
    const distanceFromOrigin = distance; // Distance from origin in km;
    const kmPerDegreeLatitude = 1 / 111;
    const distanceAwayFromCenter = distanceFromOrigin * kmPerDegreeLatitude; //radius

    const availableStations = stationData.filter((obj) => pointWithinCircle(obj.geopoint, origin, distanceAwayFromCenter) && obj.avl_bikes > 0)
    return availableStations;
}

// const origin = {
//     name: undefined,
//     lat:  49.28602,
//     lng: -123.116624
// }

// getNearestBikeStation(origin);

module.exports = {
    getMobiBikeStation,
}