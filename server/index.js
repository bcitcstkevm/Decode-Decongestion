/* eslint-disable */

const express = require('express');
const next = require('next');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

const gda = require('./googleDirectionsApi');

app
  .prepare()
  .then(() => {
    const server = express();

    server.get('*', (req, res) => {
      return handle(req, res);
    });

    server.get('/efficient', (req, res) => {
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
      // mode and waypoints are optional
      const gdaobj = new gda(origin, dest, mode, waypoints);
      //result is an array of objects. each object is a step
      const result = gdaobj.getListOfDirectionsForEfficient();

      return handle(req, res);
    });

    server.listen(3000, (err) => {
      if (err) throw err;
      console.log('> Ready on http://localhost:3000');
    });
  })
  .catch((ex) => {
    console.error(ex.stack);
    process.exit(1);
  });
