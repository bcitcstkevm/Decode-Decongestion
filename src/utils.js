export function getEfficientPath(callback, callback2) {
  console.log('called')
  fetch('/efficient')
    .then(response => response.json())
    .then(response => {
      callback();
      callback2(response);
    });
}