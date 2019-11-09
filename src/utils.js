export function getEfficientPath(callback, callback2) {
  console.log('called')
  fetch('/efficient')
  .then(response => response.json())
  .then(response => {
    callback();
    callback2(response);
  });
}

export function getMobi(callback) {
  fetch('/api/getMobi')
  .then(response => response.json())
  .then(response => callback(response))
}