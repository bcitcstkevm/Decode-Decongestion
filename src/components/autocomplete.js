import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Autocomplete } from '@react-google-maps/api';
import { Close } from '@material-ui/icons';

export default class AutoCompleteInput extends Component {
  constructor(props) {
    super(props);
    this.autocomplete = null;
    this.onLoad = this.onLoad.bind(this);
    this.onPlaceChanged = this.onPlaceChanged.bind(this);
  }

  onLoad(autocomplete) {
    this.autocomplete = autocomplete;
  }

  onPlaceChanged() {
    const { handleChange } = this.props;
    if (this.autocomplete !== null) {
      const place = this.autocomplete.getPlace();
      handleChange({
        name: place.name,
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng(),
      });
    } else {
      console.log('Autocomplete is not loaded yet!');
    }
  }

  render() {
    const { value, handleChange, style } = this.props;
    return (
      <Autocomplete
        onLoad={this.onLoad}
        onPlaceChanged={this.onPlaceChanged}
      >
        <input
          value={value.name}
          onChange={(e) => handleChange({ name: e.target.value })}
          style={style}
        />
      </Autocomplete>
    );
  }
}


AutoCompleteInput.propTypes = {
  value: PropTypes.shape({
    name: PropTypes.string,
  }).isRequired,
  handleChange: PropTypes.func.isRequired,
  style: PropTypes.shape({}).isRequired,
};
