import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Autocomplete } from '@react-google-maps/api';
import { TextField, InputAdornment, withStyles } from '@material-ui/core';
import { Close } from '@material-ui/icons';

const style = {
  textField: {
    borderRadius: 5,
    // border: '1px solid #000',
    width: '200px ',
    backgroundColor: '#fff',
  },
  closeButton: {
    cursor: 'pointer',
  },
};

class AutoCompleteInput extends Component {
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
    const { value, handleChange, classes } = this.props;
    return (
      <Autocomplete
        onLoad={this.onLoad}
        onPlaceChanged={this.onPlaceChanged}
      >
        <TextField
          variant="outlined"
          margin="dense"
          value={value.name}
          onChange={(e) => handleChange({ name: e.target.value })}
          classes={{root: classes.textField}}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                {value.name && <Close
                  className={classes.closeButton}
                  onClick={() => handleChange({ name: '' })}
                />}
              </InputAdornment>
            ),
          }}
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
  classes: PropTypes.shape({
    textField: PropTypes.string,
    closeButton: PropTypes.string,
  }).isRequired,
};

export default withStyles(style)(AutoCompleteInput);
