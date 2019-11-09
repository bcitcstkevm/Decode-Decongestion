import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Autocomplete } from '@react-google-maps/api';
import { TextField, makeStyles } from '@material-ui/core';

const useStyles = makeStyles({
  textField: {
  // css if required
  },
});

export default class AutoCompleteInput extends Component {
  constructor(props) {
    super(props);
    this.autocomplete = null;
    this.onLoad = this.onLoad.bind(this);
    this.onPlaceChanged = this.onPlaceChanged.bind(this);
  }

  onLoad (autocomplete) {
    console.log('autocomplete: ', autocomplete);

    this.autocomplete = autocomplete;
  }

  onPlaceChanged () {
    const { handleChange } = this.props;
    if (this.autocomplete !== null) {
      const place = this.autocomplete.getPlace();
      handleChange({
        name: place.name,
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng(),
      })
    } else {
      console.log('Autocomplete is not loaded yet!');
    }
  }

  render() {
    const { value, handleChange } = this.props;
    return (
      <Autocomplete
        onLoad={this.onLoad}
        onPlaceChanged={this.onPlaceChanged}
      >
        <TextField
          value={value.name}
          onChange={(e) => handleChange({ name: e.target.value })}
          // className={classes.textField}
          variant="outlined"
          margin="dense"
        />
      </Autocomplete>
    );
  };

}


AutoCompleteInput.propTypes = {
  value: PropTypes.string.isRequired,
  handleChange: PropTypes.func.isRequired,
};
