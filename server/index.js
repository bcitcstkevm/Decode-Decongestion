/* eslint-disable */

const express = require('express');
const next = require('next');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

const gda = require('./googleDirectionsApi');
const mobi = require('./mobiBike')

app
  .prepare()
  .then(() => {
    const server = express();

    const gdaobj = new gda();

    server.get('/api/getMobi', (req, res) => {
      mobi.getMobiBikeStation().then(result => {
        res.send(result)
      })
    })

    server.get('/efficient', (req, res) => {
      const origin = {
        name: req.query.pointAName,
        lat: req.query.pointALat,
        lng: req.query.pointALng,
      };

      const dest = {
        name: req.query.pointBName,
        lat: req.query.pointBLat,
        lng: req.query.pointBLng,
      };

      gdaobj.setCVars(origin, dest);
      // mode and waypoints are optional
      //result is an array of objects. each object is a step
      gdaobj.getListOfDirectionsForEfficient().then(result => {
        res.send(result)
      })
    });

    server.get('*', (req, res) => {
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
