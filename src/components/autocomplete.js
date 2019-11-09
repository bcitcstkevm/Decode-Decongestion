import React from 'react';
import { Autocomplete } from '@react-google-maps/api';
import { TextField} from '@material-ui/core';

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
