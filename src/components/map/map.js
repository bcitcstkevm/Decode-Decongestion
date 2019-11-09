import React from 'react';
import PropTypes from 'prop-types'
import { GoogleMap, Marker, Polyline } from '@react-google-maps/api'
import { getEfficientPath } from '../../utils'

const INITIAL_CENTER = {lat: 49.2577143, lng: -123.1939432}

export default class Map extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      path: [],
    }
    this.mapRef
  }

  handleClick(e) {
    const lat = e.latLng.lat()
    const lng = e.latLng.lng()
    const { placeA } = this.props
    if (Object.keys(placeA).length !== 3) {
      this.props.setPlaceA({name: `${lat.toFixed(3)}, ${lng.toFixed(3)}`, lat, lng})
    } else {
      this.props.setPlaceB({name: `${lat.toFixed(3)}, ${lng.toFixed(3)}`, lat, lng})

    }
  }

  render(){
    const { path } = this.state
    const { placeA, placeB, style } = this.props
    console.log(path)
    return (
      <GoogleMap
        id='map'
        mapContainerStyle={style}
        center={INITIAL_CENTER}
        zoom={12}
        onClick={this.handleClick.bind(this)}
        onLoad={ref => {
          this.mapRef = ref
        }}
      >
        {placeA.lat && <Marker
          position={placeA}
        />}
        {placeB.lat && <Marker
          position={placeB}
        />}
        {path && path.map((line, i) => {
          const { start_location, end_location } = line
          return <Polyline
            key={i}
            path={[
              {lat: start_location.lat, lng: start_location.lng},
              {lat: end_location.lat, lng: end_location.lng},
            ]}
          />
        })}
      </GoogleMap>
      )
  }
}

Map.propTypes = {
  placeA: PropTypes.shape({}).isRequired,
  placeB: PropTypes.shape({}).isRequired,
  setPlaceA: PropTypes.func.isRequired,
  setPlaceB: PropTypes.func.isRequired,
}