import React, { useState } from 'react';
import { StyleSheet, View, Text, Button, Alert } from 'react-native';
import { RNCamera } from 'react-native-camera';

export default function ScannerScreen() {
  const [scanned, setScanned] = useState(false);

  const handleBarCodeRead = (e: { type: any; data: any; }) => {
    setScanned(true);
    Alert.alert('Barcode Found!', `Type: ${e.type}\nData: ${e.data}`);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Scan your Barcode</Text>
      <RNCamera
        style={styles.preview}
        onBarCodeRead={scanned ? undefined : handleBarCodeRead}
        type={RNCamera.Constants.Type.back}
        captureAudio={false}
        barCodeTypes={[RNCamera.Constants.BarCodeType.qr, RNCamera.Constants.BarCodeType.code128]} // You can specify types here
      >
        {scanned && (
          <Button title={'Tap to Scan Again'} onPress={() => setScanned(false)} />
        )}
      </RNCamera>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'black',
  },
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    padding: 20,
  },
});
