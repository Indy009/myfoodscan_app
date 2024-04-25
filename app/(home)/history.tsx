import {
  StyleSheet,
  FlatList,
  Image,
  ScrollView,
  Dimensions,
  View,
  Text,
  ActivityIndicator,
} from "react-native";
import { Text as StyledText, View as StyledView } from "@/components/Themed";

import { useFocusEffect } from "@react-navigation/native";
import { useState, useCallback } from "react";
import { CheckIcon, XIcon } from "lucide-react-native";
import { db, auth } from "@/config/firebaseConfig"; // Import your Firebase configuration
import { doc, getDoc } from "firebase/firestore";
import { User } from "firebase/auth";
import { dietaryOptions } from "@/components/DietaryPreferences";

type Product = {
  code: string;
  selected_images: {
    front: {
      display: { en: string };
      small: { en: string };
      thumb: { en: string };
    };
  };
  product_name: string;
  ingredients_text_with_allergens: string;
  allergens: string[];
  allergens_tags?: string[];
};

type ProductResponse = {
  status: number;
  code: string;
  product?: Product;
};

const screenWidth = Dimensions.get("window").width;
const productWidth = (screenWidth - 40) / 2;

export default function HistoryScreen() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [dietaryPreferences, setDietaryPreferences] = useState({});

  const fetchDietaryPreferences = async (user: User) => {
    const userPrefDoc = doc(db, "users", user.uid);
    const userSnapshot = await getDoc(userPrefDoc);

    if (userSnapshot.exists()) {
      const data = userSnapshot.data();
      return data.dietaryPreferences;
    } else {
      console.log("No such document!");
    }
  };

  const checkCompliance = (allergenTags: string[], preferences: any) => {
    for (const [preference, isActive] of Object.entries(preferences)) {
      if (isActive) {
        const option = dietaryOptions.find(
          (option) => option.key === preference
        );

        // Only proceed if keywords exist
        if (option?.keywords) {
          // Check if any of the allergen tags match the keywords
          if (
            allergenTags.some((allergenTag) =>
              option.keywords.includes(allergenTag.replace("en:", ""))
            )
          ) {
            return false; // found an allergen, return false (X mark)
          }
        }
      }
    }
    return true; // no allergens found, return true (check mark)
  };

  const eanCodes: string[] = [
    "070470403915",
    "0009800895250",
    "0025293001718",
    "00016000106673",
    "0818290010605",
    "00051000032348",
    "00016000147119",
    "0041190409457",
    "0070662402030",
    "0072250914765",
  ];

  const getProduct = async (ean: string): Promise<Product | null> => {
    const url = `https://world.openfoodfacts.net/api/v0/product/${ean}`;

    try {
      const res = await fetch(url, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });
      const result: ProductResponse = await res.json();
      if (result.status === 0) {
        console.log("Product not found or API call failed: ", result.code);
        return null;
      }
      const allergensArray = result.product?.allergens_tags || [];
      if (result.product) {
        return {
          ...result.product,
          code: result.product.code, // Ensure code is always assigned
          allergens: allergensArray,
        };
      }
      return null;
    } catch (error) {
      console.error("Failed to fetch product:", error);
      return null;
    }
  };

  const fetchProducts = async () => {
    setLoading(true);
    const fetchedProducts: Product[] = [];

    for (const ean of eanCodes) {
      const product = await getProduct(ean);
      if (product) {
        fetchedProducts.push(product);
      }
    }

    return fetchedProducts;
  };

  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      const fetchAllData = async () => {
        try {
          const user = auth.currentUser;
          if (user && isActive) {
            const preferences = await fetchDietaryPreferences(user);
            setDietaryPreferences(preferences);
            const fetchedProducts = await fetchProducts();
            setProducts(fetchedProducts);
          }
        } catch (error) {
          console.error(error);
        } finally {
          if (isActive) setLoading(false);
        }
      };

      fetchAllData();

      // Return a cleanup function to set isActive to false when screen loses focus
      return () => {
        isActive = false;
      };
    }, [])
  );

  return (
    <StyledView style={styles.container}>
      <ScrollView style={{ paddingTop: 70 }}>
        <StyledText style={styles.title}>History</StyledText>
        <View style={styles.listContent}>
          {loading ? (
            <ActivityIndicator
              size="large"
              color="#F4B342"
              style={{
                marginTop: 40,
                justifyContent: "center",
                alignItems: "center",
              }}
            />
          ) : products.length > 0 ? (
            <FlatList
              data={products}
              keyExtractor={(item) => item.code}
              renderItem={({ item }) => {
                const compliant = checkCompliance(
                  item.allergens_tags || [],
                  dietaryPreferences
                );
                const Icon = compliant ? CheckIcon : XIcon;
                const imageUrl =
                  item.selected_images?.front?.small?.en ||
                  "https://via.placeholder.com/200";
                return (
                  <View style={styles.productContainer}>
                    <Image
                      source={{
                        uri: imageUrl,
                      }}
                      style={styles.image}
                    />
                    <View style={styles.productContent}>
                      <View
                        style={[compliant ? styles.checkIcon : styles.xIcon]}
                      >
                        <Icon strokeWidth={2.5} color="#000" />
                      </View>
                      <Text
                        style={styles.productText}
                        numberOfLines={1}
                        ellipsizeMode="tail"
                      >
                        {item.product_name}
                      </Text>
                    </View>
                  </View>
                );
              }}
              numColumns={2}
              scrollEnabled={false}
              columnWrapperStyle={styles.listWrapper}
            />
          ) : (
            <Text>No product found</Text>
          )}
        </View>
      </ScrollView>
    </StyledView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontSize: 40,
    fontWeight: "bold",
    paddingHorizontal: 10,
    paddingBottom: 20,
  },
  image: {
    width: 150,
    height: 150,
    borderRadius: 10,
  },
  checkIcon: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#9AEF65",
    borderRadius: 999,
    padding: 2,
    width: 30,
    height: 30,
  },
  xIcon: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#E83E3D",
    borderRadius: 999,
    padding: 2,
    width: 30,
    height: 30,
  },
  listContent: {
    // display: "flex",
    // justifyContent: "center",
  },
  listWrapper: {
    justifyContent: "space-between",
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  productContainer: {
    padding: 8,
    backgroundColor: "#E9E9E9",
    alignItems: "center",
    width: productWidth - 10,
    marginHorizontal: 5,
    marginVertical: 10,
    borderRadius: 6,
  },
  productContent: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E9E9E9",
    paddingHorizontal: 8,
    marginTop: 8,
  },
  productText: {
    fontSize: 18,
    fontWeight: "500",
    marginLeft: 4,
    flexShrink: 1,
  },
});
