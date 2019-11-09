export function displayPano(url) {
  pannellum.viewer('panorama', {
    "type": "equirectangular",
    "panorama": url,
    "autoLoad": true,
    "hotSpots": [
      {
          "pitch": 14.1,
          "yaw": 1.5,
          "type": "info",
          "text": "Baltimore Museum of Art",
          "URL": "https://artbma.org/"
      },
      {
          "pitch": -9.4,
          "yaw": 222.6,
          "type": "info",
          "text": "Art Museum Drive"
      },
      {
          "pitch": -0.9,
          "yaw": 144.4,
          "type": "info",
          "text": "North Charles Street"
      }
  ]
  });
}