import React, { useState, useRef } from 'react';
import { StyleSheet, View, Text, Button, TouchableOpacity, ScrollView, Image } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera/next';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { Modalize } from 'react-native-modalize';
import { CameraType } from 'expo-camera';
import { Dimensions } from 'react-native';


export default function App() {
  const [facing, setFacing] = useState(CameraType.back);
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [productInfo, setProductInfo] = useState<string | null>(null);  const modalizeRef = useRef<Modalize>(null);

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

  const handleBarCodeScanned = async ({ data }: { data: any }) => {
  setScanned(true);
  await fetchDataFromAPI(data);
  modalizeRef.current?.open();
  setTimeout(() => setScanned(false), 5000);
}

  const fetchDataFromAPI = async (barcode: string) => {
    try {
      const response = await fetch(`https://world.openfoodfacts.org/api/v0/product/${barcode}.json`);
      const json = await response.json();
      if (json.status === 1) {
        setProductInfo(JSON.stringify(json.product));
      } else {
        setProductInfo('Product Not Found');
      }
    } catch (error) {
      setProductInfo('Product not found. :(');
    }
  };

  const renderProductDetails = (product: any) => {
    if (!product) {
      return <Text>Loading...</Text>;
    }
  
    const { product_name, brands, image_url, ingredients_text } = product;
  
    return (
      <View style={styles.productDetailsContainer}>
        <Image
          source={{ uri: image_url }}
          style={styles.productImage}         
          resizeMode="contain"
        />
        <View style={styles.productTextContainer}>
          <Text style={styles.productName}>{product_name || 'Unknown Product'}</Text>
          <Text style={styles.productBrand}>Brand: {brands || 'Unknown Brand'}</Text>
          <Text style={styles.ingredientsHeading}>Contains:</Text>
          <Text style={styles.ingredientsText}>{ingredients_text || 'Ingredients not available.'}</Text>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <CameraView
        style={styles.camera}
        facing={facing}
        onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
        barcodeScannerSettings={{
          barcodeTypes: [BarCodeScanner.Constants.BarCodeType.qr, BarCodeScanner.Constants.BarCodeType.ean13],
        }}
      >
         <View style={styles.buttonContainer}>
            {scanned && (
              <Button onPress={() => setScanned(false)} title="Tap to Scan Again" />
            )}
          </View>
      </CameraView>
      
      <Modalize ref={modalizeRef} snapPoint={modalHeight} modalHeight={modalHeight}>
        <ScrollView style={styles.modalContent}>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => modalizeRef.current?.close()}
          >
            <Text style={styles.closeButtonText}>X</Text>
          </TouchableOpacity>
          {productInfo ? renderProductDetails(JSON.parse(productInfo)) : <Text>Loading...</Text>}
        </ScrollView>
      </Modalize>

    </View>
  );
}

const screenHeight = Dimensions.get('window').height;
const modalHeight = screenHeight * 0.8;

const styles = StyleSheet.create({

  productDetailsContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    borderBottomWidth: 1,
    borderBottomColor: '#cccccc',
    paddingBottom: 20,
  },
  productImage: {
    width: 100,
    height: 100,
    marginRight: 20,
  },
  productTextContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  productName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  productBrand: {
    fontSize: 14,
    color: '#666666',
  },
  ingredientsHeading: {
    fontWeight: 'bold',
    marginTop: 10,
    fontSize: 16,
  },
  ingredientsText: {
    fontSize: 14,
  },
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
  modalContent: {
    padding: 20,
  },
  
  heading: {
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 10,
  },
  
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    padding: 10,
    zIndex: 2,
  },
  closeButtonText: {
    fontSize: 18,
    color: '#000',
  },
});
