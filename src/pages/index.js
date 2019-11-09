import React from 'react'
import { GoogleMap, LoadScript } from '@react-google-maps/api'
import Head from 'next/head'
import { displayPano } from '../scripts/pannellum'

export default class Index extends React.Component {
  componentDidMount() {
    displayPano('https://pannellum.org/images/alma.jpg')
  }

  render() {
    return <div style={{display: 'flex', height: '100vh'}}>
      <Head>
        <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css" integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossorigin="anonymous"></link>
        <script src="https://cdn.jsdelivr.net/npm/pannellum@2.5.4/build/pannellum.js"></script>
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/pannellum@2.5.4/build/pannellum.css"></link>
      </Head>

      <div style={{display: 'flex', flex: 1}}>
        <button className="btn btn-success">asd</button>
        <div id="panorama"></div>
      </div>

      <div style={{display: 'flex', flex: 1}}>
        <LoadScript
          id="script-loader"
          googleMapsApiKey="AIzaSyAdgZKoxkdZjb92G7aMvEiJYiegd9n6rbA"
        >
          <GoogleMap
            id='example-map'
            mapContainerStyle={{ height: '100%', width: '100%' }}
            center={{lat: 49.2577143, lng: -123.1939432}}
            zoom={12}
          >
          </GoogleMap>
        </LoadScript>
      </div>
    </div>
  }
}
