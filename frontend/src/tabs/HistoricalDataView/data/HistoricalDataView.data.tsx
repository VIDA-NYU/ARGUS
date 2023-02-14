
import React, { useState, useEffect } from 'react';

const useSomeData = () => {

    // Recordings
  const [availableRecordings, setAvailableRecordings] = React.useState(['']);
  const [selectedRecordingID, setSelectedRecordingID] = React.useState<string>('');
  
//   useEffect(() => {
//     if (!someData) {
//       setLoading(true);
//       dispatch(fetchSomeData())
//         .catch(error => setError(error))
//         .finally(() => setLoading(false));
//     }
//   }, []);
  
  return { availableRecordings, selectedRecordingID }; 
};