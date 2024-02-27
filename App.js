// import React, { useState, useEffect, useMemo } from 'react';
// import { View, Text } from 'react-native';
// import MapView, { Marker, Polyline } from 'react-native-maps';
// import Geolocation from '@react-native-community/geolocation';
// import { LocationsProvider, useLocationsContext } from './LocationContext';
// const AudioPlayerLazy = React.lazy(() => import('./AudioPlayer'));

// const App = () => {
//   const locations = useLocationsContext();
//   const [userLocation, setUserLocation] = useState(null);
//   const [nearestLocation, setNearestLocation] = useState(null);
//   const [nearestDistance, setNearestDistance] = useState(null);
//   const [playAudio, setPlayAudio] = useState(false);

//   useEffect(() => {
//     const getUserLocation = () => {
//       Geolocation.getCurrentPosition(
//         position => {
//           const { latitude, longitude } = position.coords;
//           setUserLocation({ latitude, longitude });
//           findNearestLocation(latitude, longitude);
//         },
//         error => {
//           console.error('Error getting location:', error);
//         },
//         { enableHighAccuracy: true }
//       );
//     };

//     const findNearestLocation = (latitude, longitude) => {
//       let minDistance = Number.MAX_VALUE;
//       let nearestLocation = null;
//       locations.forEach(location => {
//         const distance = calculateDistance(
//           latitude,
//           longitude,
//           location.lat,
//           location.lon
//         );
//         if (distance < minDistance) {
//           minDistance = distance;
//           nearestLocation = location;
//         }
//       });
//       setNearestLocation(nearestLocation);
//       setNearestDistance(minDistance);
//       setPlayAudio(minDistance < 300); // Set playAudio to true if nearest location is within 300 meters
//     };

//     getUserLocation();

//     const watchId = Geolocation.watchPosition(
//       position => {
//         const { latitude, longitude } = position.coords;
//         setUserLocation({ latitude, longitude });
//         findNearestLocation(latitude, longitude);
//       },
//       error => {
//         console.error('Error watching position:', error);
//       },
//       { enableHighAccuracy: true }
//     );

//     return () => {
//       Geolocation.clearWatch(watchId);
//     };
//   }, [locations]);

//   const calculateDistance = (lat1, lon1, lat2, lon2) => {
//     const R = 6371e3; 
//     const φ1 = toRadians(lat1);
//     const φ2 = toRadians(lat2);
//     const Δφ = toRadians(lat2 - lat1);
//     const Δλ = toRadians(lon2 - lon1);

//     const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
//       Math.cos(φ1) * Math.cos(φ2) *
//       Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
//     const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

//     const distance = R * c;
//     return distance;
//   };

//   const toRadians = (degrees) => {
//     return degrees * Math.PI / 180;
//   };

//   const AudioPlayerMemo = useMemo(() => React.lazy(() => import('./AudioPlayer')), []);

//   return (
//     <View style={{ flex: 1 }}>
//       {userLocation && (
//         <MapView
//           style={{ flex: 1 }}
//           initialRegion={{
//             latitude: userLocation.latitude,
//             longitude: userLocation.longitude,
//             latitudeDelta: 0.0922,
//             longitudeDelta: 0.0421,
//           }}
//         >
//           {/* Render user's location marker */}
//           <Marker
//             coordinate={userLocation}
//             title="Your Location"
//           />

//           {/* Render marker for the nearest location */}
//           {nearestLocation && (
//             <Marker
//               coordinate={{ latitude: nearestLocation.lat, longitude: nearestLocation.lon }}
//               title={nearestLocation.name}
//             />
//           )}

//           {/* Render polyline between user's location and nearest location */}
//           {nearestLocation && (
//             <Polyline
//               coordinates={[
//                 { latitude: userLocation.latitude, longitude: userLocation.longitude },
//                 { latitude: nearestLocation.lat, longitude: nearestLocation.lon },
//               ]}
//               strokeColor="#F00"
//               strokeWidth={2}
//             />
//           )}
//         </MapView>
//       )}

//       <Text>User Location:</Text>
//       <Text>Latitude: {userLocation ? userLocation.latitude : 'Loading...'}</Text>
//       <Text>Longitude: {userLocation ? userLocation.longitude : 'Loading...'}</Text>

//       {/* Display nearest location name and distance */}
//       {nearestLocation && (
//         <Text>Nearest Location: {nearestLocation.name}</Text>
//       )}
//       {nearestDistance && (
//         <Text>Distance to Nearest Location: {nearestDistance} meters</Text>
//       )}

//       {/* Display audio player if nearest location is within 300 meters, otherwise display message */}
//       <React.Suspense fallback={<Text>Loading...</Text>}>
//         {playAudio ? (
//           <AudioPlayerMemo nearbyLocations={[nearestLocation]} />
//         ) : (
//           <Text>No predefined location is within 300 meters from your location</Text>
//         )}
//       </React.Suspense>
//     </View>
//   );
// };

// export default () => (
//   <LocationsProvider>
//     <App />
//   </LocationsProvider>
// );


import React, { useState, useEffect, useMemo, useRef } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import MapView, { Marker, Circle, Polyline } from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import { LocationsProvider, useLocationsContext } from './LocationContext';
const AudioPlayerLazy = React.lazy(() => import('./AudioPlayer'));

