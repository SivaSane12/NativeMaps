import React, { createContext, useContext } from 'react';

const LocationsContext = createContext();

export const useLocationsContext = () => useContext(LocationsContext);

export const LocationsProvider = ({ children }) => {
  const locations = [
    { name: "Abhilash", lat: 17.4916545, lon: 78.4003628, audio: require('./assets/cat-2-30-sec-110543.mp3') },
    { name: "San Francisco", lat: 37.4219333, lon: -122.084, audio: require('./assets/chitarra-e-piano-3-30-sec-110546.mp3') },
    { name: "Kphb", lat: 17.4938, lon: 78.4017, audio: require('./assets/dramatic-hybrid-trailer-30-sec-version-15861.mp3') },
    { name: "Jntu", lat: 17.4965, lon: 78.3729, audio: require('./assets/epic-music-2-30-sec-110552.mp3') },
    { name: "Miyapur", lat: 17.4933, lon: 78.3914, audio: require('./assets/fast-epic-30-sec-108426.mp3') },
    { name: "Vcube", lat: 17.4930, lon: 78.4021, audio: require('./assets/slow-epic-30-sec-15819.mp3') },
    { name: "Punjagutta", lat: 17.4254, lon: 78.4505, audio: require('./assets/technology-corporate-30-sec-117095.mp3') },
    { name: "NextGalleria Mall", lat: 17.42928, lon: 78.45436, audio: require('./assets/slow-epic-30-sec-15819.mp3') }
  ];

  return (
    <LocationsContext.Provider value={locations}>
      {children}
    </LocationsContext.Provider>
  );
};
