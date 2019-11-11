import React from 'react';
import { StreetViewPanorama } from '@react-google-maps/api';

class StreetView extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      heading: null,
    }
    this.timeRef
  }

  componentDidUpdate(prevProps) {
    if (this.props.positions && prevProps.currentPosition !== this.props.currentPosition) {
      if (this.timeRef){
        clearInterval(this.timeRef)
        this.setState({heading: null})
      }
      if (this.props.positions.length-1 > this.props.currentPosition) {
        const positions = this.props.positions
        const currentPosition = this.props.currentPosition
        const THRESH = 20
        const currentHeading = positions[currentPosition].heading
        const nextHeading = positions[currentPosition+1].heading
        if (Math.abs(currentHeading - nextHeading) > THRESH && !this.state.heading) {
          console.log('turning')
          this.timeRef = setInterval((() => {
            const increment = currentHeading - nextHeading > 0 ? -0.5 : 0.5
            console.log(increment)
            const newHeading = this.state.heading + increment
            console.log('turning ++')
            console.log(this.state.heading, newHeading, currentHeading, nextHeading)
            console.log(Math.abs(newHeading - nextHeading))
            if (Math.abs(newHeading - nextHeading) < 5) {
              clearInterval(this.timeRef)
              // this.setState({heading: null})
              return
            }
            this.setState({
              heading: this.state.heading ? newHeading : currentHeading
            })
          }).bind(this), 10)
        }
      }
    }
    if (this.props.positions && prevProps.currentPosition < this.props.currentPosition) {
      this.setState({
        heading: null
      })
    }
  }

  render() {
    const { positions, currentPosition, visbility } = this.props
    const { heading } = this.state
    const nHeading = heading ? heading : positions[currentPosition].heading
    console.log(nHeading)
    return <StreetViewPanorama
      pov={{ heading: nHeading, pitch: 0 }}
      position={positions[currentPosition]}
      visible={visbility}
      motionTracking={true}
      options={{ clickToGo: false, disableDefaultUI: true }}
    />
  }
}

export default StreetView;
