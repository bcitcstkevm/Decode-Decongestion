import React from 'react';
import PropTypes from 'prop-types';
import { Autocomplete } from '@react-google-maps/api';
import { TextField } from '@material-ui/core';

export default function AutoCompleteInput({
  value, handleChange,
}) {
  return (
    <Autocomplete>
      <TextField
        value={value}
        onChange={(e) => handleChange(e.target.value)}
      />
    </Autocomplete>
  );
}

AutoCompleteInput.propTypes = {
  value: PropTypes.string.isRequired,
  handleChange: PropTypes.func.isRequired,
};
