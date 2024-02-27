// import React, { useEffect, useRef } from 'react';
// import { Audio } from 'expo-av';

// const AudioPlayer = ({ nearbyLocations }) => {
//   const soundObjectRef = useRef(null);

//   useEffect(() => {
//     const loadAndPlayAudio = async (audioFile) => {
//       try {
//         const { sound } = await Audio.Sound.createAsync(audioFile);
//         soundObjectRef.current = sound;
//         await soundObjectRef.current.playAsync();
//       } catch (error) {
//         console.error('Error playing audio:', error);
//       }
//     };

//     const unloadAudio = async () => {
//       try {
//         if (soundObjectRef.current) {
//           await soundObjectRef.current.stopAsync();
//           await soundObjectRef.current.unloadAsync();
//         }
//       } catch (error) {
//         console.error('Error unloading audio:', error);
//       }
//     };

//     // Load and play audio when nearbyLocations change
//     if (nearbyLocations.length > 0) {
//       const audioFile = nearbyLocations[0].audio; // Assuming only one audio file for simplicity
//       loadAndPlayAudio(audioFile);
//     }

//     // Unload audio when the component unmounts or when nearbyLocations change
//     return () => {
//       unloadAudio();
//     };
//   }, [nearbyLocations]);

//   return null; // No UI elements in this component
// };

// export default AudioPlayer;


import React, { useEffect, useRef } from 'react';
import { Audio } from 'expo-av';

const AudioPlayer = ({ nearbyLocations }) => {
  const soundObjectRef = useRef(null);

  useEffect(() => {
    const loadAndPlayAudio = async (audioFile) => {
      try {
        const { sound } = await Audio.Sound.createAsync(audioFile);
        soundObjectRef.current = sound;
        await soundObjectRef.current.playAsync();
      } catch (error) {
        console.error('Error loading and playing audio:', error);
      }
    };

    const unloadAudio = async () => {
      try {
        if (soundObjectRef.current && soundObjectRef.current.getStatusAsync) {
          const status = await soundObjectRef.current.getStatusAsync();
          if (status.isPlaying) {
            await soundObjectRef.current.stopAsync();
          }
          await soundObjectRef.current.unloadAsync();
        }
      } catch (error) {
        console.error('Error unloading audio:', error);
      }
    };

    // Load and play audio when nearbyLocations change
    if (nearbyLocations.length > 0) {
      const audioFile = nearbyLocations[0].audio; // Assuming only one audio file for simplicity
      loadAndPlayAudio(audioFile);
    } else {
      // If no nearby locations, stop and unload audio
      unloadAudio();
    }

    // Unload audio when the component unmounts or when nearbyLocations change
    return () => {
      unloadAudio();
    };
  }, [nearbyLocations]);

  return null; // No UI elements in this component
};

export default AudioPlayer;
