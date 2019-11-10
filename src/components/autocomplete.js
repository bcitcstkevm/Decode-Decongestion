import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Autocomplete } from '@react-google-maps/api';
import { Close } from '@material-ui/icons';

const classes = {
  wholeField: {
    backgroundColor: '#fff',
    borderRadius: 5,
    marginTop: '5px',
    marginBottom: '5px',
    border: '1px solid #000',
    paddingLeft: '5px',
    alignItems: 'center',
    display: 'flex',
    // width: '200px',
  },
  textField: {
    borderRadius: 5,
    border: '0px solid #fff',
    // border: '1px solid #000',
    // width: '200px ',
    backgroundColor: '#fff',
    fontFamily: 'Roboto Mono, monospace',
  },
  closeButton: {
    cursor: 'pointer',
  },
};

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
    }
  }

  render() {
    const { value, handleChange, placeholder, clearRoute } = this.props;
    return (
      <Autocomplete
        onLoad={this.onLoad}
        onPlaceChanged={this.onPlaceChanged}
      >
        <div style={classes.wholeField}>
          <input
            style={classes.textField}
            value={value.name}
            onChange={(e) => handleChange({ name: e.target.value })}
            placeholder={placeholder}
          />
          {value.name && (
            <Close
              className={classes.closeButton}
              onClick={() => {
                handleChange({ name: '' });
                clearRoute();
              }}
            />
          )}
        </div>
      </Autocomplete>
    );
  }
}


AutoCompleteInput.propTypes = {
  value: PropTypes.shape({
    name: PropTypes.string,
  }).isRequired,
  placeholder: PropTypes.string.isRequired,
  handleChange: PropTypes.func.isRequired,
  clearRoute: PropTypes.func.isRequired,
};
