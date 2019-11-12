import React from 'react';
import PropTypes from 'prop-types';
import { StreetViewPanorama } from '@react-google-maps/api';

class StreetView extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      heading: null,
    }
    this.timeRef;
  }

  componentDidUpdate(prevProps) {
    const { currentPosition, positions } = this.props;
    const { heading } = this.state;
    if (positions && prevProps.currentPosition !== currentPosition) {
      if (this.timeRef) {
        clearInterval(this.timeRef)
        this.setState({ heading: null });
      }
      if (positions.length - 1 > currentPosition) {
        const THRESH = 20;
        const currentHeading = positions[currentPosition].heading;
        const nextHeading = positions[currentPosition + 1].heading;
        if (Math.abs(currentHeading - nextHeading) > THRESH && !heading) {
          // console.log('turning');
          this.timeRef = setInterval((() => {
            const increment = currentHeading - nextHeading > 0 ? -0.5 : 0.5
            // console.log(increment);
            const newHeading = heading + increment;
            // console.log('turning ++');
            // console.log(this.state.heading, newHeading, currentHeading, nextHeading);
            // console.log(Math.abs(newHeading - nextHeading));
            if (Math.abs(newHeading - nextHeading) < 5) {
              clearInterval(this.timeRef);
              // this.setState({heading: null})
              return;
            }
            this.setState({
              heading: this.state.heading ? newHeading : currentHeading,
            })
          }).bind(this), 10)
        }
      }
    }
    if (positions && prevProps.currentPosition < currentPosition) {
      this.setState({
        heading: null
      })
    }
  }

  render() {
    const { positions, currentPosition, visbility } = this.props;
    const { heading } = this.state;
    const nHeading = heading || positions[currentPosition].heading;
    return (
      <StreetViewPanorama
        pov={{ heading: nHeading, pitch: 0 }}
        position={positions[currentPosition]}
        visible={visbility}
        motionTracking
        options={{ clickToGo: false, disableDefaultUI: true }}
      />
    );
  }
}

StreetView.propTypes = {
  positions: PropTypes.arrayOf(
    PropTypes.shape({
      heading: PropTypes.number,
    }),
  ).isRequired,
  currentPosition: PropTypes.number.isRequired,
  visbility: PropTypes.bool.isRequired,
};

export default StreetView;
