import React from 'react';
import PropTypes from 'prop-types';

export default function Results({
  fetchingData, fastestRoute,
}) {
  console.log(fastestRoute);
  return (
    <div>
      {fetchingData
        ? (
          <p>Fetching</p>)
        : (
          <p>Done fetching</p>
      )}
    </div>
  );
}

Results.propTypes = {
  fetchingData: PropTypes.bool.isRequired,
  fastestRoute: PropTypes.arrayOf().isRequired,
};
