import React, { useState, useRef } from "react";
import {
  StyleSheet,
  View,
  Text,
  Button,
  TouchableOpacity,
  ScrollView,
  Image,
  Pressable,
} from "react-native";
import { Text as StyledText } from "@/components/Themed";
import { CameraView, useCameraPermissions } from "expo-camera/next";
import { BarCodeScanner } from "expo-barcode-scanner";
import { Modalize } from "react-native-modalize";
import { CameraType } from "expo-camera";
import { Dimensions } from "react-native";

import { X } from "lucide-react-native";

export default function ScannerScreen() {
  const [facing, setFacing] = useState(CameraType.back);
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [productInfo, setProductInfo] = useState<string | null>(null);
  const modalizeRef = useRef<Modalize>(null);

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <StyledText
          style={{ textAlign: "center", fontSize: 28, fontWeight: "800" }}
        >
          Before Scanning,
        </StyledText>
        <StyledText
          style={{ textAlign: "center", fontSize: 222, marginTop: 4 }}
        >
          We need your permission to show the camera
        </StyledText>
        <TouchableOpacity
          style={{
            backgroundColor: "#0A53C3",
            paddingVertical: 16,
            paddingHorizontal: 20,
            marginTop: 20,
            borderRadius: 10,
          }}
          onPress={requestPermission}
        >
          <StyledText style={{ fontSize: 16 }}>Grant Permission</StyledText>
        </TouchableOpacity>
      </View>
    );
  }

  const handleBarCodeScanned = async ({ data }: { data: any }) => {
    setScanned(true);
    await fetchDataFromAPI(data);
    modalizeRef.current?.open();
    setTimeout(() => setScanned(false), 5000);
  };

  const fetchDataFromAPI = async (barcode: string) => {
    try {
      const response = await fetch(
        `https://world.openfoodfacts.org/api/v0/product/${barcode}.json`
      );
      const json = await response.json();
      if (json.status === 1) {
        setProductInfo(JSON.stringify(json.product));
      } else {
        setProductInfo("Product Not Found");
      }
    } catch (error) {
      setProductInfo("Product not found. :(");
    }
  };

  const renderProductDetails = (product: any) => {
    if (!product) {
      return <Text>Loading...</Text>;
    }

    const { product_name, brands, selected_images, ingredients_text } = product;

    return (
      <View style={styles.productDetailsContainer}>
        <Image
          source={{ uri: selected_images.front.display.en }}
          style={styles.productImage}
          resizeMode="contain"
        />
        <View style={styles.productTextContainer}>
          <Text style={styles.productName}>
            {product_name || "Unknown Product"}
          </Text>
          <Text style={styles.productBrand}>
            Brand: {brands || "Unknown Brand"}
          </Text>
          <Text style={styles.ingredientsHeading}>Contains:</Text>
          <ScrollView style={{ height: "10%" }}>
            <Text style={styles.ingredientsText}>
              {ingredients_text || "Ingredients not available."}
            </Text>
          </ScrollView>
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
          barcodeTypes: [
            BarCodeScanner.Constants.BarCodeType.qr,
            BarCodeScanner.Constants.BarCodeType.ean13,
          ],
        }}
      >
        <View style={styles.buttonContainer}>
          {scanned && (
            <Button
              onPress={() => setScanned(false)}
              title="Tap to Scan Again"
            />
          )}
        </View>
      </CameraView>

      <Modalize
        ref={modalizeRef}
        snapPoint={modalHeight}
        modalHeight={modalHeight}
      >
        <ScrollView style={styles.modalContent}>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => modalizeRef.current?.close()}
          >
            <X color="#5071A5" size={32} strokeWidth={3} />
          </TouchableOpacity>
          {productInfo ? (
            renderProductDetails(JSON.parse(productInfo))
          ) : (
            <Text>Loading...</Text>
          )}
        </ScrollView>
      </Modalize>
    </View>
  );
}

const screenHeight = Dimensions.get("window").height;
const modalHeight = screenHeight * 0.8;

const styles = StyleSheet.create({
  productDetailsContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    borderBottomWidth: 1,
    borderBottomColor: "#cccccc",
    marginTop: 28,
    paddingBottom: 20,
  },
  productImage: {
    width: 200,
    height: 200,
    marginRight: 20,
    borderRadius: 10,
  },
  productTextContainer: {
    flex: 1,
    justifyContent: "center",
  },
  productName: {
    fontSize: 18,
    fontWeight: "bold",
  },
  productBrand: {
    fontSize: 14,
    color: "#666666",
  },
  ingredientsHeading: {
    fontWeight: "bold",
    marginTop: 10,
    fontSize: 16,
  },
  ingredientsText: {
    fontSize: 14,
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  camera: {
    flex: 1,
    width: "100%",
  },
  buttonContainer: {
    flex: 0,
    flexDirection: "row",
    justifyContent: "center",
  },
  modalContent: {
    padding: 20,
  },

  heading: {
    fontSize: 22,
    fontWeight: "bold",
    marginTop: 10,
  },

  closeButton: {
    position: "absolute",
    top: -10,
    right: -10,
    padding: 10,
    zIndex: 2,
  },
});
