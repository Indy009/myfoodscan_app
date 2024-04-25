import React, { useState, useRef, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  Button,
  TouchableOpacity,
  ScrollView,
  Image,
  Pressable,
  FlatList,
} from "react-native";
import { Text as StyledText } from "@/components/Themed";
import { CameraView, useCameraPermissions } from "expo-camera/next";
import { BarCodeScanner } from "expo-barcode-scanner";
import { Modalize } from "react-native-modalize";
import { CameraType } from "expo-camera";
import { Dimensions } from "react-native";

import { X } from "lucide-react-native";
import { CheckIcon, XIcon } from "lucide-react-native";

import {
  dietaryOptions,
  SelectedOptions,
} from "@/components/DietaryPreferences";
import { doc, getDoc } from "firebase/firestore";
import { db, auth } from "@/config/firebaseConfig";

type ProductType = {
  product_name: string;
  brands: string;
  selected_images: {
    front: {
      display: {
        en: string;
      };
    };
  };
  ingredients_text: string;
  allergens_tags?: string[];
};

type UserDietaryPreferences = {
  dietaryPreferences: SelectedOptions;
};

export default function ScannerScreen() {
  const [facing, setFacing] = useState(CameraType.back);
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [productInfo, setProductInfo] = useState<string | null>(null);
  const [userDietaryPreferences, setUserDietaryPreferences] =
    useState<SelectedOptions>({});

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

  const fetchUserDietaryPreferences = async (userId: string) => {
    // Retrieve user preferences and set them in state
    const docRef = doc(db, "users", userId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      setUserDietaryPreferences(docSnap.data().dietaryPreferences);
    }
  };

  const handleBarCodeScanned = async ({ data }: { data: any }) => {
    setScanned(true);
    await fetchDataFromAPI(data);
    if (auth.currentUser) {
      await fetchUserDietaryPreferences(auth.currentUser.uid);
    }
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

  const checkCompliance = (
    allergensTags: string[]
  ): { [key: string]: boolean } => {
    return dietaryOptions.reduce<{ [key: string]: boolean }>((acc, option) => {
      const isCompliant = !allergensTags.some((tag) =>
        option.keywords.includes(tag.replace("en:", ""))
      );

      acc[option.key] = isCompliant;
      return acc;
    }, {});
  };

  const renderDietaryCompliance = (product: ProductType) => {
    const compliance = checkCompliance(product.allergens_tags || []);

    const renderItem = ({ item }) => (
      <View style={styles.dietaryOptionContainer}>
        <Text style={styles.dietaryOptionText}>{item.label}</Text>
        {compliance[item.key] ? (
          <CheckIcon size={24} color="green" />
        ) : (
          <XIcon size={24} color="red" />
        )}
      </View>
    );

    return (
      <FlatList
        data={dietaryOptions}
        renderItem={renderItem}
        keyExtractor={(item) => item.key}
        numColumns={2}
        // Ensure there is no extra spacing on the sides
        contentContainerStyle={styles.dietaryOptionsList}
      />
    );
  };
  const renderProductDetails = (product: ProductType) => {
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
          <ScrollView
            style={{
              height: 140,
              borderColor: "gainsboro",
              borderWidth: 4,
            }}
            contentContainerStyle={{
              padding: 4,
              paddingBottom: 20, // This will provide space at the bottom inside the scroll view
            }}
            showsVerticalScrollIndicator={true} // Show scrollbar while scrolling
          >
            <Text style={styles.ingredientsText}>
              {ingredients_text || "Ingredients not available."}
            </Text>
          </ScrollView>
          <View style={styles.complianceContainer}>
            <Text style={styles.dietaryHeading}>Dietary Preferences: </Text>
            {renderDietaryCompliance(product)}
          </View>
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
        scrollViewProps={{
          showsVerticalScrollIndicator: true,
          contentContainerStyle: styles.modalContainerContent,
        }}
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
    flex: 1, // This will make sure the container takes up the remaining space
    justifyContent: "center",
    marginRight: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#cccccc",
    marginTop: 38,
    paddingBottom: 20,
  },
  productImage: {
    width: 350,
    height: 350,
    borderRadius: 10,
    alignSelf: "center",
  },
  productTextContainer: {
    flex: 1,
    justifyContent: "center",
  },
  productName: {
    fontSize: 18,
    fontWeight: "bold",
    flexShrink: 1,
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
  modalContainerContent: { paddingBottom: 20 },

  heading: {
    fontSize: 22,
    fontWeight: "bold",
    marginTop: 10,
  },
  dietaryHeading: {
    fontWeight: "bold",
    marginTop: 10,
    fontSize: 16,
  },
  dietaryOption: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  dietaryOptionText: {},
  dietaryOptionContainer: {
    flex: 1, // Take up all available space in the column
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 8,
    // Adjust the margin as needed, or remove it if you're handling spacing in the list
    margin: 5,
  },
  dietaryOptionsList: {
    // If you want no padding on the sides, set paddingHorizontal to 0
    paddingHorizontal: 0,
  },

  complianceContainer: {
    marginTop: 16,
  },

  closeButton: {
    position: "absolute",
    top: -10,
    right: -10,
    padding: 10,
    zIndex: 2,
  },
});
