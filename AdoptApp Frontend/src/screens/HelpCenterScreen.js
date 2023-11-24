import React, { useState, useEffect, useContext } from 'react';
import { View, StyleSheet } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { useHelpCenters } from '../contexts/HelpCenterProvider';
const HelpCenterScreen = () => {
  const [markers, setMarkers] = useState([]);
  const { findAllCoordinates } = useHelpCenters();

  useEffect(() => {
    loadMarkers();
  }, []);

  const loadMarkers = async () => {
    try {
      const data = await findAllCoordinates();
      console.log(data);
      setMarkers(data); // Asegúrate de que el formato de los datos coincide con lo que espera el componente Marker
    } catch (error) {
      console.error('Error cargando los marcadores:', error);
    }
  };

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: -33.048653170682776,
          longitude: -71.61881189793348,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      >
        {markers.map(marker => (
          <Marker
            key={marker.id}
            coordinate={{ latitude: parseFloat(marker.latitude), longitude: parseFloat(marker.longitude) }}
            title={marker.title}
            description={marker.description}
          />
        ))}
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  map: {
    width: '100%',
    height: '100%',
  },
});

export default HelpCenterScreen;