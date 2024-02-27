// import React, { useState, useEffect, useRef } from 'react';
// import { View, Text, StyleSheet, Dimensions, PermissionsAndroid } from 'react-native';
// import MapView, { Polyline, Marker } from 'react-native-maps';
// import Geolocation from '@react-native-community/geolocation';
// import AudioPlayer from './AudioPlayer';

// const locations = [
//     { name: "Abhilash", lat: 17.4916545, lon: 78.4003628, audio: require('./assets/cat-2-30-sec-110543.mp3') },
//     { name: "San Francisco", lat: 37.4219333, lon: -122.084, audio: require('./assets/chitarra-e-piano-3-30-sec-110546.mp3') },
//     { name: "Kphb", lat: 17.4938, lon: 78.4017, audio: require('./assets/dramatic-hybrid-trailer-30-sec-version-15861.mp3') },
//     { name: "Jntu", lat: 17.4965, lon: 78.3729, audio: require('./assets/epic-music-2-30-sec-110552.mp3') },
//     { name: "Miyapur", lat: 17.4933, lon: 78.3914, audio: require('./assets/fast-epic-30-sec-108426.mp3') },
//     { name: "Vcube", lat: 17.4930, lon: 78.4021, audio: require('./assets/slow-epic-30-sec-15819.mp3') },
//     { name: "Punjagutta", lat: 17.4254, lon: 78.4505, audio: require('./assets/technology-corporate-30-sec-117095.mp3') },
//     { name: "NextGalleria Mall", lat: 17.42928, lon: 78.45436, audio: require('./assets/slow-epic-30-sec-15819.mp3') }
//   ];

// const { width, height } = Dimensions.get('window');

// const App = () => {
//   const [userLocation, setUserLocation] = useState(null);
//   const [nearbyLocations, setNearbyLocations] = useState([]);
//   const mapRef = useRef(null);

//   useEffect(() => {
//     const requestLocationPermission = async () => {
//       try {
//         const granted = await PermissionsAndroid.request(
//           PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
//           {
//             title: 'Location Permission',
//             message: 'This app requires access to your location.',
//             buttonNeutral: 'Ask Me Later',
//             buttonNegative: 'Cancel',
//             buttonPositive: 'OK',
//           },
//         );
//         if (granted === PermissionsAndroid.RESULTS.GRANTED) {
//           console.log('Location permission granted');
//           getCurrentLocation();
//         } else {
//           console.log('Location permission denied');
//         }
//       } catch (err) {
//         console.warn(err);
//       }
//     };

//     requestLocationPermission();

//     return () => {
//       Geolocation.clearWatch(watchId); // Clear watch position when component unmounts
//     };
//   }, []);

//   const getCurrentLocation = () => {
//     Geolocation.getCurrentPosition(
//       (position) => {
//         const initialPosition = position.coords;
//         setUserLocation({
//           latitude: initialPosition.latitude,
//           longitude: initialPosition.longitude,
//         });
//         calculateDistances(initialPosition);
//       },
//       (error) => {
//         console.error('Error getting location:', error);
//       },
//       { enableHighAccuracy: true }
//     );

//     const watchId = Geolocation.watchPosition(
//       (position) => {
//         const newPosition = position.coords;
//         setUserLocation({
//           latitude: newPosition.latitude,
//           longitude: newPosition.longitude,
//         });
//         calculateDistances(newPosition);
//       },
//       (error) => {
//         console.error('Error watching position:', error);
//       },
//       { enableHighAccuracy: true, distanceFilter: 10 }
//     );
//   };

//   const calculateDistances = (newLocation) => {
//     // Calculate distances to predefined locations
//     const newDistances = locations.map(location =>
//       ({ name: location.name, distance: calculateDistance(location.lat, location.lon, newLocation.latitude, newLocation.longitude), audio: location.audio })
//     );

//     // Filter locations with distances less than 300 meters
//     const nearbyLocations = newDistances.filter(location => location.distance < 300);

//     setNearbyLocations(nearbyLocations);
//   };

//   const calculateDistance = (lat1, lon1, lat2, lon2) => {
//     // Haversine formula to calculate distance between two points
//     const R = 6371e3; // Earth radius in meters
//     const φ1 = toRadians(lat1);
//     const φ2 = toRadians(lat2);
//     const Δφ = toRadians(lat2 - lat1);
//     const Δλ = toRadians(lon2 - lon1);

//     const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
//       Math.cos(φ1) * Math.cos(φ2) *
//       Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
//     const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

//     const distance = R * c;
//     return distance; // in meters
//   };

//   const toRadians = (degrees) => {
//     return degrees * Math.PI / 180;
//   };

//   return (
//     <View style={styles.container}>
//       <MapView
//         ref={mapRef}
//         style={styles.map}
//         initialRegion={{
//           latitude: userLocation ? userLocation.latitude : 0,
//           longitude: userLocation ? userLocation.longitude : 0,
//           latitudeDelta: 0.0922,
//           longitudeDelta: 0.0421,
//         }}
//       >
//         {userLocation && (
//           <Marker
//             coordinate={{
//               latitude: userLocation.latitude,
//               longitude: userLocation.longitude
//             }}
//             title="Your Location"
//           />
//         )}
//         {nearbyLocations.map((location, index) => (
//           <Marker
//             key={index}
//             coordinate={{
//               latitude: locations.find(loc => loc.name === location.name).lat,
//               longitude: locations.find(loc => loc.name === location.name).lon
//             }}
//             title={location.name}
//           />
//         ))}
//         {nearbyLocations.map((location, index) => (
//           <Polyline
//             key={index}
//             coordinates={[
//               { latitude: userLocation.latitude, longitude: userLocation.longitude },
//               { latitude: locations.find(loc => loc.name === location.name).lat, longitude: locations.find(loc => loc.name === location.name).lon }
//             ]}
//             strokeWidth={2}
//             strokeColor="#FF0000"
//           />
//         ))}
//       </MapView>
//       <Text>User Location:</Text>
//       <Text>Latitude: {userLocation ? userLocation.latitude : 'Loading...'}</Text>
//       <Text>Longitude: {userLocation ? userLocation.longitude : 'Loading...'}</Text>
//       <AudioPlayer nearbyLocations={nearbyLocations} />
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
//   map: {
//     width: width,
//     height: height,
//   },
// });

// export default App;
