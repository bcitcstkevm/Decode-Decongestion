export function getMobi(callback) {
  fetch('/api/getMobi')
  .then(response => response.json())
  .then(response => callback(response))
}