import { StyleSheet, View } from "react-native";
import MapView, { Marker } from "react-native-maps";

type Props = {
  latitude: number;
  longitude: number;
  onSelectLocation: (lat: number, lng: number) => void;
};

export default function MapPicker({
  latitude,
  longitude,
  onSelectLocation,
}: Props) {
  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: latitude || -8.6705,
          longitude: longitude || 115.2126,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
        onPress={(e) => {
          const { latitude, longitude } = e.nativeEvent.coordinate;
          onSelectLocation(latitude, longitude);
        }}
      >
        {(latitude !== 0 && longitude !== 0) && (
          <Marker coordinate={{ latitude, longitude }} />
        )}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 250,
    borderRadius: 12,
    overflow: "hidden",
  },
  map: {
    flex: 1,
  },
});
