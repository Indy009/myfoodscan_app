import React, { useState } from 'react';
import { StyleSheet, View, Text, Button, Alert } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera/next';
import { CameraType } from 'expo-camera';
import { BarCodeScanner } from 'expo-barcode-scanner';
// Import the BarCodeScanner type if available
// import { BarCodeScanningResult } from 'expo-camera';

// Define this if type not available from imports
interface BarCodeEvent {
  type: string;
  data: string;
}

export default function App() {
  const [facing, setFacing] = useState('back');
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={{ textAlign: 'center' }}>We need your permission to show the camera</Text>
        <Button onPress={requestPermission} title="Grant Permission" />
      </View>
    );
  }

  const handleBarCodeScanned = ({ type, data }: BarCodeEvent) => {
    setScanned(true);
    Alert.alert("Barcode Scanned", `Type: ${type}, Data: ${data}`);
    fetchDataFromAPI(data);
    setTimeout(() => setScanned(false), 5000);
  };

  const fetchDataFromAPI = async (barcode: string) => {
    try {
      const response = await fetch(`https://world.openfoodfacts.org/api/v0/product/${barcode}.json`);
      const json = await response.json();
      if (json.status === 1) {
        Alert.alert('Product Found', `Product: ${json.product.product_name}`);
      } else {
        Alert.alert('Product Not Found', 'This product is not listed in Open Food Facts database.');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch data from Open Food Facts.');
    }
  };

  return (
    <View style={styles.container}>
      <CameraView
    style={styles.camera}
    facing={CameraType.back}
    onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
    barcodeScannerSettings={{
    barcodeTypes: [BarCodeScanner.Constants.BarCodeType.qr, BarCodeScanner.Constants.BarCodeType.ean13],
  }}
  >
        <View style={styles.buttonContainer}>
          <Button onPress={() => setFacing(f => f === 'back' ? 'front' : 'back')} title="Flip Camera" />
          {scanned && (
            <Button onPress={() => setScanned(false)} title="Tap to Scan Again" />
          )}
        </View>
      </CameraView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  camera: {
    flex: 1,
    width: '100%',
  },
  buttonContainer: {
    flex: 0,
    flexDirection: 'row',
    justifyContent: 'center',
  },
});
