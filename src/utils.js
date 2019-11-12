export function getEfficientPath(pointA, pointB, callback) {
  fetch(`/efficient?pointAName=${pointA.name}&pointALat=${pointA.lat}&pointALng=${pointA.lng}&pointBName=${pointB.name}&pointBLat=${pointB.lat}&pointBLng=${pointB.lng}`)
    .then((response) => response.json())
    .then((response) => {
      callback(response);
    });
}

export function getMobi(callback) {
  fetch('/api/getMobi')
    .then((response) => response.json())
    .then((response) => callback(response));
}

export function getSafest(pointA, pointB, callback) {
  fetch(`/safest?pointAName=${pointA.name}&pointALat=${pointA.lat}&pointALng=${pointA.lng}&pointBName=${pointB.name}&pointBLat=${pointB.lat}&pointBLng=${pointB.lng}`)
    .then((response) => response.json())
    .then((response) => {
      callback(response);
    });
}