const App = () => {
  const locations = useLocationsContext();
  const [userLocation, setUserLocation] = useState(null);
  const [nearestLocation, setNearestLocation] = useState(null);
  const [nearestDistance, setNearestDistance] = useState(null);
  const [playAudio, setPlayAudio] = useState(false);

  const mapRef = useRef(null); // Reference to MapView component

  useEffect(() => {
    const getUserLocation = () => {
      Geolocation.getCurrentPosition(
        position => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ latitude, longitude });
          findNearestLocation(latitude, longitude);
        },
        error => {
          console.error('Error getting location:', error);
        },
        { enableHighAccuracy: true }
      );
    };

    const findNearestLocation = (latitude, longitude) => {
      let minDistance = Number.MAX_VALUE;
      let nearestLocation = null;
      locations.forEach(location => {
        const distance = calculateDistance(
          latitude,
          longitude,
          location.lat,
          location.lon
        );
        if (distance < minDistance) {
          minDistance = distance;
          nearestLocation = location;
        }
      });
      setNearestLocation(nearestLocation);
      setNearestDistance(minDistance);
    };

    const watchUserLocation = () => {
      Geolocation.watchPosition(
        position => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ latitude, longitude });
          if (nearestLocation) {
            const distance = calculateDistance(latitude, longitude, nearestLocation.lat, nearestLocation.lon);
            setPlayAudio(distance < 100);
          }
        },
        error => {
          console.error('Error watching position:', error);
        },
        { enableHighAccuracy: true }
      );
    };

    getUserLocation();
    const watchId = watchUserLocation();

    return () => {
      Geolocation.clearWatch(watchId);
    };
  }, [locations, nearestLocation]);

  useEffect(() => {
    // Animate to user's location when userLocation changes
    if (userLocation && mapRef.current) {
      mapRef.current.animateCamera({
        center: {
          latitude: userLocation.latitude,
          longitude: userLocation.longitude,
        },
        zoom: 18, // Zoom level for a closer view
        altitude: 1000, // Altitude for a closer view
      });
    }
  }, [userLocation]);

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371e3; 
    const φ1 = toRadians(lat1);
    const φ2 = toRadians(lat2);
    const Δφ = toRadians(lat2 - lat1);
    const Δλ = toRadians(lon2 - lon1);

    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) *
      Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    const distance = R * c;
    return distance;
  };

  const toRadians = (degrees) => {
    return degrees * Math.PI / 180;
  };

  const AudioPlayerMemo = useMemo(() => React.lazy(() => import('./AudioPlayer')), []);

  const handleRefresh = () => {
    if (mapRef.current) {
      Geolocation.getCurrentPosition(
        position => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ latitude, longitude });
          mapRef.current.animateToRegion({
            latitude,
            longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          });
        },
        error => {
          console.error('Error getting location:', error);
        },
        { enableHighAccuracy: true }
      );
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <MapView
        ref={mapRef} // Pass the reference to the MapView component
        style={{ flex: 1 }}
      >
        {/* Render circle for user's location */}
        {userLocation && (
          <Circle
            center={userLocation}
            radius={0.7} // Adjust the radius as needed for the accuracy level
            fillColor="rgba(255,200,0,0.9)" // Orange color with 30% opacity
            strokeColor="transparent"
          />
        )}

        {/* Render marker for the nearest location */}
        {nearestLocation && (
          <Marker
            coordinate={{ latitude: nearestLocation.lat, longitude: nearestLocation.lon }}
            title={nearestLocation.name}
          />
        )}

        {/* Render polyline between user's location and nearest location
        {nearestLocation && (
          <Polyline
            coordinates={[
              { latitude: userLocation.latitude, longitude: userLocation.longitude },
              { latitude: nearestLocation.lat, longitude: nearestLocation.lon },
            ]}
            strokeColor="#F00"
            strokeWidth={2}
          />
        )} */}
      </MapView>

      <View style={{ alignItems: 'center', padding: 4, backgroundColor: '#48BB78' }}>
        <TouchableOpacity onPress={handleRefresh}>
          <Text style={{ fontSize: 12, color: '#fff' }}>Refresh</Text>
        </TouchableOpacity>
      </View>

      {/* <Text>User Location:</Text>
      <Text>Latitude: {userLocation ? userLocation.latitude : 'Loading...'}</Text>
      <Text>Longitude: {userLocation ? userLocation.longitude : 'Loading...'}</Text> */}

      {/* Display nearest location name and distance */}
      {nearestLocation && (
        <View style={{ alignItems: 'center' }}>
          <Text>Nearest Location: {nearestLocation.name}</Text>
        </View>
      )}
      {/* {nearestDistance && (
        <Text>Distance to Nearest Location: {nearestDistance} meters</Text>
      )} */}

      {/* Display audio player if user is within 300 meters of nearest location */}
      <React.Suspense fallback={<Text>Loading...</Text>}>
        {playAudio ? (
          <AudioPlayerMemo nearbyLocations={[nearestLocation]} />
        ) : (
          <Text>Walking towards nearest location...</Text>
        )}
      </React.Suspense>
    </View>
  );
};

export default () => (
  <LocationsProvider>
    <App />
  </LocationsProvider>
);
